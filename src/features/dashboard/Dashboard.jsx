import React, { useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Card } from '@/shared/components/Card';
import { TransactionForm } from '@/features/transactions/TransactionForm';
import {
  calcTotalBalance, calcTotalIncome, calcTotalExpenses,
  calcMonthlyData, calcCategoryBreakdown, formatINR, formatINRCompact
} from '@/core/use-cases/calculations';
import { CATEGORY_COLORS } from '@/core/domain/mockData';
import './Dashboard.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="chart-tooltip__item" style={{ color: p.color }}>
          {p.name}: {formatINRCompact(p.value)}
        </p>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{d.name}</p>
      <p className="chart-tooltip__item" style={{ color: d.payload.fill }}>
        {formatINR(d.value)} ({d.payload.percentage}%)
      </p>
    </div>
  );
};

export const Dashboard = () => {
  const { transactions, currentUser } = useStore();
  const isAdmin = currentUser.role === 'admin';
  const [formOpen, setFormOpen] = useState(false);

  const balance  = useMemo(() => calcTotalBalance(transactions), [transactions]);
  const income   = useMemo(() => calcTotalIncome(transactions), [transactions]);
  const expenses = useMemo(() => calcTotalExpenses(transactions), [transactions]);
  const monthly  = useMemo(() => calcMonthlyData(transactions, 6), [transactions]);
  const breakdown = useMemo(() => calcCategoryBreakdown(transactions).slice(0, 6), [transactions]);
  const recentTxns = useMemo(() =>
    [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    [transactions]
  );

  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

  return (
    <div className="dashboard">
      {/* Header with Add Transaction */}
      <div className="dashboard__header animate-fadeInUp">
        <div>
          <h2 className="dashboard__heading">Overview</h2>
          <p className="dashboard__subheading">Your financial snapshot</p>
        </div>
        {isAdmin && (
          <button className="dashboard__add-btn" onClick={() => setFormOpen(true)}>
            <Plus size={16} />
            Add Transaction
          </button>
        )}
      </div>

      {formOpen && (
        <TransactionForm isOpen={formOpen} onClose={() => setFormOpen(false)} />
      )}
      {/* Summary Cards */}
      <div className="dashboard__summary animate-fadeInUp">
        <Card className="summary-card summary-card--balance">
          <div className="summary-card__top">
            <div className="summary-card__icon summary-card__icon--balance"><Wallet size={20} /></div>
            <span className="summary-card__label">Total Balance</span>
          </div>
          <div className="summary-card__value">{formatINR(balance)}</div>
          <div className="summary-card__sub">
            <span className="summary-card__rate summary-card__rate--positive">
              <TrendingUp size={12} /> {savingsRate}% savings rate
            </span>
          </div>
        </Card>

        <Card className="summary-card summary-card--income animate-fadeInUp delay-100">
          <div className="summary-card__top">
            <div className="summary-card__icon summary-card__icon--income"><ArrowUpRight size={20} /></div>
            <span className="summary-card__label">Total Income</span>
          </div>
          <div className="summary-card__value summary-card__value--income">{formatINR(income)}</div>
          <div className="summary-card__bar">
            <div className="summary-card__bar-fill summary-card__bar-fill--income" style={{ width: '100%' }} />
          </div>
        </Card>

        <Card className="summary-card summary-card--expense animate-fadeInUp delay-200">
          <div className="summary-card__top">
            <div className="summary-card__icon summary-card__icon--expense"><ArrowDownRight size={20} /></div>
            <span className="summary-card__label">Total Expenses</span>
          </div>
          <div className="summary-card__value summary-card__value--expense">{formatINR(expenses)}</div>
          <div className="summary-card__bar">
            <div
              className="summary-card__bar-fill summary-card__bar-fill--expense"
              style={{ width: `${income > 0 ? Math.min((expenses / income) * 100, 100) : 0}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="dashboard__charts animate-fadeInUp delay-200">
        <Card className="chart-card chart-card--trend">
          <div className="chart-card__header">
            <div>
              <h3 className="chart-card__title">Balance Trend</h3>
              <p className="chart-card__subtitle">Last 6 months overview</p>
            </div>
            <div className="chart-legend">
              <span className="chart-legend__item chart-legend__item--income">Income</span>
              <span className="chart-legend__item chart-legend__item--expense">Expense</span>
            </div>
          </div>
          {monthly.every(m => m.income === 0 && m.expenses === 0) ? (
            <div className="chart-empty">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthly} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} tickFormatter={formatINRCompact} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="income" name="Income" stroke="var(--accent-green)" strokeWidth={2.5} dot={{ r: 3, fill: 'var(--accent-green)', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="expenses" name="Expenses" stroke="var(--accent-red)" strokeWidth={2.5} dot={{ r: 3, fill: 'var(--accent-red)', strokeWidth: 0 }} activeDot={{ r: 5 }} strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="chart-card chart-card--pie">
          <div className="chart-card__header">
            <div>
              <h3 className="chart-card__title">Spending Breakdown</h3>
              <p className="chart-card__subtitle">By category</p>
            </div>
          </div>
          {breakdown.length === 0 ? (
            <div className="chart-empty">No expenses yet</div>
          ) : (
            <div className="pie-chart-wrap">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={breakdown} dataKey="amount" nameKey="category" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {breakdown.map((entry) => (
                      <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || '#6B7280'} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {breakdown.map((b) => (
                  <div key={b.category} className="pie-legend__item">
                    <span className="pie-legend__dot" style={{ background: CATEGORY_COLORS[b.category] || '#6B7280' }} />
                    <span className="pie-legend__cat">{b.category}</span>
                    <span className="pie-legend__pct">{b.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="dashboard__recent animate-fadeInUp delay-300">
        <div className="chart-card__header">
          <div>
            <h3 className="chart-card__title">Recent Transactions</h3>
            <p className="chart-card__subtitle">Your latest activity</p>
          </div>
        </div>
        {recentTxns.length === 0 ? (
          <div className="empty-state"><p className="empty-state__text">No transactions yet. Add one to get started!</p></div>
        ) : (
          <div className="recent-list">
            {recentTxns.map((txn, i) => (
              <div key={txn.id} className="recent-item animate-fadeInUp" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="recent-item__icon" style={{ background: `${CATEGORY_COLORS[txn.category]}22`, color: CATEGORY_COLORS[txn.category] }}>
                  {txn.category.charAt(0)}
                </div>
                <div className="recent-item__info">
                  <span className="recent-item__title">{txn.title}</span>
                  <span className="recent-item__cat">
                    {txn.category} · {new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <span className={`recent-item__amount recent-item__amount--${txn.type}`}>
                  {txn.type === 'income' ? '+' : '-'}{formatINR(txn.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
