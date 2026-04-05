import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { Card } from '@/shared/components/Card';
import { formatINR } from '@/core/use-cases/calculations';
import {
  startOfMonth, endOfMonth, isWithinInterval,
  subMonths, format, eachMonthOfInterval,
} from 'date-fns';
import {
  Plus, Trash2, Target, TrendingDown, AlertTriangle,
  CheckCircle, Edit2, ChevronDown, ChevronUp, BarChart2,
  Calendar, Repeat, Shield, TrendingUp, Home, X,
} from 'lucide-react';
import './Budgets.css';

/* ── Constants ─────────────────────────────────── */
const CATEGORIES = [
  'Food & Dining','Shopping','Transport','Entertainment','Health',
  'Housing','Utilities','Travel','Investment','Other',
];
const CATEGORY_EMOJIS = {
  'Food & Dining':'🍔','Shopping':'🛍️','Transport':'🚗',
  'Entertainment':'🎬','Health':'💊','Housing':'🏠',
  'Utilities':'⚡','Travel':'✈️','Investment':'📈','Other':'📦',
};
const FIXED_TYPES = [
  { value:'maintenance', label:'Maintenance',  icon:'🏠' },
  { value:'emi',         label:'EMI / Loan',   icon:'🏦' },
  { value:'insurance',   label:'Insurance',    icon:'🛡️' },
  { value:'sip',         label:'SIP / MF',     icon:'📈' },
  { value:'subscription',label:'Subscription', icon:'🔄' },
  { value:'other',       label:'Other Fixed',  icon:'📌' },
];

const FP_ICON_MAP = { maintenance:'🏠', emi:'🏦', insurance:'🛡️', sip:'📈', subscription:'🔄', other:'📌' };

/* ── Mini bar-chart helpers ─────────────────────── */
function getMonthlyTotals(transactions, months = 12) {
  const now = new Date();
  return eachMonthOfInterval({
    start: subMonths(startOfMonth(now), months - 1),
    end:   endOfMonth(now),
  }).map(monthDate => {
    const start = startOfMonth(monthDate);
    const end   = endOfMonth(monthDate);
    const income  = transactions.filter(t => t.type === 'income'  && isWithinInterval(new Date(t.date), { start, end })).reduce((a,t) => a+t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense' && isWithinInterval(new Date(t.date), { start, end })).reduce((a,t) => a+t.amount, 0);
    return { label: format(monthDate, 'MMM'), income, expense, net: income - expense };
  });
}

/* ── AnimatedBar (progress) ─────────────────────── */
const AnimatedBar = ({ pct, color }) => {
  const barRef = useRef(null);
  useEffect(() => {
    if (!barRef.current) return;
    barRef.current.style.width = '0';
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (barRef.current) barRef.current.style.width = `${pct}%`;
      });
    });
    return () => cancelAnimationFrame(t);
  }, [pct]);
  return (
    <div className="budget-bar-bg">
      <div ref={barRef} className="budget-bar-fill" style={{ background: color, transition: 'width 0.65s cubic-bezier(0.4,0,0.2,1)' }} />
    </div>
  );
};

/* ── Mini Chart ─────────────────────────────────── */
const MiniChart = ({ data, range }) => {
  const subset = range === '1m' ? data.slice(-1) : range === '3m' ? data.slice(-3) : data;
  const maxVal  = Math.max(...subset.map(d => Math.max(d.income, d.expense)), 1);
  const BAR_H   = 80;

  return (
    <div className="mini-chart">
      <div className="mini-chart__bars">
        {subset.map((d, i) => (
          <div key={i} className="mini-chart__group">
            <div className="mini-chart__bar-pair">
              <div
                className="mini-chart__bar mini-chart__bar--income"
                style={{ height: `${Math.max(3, (d.income / maxVal) * BAR_H)}px` }}
                title={`Income: ${formatINR(d.income)}`}
              />
              <div
                className="mini-chart__bar mini-chart__bar--expense"
                style={{ height: `${Math.max(3, (d.expense / maxVal) * BAR_H)}px` }}
                title={`Expense: ${formatINR(d.expense)}`}
              />
            </div>
            <span className="mini-chart__label">{d.label}</span>
          </div>
        ))}
      </div>
      <div className="mini-chart__legend">
        <span className="mini-chart__legend-dot mini-chart__legend-dot--income" /> Income
        <span className="mini-chart__legend-dot mini-chart__legend-dot--expense" /> Expense
      </div>
    </div>
  );
};

/* ── Budget Form ─────────────────────────────────── */
const BudgetForm = ({ onAdd, onClose }) => {
  const [category, setCategory] = useState('Food & Dining');
  const [amount, setAmount]     = useState('');
  const [error, setError]       = useState('');

  const handleAdd = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Enter a valid budget amount'); return;
    }
    onAdd({ category, limit: parseFloat(amount) });
    onClose();
  };

  return (
    <div className="budget-form-overlay" onClick={onClose}>
      <div className="budget-form-card animate-bounceIn" onClick={e => e.stopPropagation()}>
        <div className="budget-form__header">
          <div>
            <h3 className="budget-form__title">Set Monthly Budget</h3>
            <p className="budget-form__sub">Spending limit for a category</p>
          </div>
          <button className="budget-form__close tap-feedback" onClick={onClose}><X size={16}/></button>
        </div>

        <div className="budget-form__field">
          <label className="budget-form__label">Category</label>
          <select className="budget-form__select" value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_EMOJIS[c]} {c}</option>)}
          </select>
        </div>
        <div className="budget-form__field">
          <label className="budget-form__label">Monthly Limit (₹)</label>
          <input
            className={`budget-form__input ${error ? 'budget-form__input--error' : ''}`}
            type="number" placeholder="e.g. 5000" value={amount}
            onChange={e => { setAmount(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          {error && <span className="budget-form__error">{error}</span>}
        </div>
        <div className="budget-form__actions">
          <button className="budget-form__cancel tap-feedback" onClick={onClose}>Cancel</button>
          <button className="budget-form__submit tap-feedback" onClick={handleAdd}>Add Budget</button>
        </div>
      </div>
    </div>
  );
};

/* ── Fixed Payment Form ───────────────────────────── */
const FixedPaymentForm = ({ existing, onSave, onClose }) => {
  const [name,   setName]   = useState(existing?.name   || '');
  const [amount, setAmount] = useState(existing?.amount || '');
  const [type,   setType]   = useState(existing?.type   || 'emi');
  const [error,  setError]  = useState('');

  const handleSave = () => {
    if (!name.trim())                                    { setError('Enter a payment name');    return; }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) { setError('Enter a valid amount'); return; }
    onSave({ name: name.trim(), amount: parseFloat(amount), type, icon: FP_ICON_MAP[type], category: FIXED_TYPES.find(t=>t.value===type)?.label || type });
    onClose();
  };

  return (
    <div className="budget-form-overlay" onClick={onClose}>
      <div className="budget-form-card animate-bounceIn" onClick={e => e.stopPropagation()}>
        <div className="budget-form__header">
          <div>
            <h3 className="budget-form__title">{existing ? 'Edit' : 'Add'} Fixed Payment</h3>
            <p className="budget-form__sub">Recurring monthly deduction</p>
          </div>
          <button className="budget-form__close tap-feedback" onClick={onClose}><X size={16}/></button>
        </div>

        <div className="budget-form__field">
          <label className="budget-form__label">Type</label>
          <select className="budget-form__select" value={type} onChange={e => setType(e.target.value)}>
            {FIXED_TYPES.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
          </select>
        </div>
        <div className="budget-form__field">
          <label className="budget-form__label">Name / Description</label>
          <input
            className={`budget-form__input ${error && !name.trim() ? 'budget-form__input--error' : ''}`}
            type="text" placeholder="e.g. Home Loan EMI, HDFC Insurance"
            value={name} onChange={e => { setName(e.target.value); setError(''); }}
          />
        </div>
        <div className="budget-form__field">
          <label className="budget-form__label">Monthly Amount (₹)</label>
          <input
            className={`budget-form__input ${error && name.trim() ? 'budget-form__input--error' : ''}`}
            type="number" placeholder="e.g. 12000"
            value={amount} onChange={e => { setAmount(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            autoFocus
          />
          {error && <span className="budget-form__error">{error}</span>}
        </div>
        <div className="budget-form__actions">
          <button className="budget-form__cancel tap-feedback" onClick={onClose}>Cancel</button>
          <button className="budget-form__submit tap-feedback" onClick={handleSave}>{existing ? 'Save Changes' : 'Add Payment'}</button>
        </div>
      </div>
    </div>
  );
};

/* ── Budget Card ─────────────────────────────────── */
const BudgetCard = ({ budget, spent, onDelete, isAdmin }) => {
  const pct       = budget.limit > 0 ? Math.min((spent / budget.limit) * 100, 100) : 0;
  const remaining = budget.limit - spent;
  const isOver    = spent > budget.limit;
  const isWarning = pct >= 80 && !isOver;
  const statusColor = isOver ? 'var(--accent-red)' : isWarning ? 'var(--accent-amber)' : 'var(--accent-green)';
  const statusIcon  = isOver ? <AlertTriangle size={13}/> : isWarning ? <TrendingDown size={13}/> : <CheckCircle size={13}/>;
  const statusText  = isOver ? `Over by ${formatINR(Math.abs(remaining))}` : isWarning ? 'Almost at limit' : `${formatINR(remaining)} left`;

  return (
    <Card className="budget-card tap-feedback">
      <div className="budget-card__top">
        <div className="budget-card__left">
          <span className="budget-card__emoji">{CATEGORY_EMOJIS[budget.category] || '📦'}</span>
          <div>
            <span className="budget-card__cat">{budget.category}</span>
            <span className="budget-card__period">This month</span>
          </div>
        </div>
        {isAdmin && (
          <button className="budget-card__delete tap-feedback" onClick={() => onDelete(budget.id)} title="Remove budget">
            <Trash2 size={13}/>
          </button>
        )}
      </div>
      <div className="budget-card__amounts">
        <span className="budget-card__spent">{formatINR(spent)}</span>
        <span className="budget-card__limit">of {formatINR(budget.limit)}</span>
      </div>
      <AnimatedBar pct={pct} color={statusColor} />
      <div className="budget-card__status" style={{ color: statusColor }}>
        {statusIcon}
        <span>{statusText}</span>
        <span className="budget-card__pct">{Math.round(pct)}%</span>
      </div>
    </Card>
  );
};

/* ── Fixed Payment Row ───────────────────────────── */
const FixedPaymentRow = ({ fp, isAdmin, onEdit, onDelete }) => (
  <div className="fp-row animate-fadeInUp">
    <span className="fp-row__icon">{fp.icon || '📌'}</span>
    <div className="fp-row__info">
      <span className="fp-row__name">{fp.name}</span>
      <span className="fp-row__type">{FIXED_TYPES.find(t=>t.value===fp.type)?.label || fp.type} · Monthly</span>
    </div>
    <span className="fp-row__amount">{formatINR(fp.amount)}</span>
    {isAdmin && (
      <div className="fp-row__actions">
        <button className="fp-row__btn tap-feedback" onClick={() => onEdit(fp)} title="Edit"><Edit2 size={13}/></button>
        <button className="fp-row__btn fp-row__btn--del tap-feedback" onClick={() => onDelete(fp.id)} title="Delete"><Trash2 size={13}/></button>
      </div>
    )}
  </div>
);

/* ── Main Budgets Page ───────────────────────────── */
export const Budgets = () => {
  const {
    transactions, currentUser,
    budgets = [], addBudget, deleteBudget,
    fixedPayments = [], addFixedPayment, updateFixedPayment, deleteFixedPayment,
  } = useStore();

  const isAdmin = currentUser.role === 'admin';
  const [showBudgetForm,  setShowBudgetForm]  = useState(false);
  const [showFPForm,      setShowFPForm]      = useState(false);
  const [editingFP,       setEditingFP]       = useState(null);
  const [chartRange,      setChartRange]      = useState('3m');
  const [showFPSection,   setShowFPSection]   = useState(true);
  const [showChartSection,setShowChartSection]= useState(true);

  const now        = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd   = endOfMonth(now);
  const currentMonth = format(now, 'MMMM yyyy');

  /* monthly expenses */
  const monthlyExpenses = useMemo(() =>
    transactions.filter(t =>
      t.type === 'expense' &&
      isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
    ), [transactions]);

  const spentByCategory = useMemo(() => {
    const map = {};
    monthlyExpenses.forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return map;
  }, [monthlyExpenses]);

  /* totals */
  const totalBudgeted   = budgets.reduce((a, b) => a + b.limit, 0);
  const totalSpent      = budgets.reduce((a, b) => a + (spentByCategory[b.category] || 0), 0);
  const totalFixed      = fixedPayments.reduce((a, fp) => a + fp.amount, 0);
  const totalExpenses   = monthlyExpenses.reduce((a, t) => a + t.amount, 0);
  const overBudgetCount = budgets.filter(b => (spentByCategory[b.category] || 0) > b.limit).length;
  const budgetRemaining = Math.max(0, totalBudgeted - totalSpent - totalFixed);
  const isOverBudget    = totalSpent + totalFixed > totalBudgeted;

  /* chart data */
  const chartData = useMemo(() => getMonthlyTotals(transactions, 12), [transactions]);

  /* handlers */
  const handleAddBudget = ({ category, limit }) => {
    addBudget({ id: `budget-${Date.now()}`, category, limit });
  };
  const handleSaveFP = (data) => {
    if (editingFP) { updateFixedPayment(editingFP.id, data); setEditingFP(null); }
    else addFixedPayment(data);
  };
  const handleEditFP = (fp) => { setEditingFP(fp); setShowFPForm(true); };

  return (
    <div className="budgets-page">

      {/* ─ Header ─ */}
      <div className="budgets__header animate-fadeInUp">
        <div>
          <h2 className="budgets__heading">Budgets</h2>
          <p className="budgets__subheading">{currentMonth} · Monthly overview</p>
        </div>
        <div className="budgets__header-actions">
          {isAdmin && (
            <>
              <button className="budgets__add-btn budgets__add-btn--secondary tap-feedback" onClick={() => { setEditingFP(null); setShowFPForm(true); }}>
                <Repeat size={15}/> Fixed Payment
              </button>
              <button className="budgets__add-btn tap-feedback" onClick={() => setShowBudgetForm(true)}>
                <Plus size={15}/> Set Budget
              </button>
            </>
          )}
        </div>
      </div>

      {/* ─ Summary Stats ─ */}
      <div className="budgets__summary animate-fadeInUp delay-50">
        <Card className="budget-stat">
          <div className="budget-stat__icon budget-stat__icon--blue"><Target size={17}/></div>
          <div>
            <span className="budget-stat__label">Total Budgeted</span>
            <span className="budget-stat__value">{formatINR(totalBudgeted)}</span>
          </div>
        </Card>
        <Card className="budget-stat">
          <div className="budget-stat__icon budget-stat__icon--red"><TrendingDown size={17}/></div>
          <div>
            <span className="budget-stat__label">Variable Spent</span>
            <span className="budget-stat__value">{formatINR(totalSpent)}</span>
          </div>
        </Card>
        <Card className="budget-stat">
          <div className="budget-stat__icon budget-stat__icon--amber"><Repeat size={17}/></div>
          <div>
            <span className="budget-stat__label">Fixed Payments</span>
            <span className="budget-stat__value">{formatINR(totalFixed)}</span>
          </div>
        </Card>
        <Card className="budget-stat">
          <div className={`budget-stat__icon ${isOverBudget ? 'budget-stat__icon--red' : 'budget-stat__icon--green'}`}>
            {isOverBudget ? <AlertTriangle size={17}/> : <CheckCircle size={17}/>}
          </div>
          <div>
            <span className="budget-stat__label">{isOverBudget ? 'Over Budget' : 'Still Available'}</span>
            <span className="budget-stat__value" style={{ color: isOverBudget ? 'var(--accent-red)' : 'var(--accent-green)' }}>
              {isOverBudget ? `-${formatINR(totalSpent + totalFixed - totalBudgeted)}` : formatINR(budgetRemaining)}
            </span>
          </div>
        </Card>
      </div>

      {/* ─ Budget Progress Banner ─ */}
      {totalBudgeted > 0 && (
        <Card className="budget-overview-banner animate-fadeInUp delay-100">
          <div className="bov__top">
            <span className="bov__title">Monthly Budget Progress</span>
            <span className="bov__meta">{formatINR(totalSpent + totalFixed)} of {formatINR(totalBudgeted)} used</span>
          </div>
          <AnimatedBar
            pct={totalBudgeted > 0 ? Math.min(((totalSpent + totalFixed) / totalBudgeted) * 100, 100) : 0}
            color={isOverBudget ? 'var(--accent-red)' : totalSpent + totalFixed > totalBudgeted * 0.8 ? 'var(--accent-amber)' : 'var(--accent-green)'}
          />
          <div className="bov__breakdown">
            <span className="bov__seg bov__seg--expense">Variable: {formatINR(totalSpent)}</span>
            <span className="bov__seg bov__seg--fixed">Fixed: {formatINR(totalFixed)}</span>
            <span className="bov__seg bov__seg--remaining" style={{ color: isOverBudget ? 'var(--accent-red)' : 'var(--accent-green)' }}>
              {isOverBudget ? `Exceeded by ${formatINR(totalSpent + totalFixed - totalBudgeted)}` : `${formatINR(budgetRemaining)} left`}
            </span>
          </div>
        </Card>
      )}

      {/* ─ Fixed Payments Section ─ */}
      <Card className="section-card animate-fadeInUp delay-150">
        <div className="section-card__head" onClick={() => setShowFPSection(v => !v)}>
          <div className="section-card__title-group">
            <Repeat size={16} className="section-card__icon icon-interactive" />
            <span className="section-card__title">Fixed Monthly Payments</span>
            <span className="section-card__badge">{fixedPayments.length}</span>
          </div>
          <div className="section-card__right">
            <span className="section-card__total">{formatINR(totalFixed)} / mo</span>
            {showFPSection ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}
          </div>
        </div>

        {showFPSection && (
          <div className="section-card__body">
            {fixedPayments.length === 0 ? (
              <div className="section-empty">
                <span className="section-empty__icon">🔄</span>
                <p className="section-empty__text">No fixed payments added yet.</p>
                {isAdmin && (
                  <button className="section-empty__btn tap-feedback" onClick={() => { setEditingFP(null); setShowFPForm(true); }}>
                    <Plus size={13}/> Add Fixed Payment
                  </button>
                )}
              </div>
            ) : (
              <div className="fp-list">
                {fixedPayments.map((fp, i) => (
                  <div key={fp.id} className={`delay-${Math.min(i * 50, 300)}`}>
                    <FixedPaymentRow fp={fp} isAdmin={isAdmin} onEdit={handleEditFP} onDelete={deleteFixedPayment} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* ─ Budget Cards ─ */}
      {budgets.length === 0 ? (
        <Card className="budgets__empty animate-fadeInUp delay-200">
          <div className="budgets__empty-icon">🎯</div>
          <h3 className="budgets__empty-title">No category budgets yet</h3>
          <p className="budgets__empty-desc">
            {isAdmin
              ? 'Set monthly limits for your spending categories to stay on track.'
              : 'No budgets have been set yet. Ask an admin to set them up.'}
          </p>
          {isAdmin && (
            <button className="budgets__add-btn budgets__add-btn--center tap-feedback" onClick={() => setShowBudgetForm(true)}>
              <Plus size={15}/> Create First Budget
            </button>
          )}
        </Card>
      ) : (
        <div className="budgets__grid animate-fadeInUp delay-200">
          {budgets.map((b, i) => (
            <div key={b.id} className={`delay-${Math.min(i * 50, 400)}`}>
              <BudgetCard
                budget={b}
                spent={spentByCategory[b.category] || 0}
                onDelete={deleteBudget}
                isAdmin={isAdmin}
              />
            </div>
          ))}
        </div>
      )}

      {/* ─ Untracked Spending ─ */}
      {Object.keys(spentByCategory).filter(cat => !budgets.find(b => b.category === cat)).length > 0 && (
        <Card className="budgets__untracked animate-fadeInUp delay-250">
          <h3 className="budgets__untracked-title">Untracked Spending</h3>
          <p className="budgets__untracked-sub">Categories with expenses this month but no budget set</p>
          <div className="budgets__untracked-list">
            {Object.entries(spentByCategory)
              .filter(([cat]) => !budgets.find(b => b.category === cat))
              .map(([cat, amt]) => (
                <div key={cat} className="untracked-item">
                  <span className="untracked-item__emoji">{CATEGORY_EMOJIS[cat] || '📦'}</span>
                  <span className="untracked-item__cat">{cat}</span>
                  <span className="untracked-item__amt">{formatINR(amt)}</span>
                  {isAdmin && (
                    <button className="untracked-item__add tap-feedback" onClick={() => setShowBudgetForm(true)} title="Add budget">
                      <Plus size={12}/>
                    </button>
                  )}
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* ─ Spending Overview Chart ─ */}
      <Card className="section-card animate-fadeInUp delay-300">
        <div className="section-card__head" onClick={() => setShowChartSection(v => !v)}>
          <div className="section-card__title-group">
            <BarChart2 size={16} className="section-card__icon icon-interactive"/>
            <span className="section-card__title">Spending Overview</span>
          </div>
          <div className="section-card__right">
            <div className="chart-range-tabs" onClick={e => e.stopPropagation()}>
              {[['1m','1M'],['3m','3M'],['12m','Year']].map(([val,lbl]) => (
                <button
                  key={val}
                  className={`chart-tab tap-feedback ${chartRange === val ? 'chart-tab--active' : ''}`}
                  onClick={() => setChartRange(val)}
                >{lbl}</button>
              ))}
            </div>
            {showChartSection ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}
          </div>
        </div>

        {showChartSection && (
          <div className="section-card__body animate-fadeIn">
            <MiniChart data={chartData} range={chartRange} />
            {/* Monthly summary table */}
            <div className="chart-summary">
              {(chartRange === '1m' ? chartData.slice(-1) : chartRange === '3m' ? chartData.slice(-3) : chartData).map((d, i) => (
                <div key={i} className="chart-summary__row">
                  <span className="chart-summary__month">{d.label}</span>
                  <span className="chart-summary__income">+{formatINR(d.income)}</span>
                  <span className="chart-summary__expense">-{formatINR(d.expense)}</span>
                  <span className="chart-summary__net" style={{ color: d.net >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                    {d.net >= 0 ? '+' : ''}{formatINR(d.net)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* ─ Modals ─ */}
      {showBudgetForm && <BudgetForm onAdd={handleAddBudget} onClose={() => setShowBudgetForm(false)} />}
      {showFPForm && (
        <FixedPaymentForm
          existing={editingFP}
          onSave={handleSaveFP}
          onClose={() => { setShowFPForm(false); setEditingFP(null); }}
        />
      )}
    </div>
  );
};
