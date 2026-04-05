import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Award, Target, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Card } from '@/shared/components/Card';
import {
  calcCategoryBreakdown, calcMonthlyComparison, calcMonthlyData,
  formatINR, formatINRCompact, getHighestSpendingCategory
} from '@/core/use-cases/calculations';
import { CATEGORY_COLORS } from '@/core/domain/mockData';
import './Insights.css';

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

export const Insights = () => {
  const { transactions } = useStore();
  const breakdown   = useMemo(() => calcCategoryBreakdown(transactions), [transactions]);
  const monthly     = useMemo(() => calcMonthlyData(transactions, 6), [transactions]);
  const comparison  = useMemo(() => calcMonthlyComparison(transactions), [transactions]);
  const topCat      = useMemo(() => getHighestSpendingCategory(breakdown), [breakdown]);

  const savingsThisMonth = comparison.lastMonth > comparison.thisMonth
    ? comparison.lastMonth - comparison.thisMonth
    : 0;
  const isSpendingMore = comparison.percentChange > 0;
  const isSameMonth    = comparison.percentChange === 0;

  return (
    <div className="insights-page">
      <div className="insights-grid animate-fadeInUp">
        <Card className="insight-card">
          <div className="insight-card__icon" style={{ background: topCat ? `${CATEGORY_COLORS[topCat.category]}20` : 'var(--bg-tertiary)', color: topCat ? CATEGORY_COLORS[topCat.category] : 'var(--text-tertiary)' }}>
            <Award size={20} />
          </div>
          <p className="insight-card__label">Top Spending Category</p>
          {topCat ? (
            <>
              <h3 className="insight-card__value">{topCat.category}</h3>
              <p className="insight-card__sub">{formatINR(topCat.amount)} · {topCat.percentage}% · {topCat.count} transactions</p>
            </>
          ) : (
            <p className="insight-card__value insight-card__value--empty">No data yet</p>
          )}
        </Card>

        <Card className="insight-card">
          <div className={`insight-card__icon ${isSpendingMore ? 'insight-card__icon--danger' : 'insight-card__icon--success'}`}>
            {isSpendingMore ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          </div>
          <p className="insight-card__label">vs Last Month</p>
          {(comparison.lastMonth > 0 || comparison.thisMonth > 0) ? (
            <>
              <h3 className={`insight-card__value ${isSpendingMore ? 'insight-card__value--danger' : 'insight-card__value--success'}`}>
                {isSameMonth ? 'Same' : `${Math.abs(comparison.percentChange)}% ${isSpendingMore ? 'more' : 'less'}`}
              </h3>
              <p className="insight-card__sub">This: {formatINR(comparison.thisMonth)} · Last: {formatINR(comparison.lastMonth)}</p>
            </>
          ) : (
            <p className="insight-card__value insight-card__value--empty">Not enough data</p>
          )}
        </Card>

        <Card className="insight-card">
          <div className="insight-card__icon insight-card__icon--savings"><Target size={20} /></div>
          <p className="insight-card__label">This Month Savings</p>
          <h3 className="insight-card__value insight-card__value--success">{formatINR(savingsThisMonth)}</h3>
          <p className="insight-card__sub">vs last month's spending</p>
        </Card>

        <Card className="insight-card">
          <div className="insight-card__icon insight-card__icon--info"><Zap size={20} /></div>
          <p className="insight-card__label">Avg Daily Spend</p>
          <h3 className="insight-card__value">{formatINR(Math.round(comparison.thisMonth / new Date().getDate()))}</h3>
          <p className="insight-card__sub">Based on this month</p>
        </Card>
      </div>

      <Card className="insights-chart-card animate-fadeInUp delay-150">
        <div className="chart-card__header">
          <div>
            <h3 className="chart-card__title">Monthly Income vs Expenses</h3>
            <p className="chart-card__subtitle">6-month comparison</p>
          </div>
        </div>
        {monthly.every(m => m.income === 0 && m.expenses === 0) ? (
          <div className="chart-empty">No data to display yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthly} barGap={4} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} tickFormatter={formatINRCompact} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" name="Income" fill="var(--accent-green)" radius={[4,4,0,0]} maxBarSize={36} />
              <Bar dataKey="expenses" name="Expenses" fill="var(--accent-red)" radius={[4,4,0,0]} maxBarSize={36} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card className="insights-breakdown animate-fadeInUp delay-300">
        <div className="chart-card__header">
          <div>
            <h3 className="chart-card__title">Expense Breakdown</h3>
            <p className="chart-card__subtitle">By category</p>
          </div>
        </div>
        {breakdown.length === 0 ? (
          <div className="chart-empty">No expenses yet</div>
        ) : (
          <div className="breakdown-list">
            {breakdown.map((item, i) => (
              <div key={item.category} className="breakdown-row animate-fadeInUp" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="breakdown-row__rank">#{i + 1}</div>
                <div className="breakdown-row__dot" style={{ background: CATEGORY_COLORS[item.category] || '#6B7280' }} />
                <span className="breakdown-row__cat">{item.category}</span>
                <div className="breakdown-row__bar-wrap">
                  <div className="breakdown-row__bar" style={{ width: `${item.percentage}%`, background: CATEGORY_COLORS[item.category] || '#6B7280' }} />
                </div>
                <span className="breakdown-row__pct">{item.percentage}%</span>
                <span className="breakdown-row__amt">{formatINR(item.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
