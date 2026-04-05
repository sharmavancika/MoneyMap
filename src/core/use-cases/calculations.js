import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, subDays } from 'date-fns';

export const calcTotalBalance = (transactions) =>
  transactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0);

export const calcTotalIncome = (transactions) =>
  transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);

export const calcTotalExpenses = (transactions) =>
  transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

export const calcMonthlyData = (transactions, months = 6) => {
  const now = new Date();
  return Array.from({ length: months }, (_, i) => {
    const target = subMonths(now, months - 1 - i);
    const start = startOfMonth(target);
    const end = endOfMonth(target);
    const monthly = transactions.filter(t =>
      isWithinInterval(new Date(t.date), { start, end })
    );
    const income = calcTotalIncome(monthly);
    const expenses = calcTotalExpenses(monthly);
    return { month: format(target, 'MMM'), income, expenses, balance: income - expenses };
  });
};

export const calcCategoryBreakdown = (transactions) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const total = expenses.reduce((acc, t) => acc + t.amount, 0);
  const map = {};
  for (const t of expenses) {
    if (!map[t.category]) map[t.category] = { amount: 0, count: 0 };
    map[t.category].amount += t.amount;
    map[t.category].count += 1;
  }
  return Object.entries(map)
    .map(([category, { amount, count }]) => ({
      category,
      amount,
      count,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
};

export const getHighestSpendingCategory = (breakdown) => breakdown[0] ?? null;

export const calcMonthlyComparison = (transactions) => {
  const now = new Date();
  const thisMonthRange = { start: startOfMonth(now), end: endOfMonth(now) };
  const lastMonthRange = {
    start: startOfMonth(subMonths(now, 1)),
    end: endOfMonth(subMonths(now, 1)),
  };
  const thisMonthExp = calcTotalExpenses(
    transactions.filter(t => isWithinInterval(new Date(t.date), thisMonthRange))
  );
  const lastMonthExp = calcTotalExpenses(
    transactions.filter(t => isWithinInterval(new Date(t.date), lastMonthRange))
  );
  const diff = lastMonthExp > 0
    ? Math.round(((thisMonthExp - lastMonthExp) / lastMonthExp) * 100)
    : 0;
  return { thisMonth: thisMonthExp, lastMonth: lastMonthExp, percentChange: diff };
};

export const applyFilters = (transactions, filters) => {
  let result = [...transactions];
  const now = new Date();

  if (filters.dateRange !== 'all') {
    const days = filters.dateRange === '7d' ? 7 : filters.dateRange === '30d' ? 30 : filters.dateRange === '90d' ? 90 : 365;
    const cutoff = subDays(now, days);
    result = result.filter(t => new Date(t.date) >= cutoff);
  }
  if (filters.type !== 'All') result = result.filter(t => t.type === filters.type);
  if (filters.category !== 'All') result = result.filter(t => t.category === filters.category);
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      (t.note && t.note.toLowerCase().includes(q))
    );
  }
  result.sort((a, b) => {
    let cmp = 0;
    if (filters.sortBy === 'date') cmp = new Date(b.date).getTime() - new Date(a.date).getTime();
    else if (filters.sortBy === 'amount') cmp = b.amount - a.amount;
    else if (filters.sortBy === 'category') cmp = a.category.localeCompare(b.category);
    return filters.sortOrder === 'asc' ? -cmp : cmp;
  });
  return result;
};

export const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const formatINRCompact = (amount) => {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
};
