export const MOCK_USERS = {
  admin: {
    id: 'user-001',
    name: 'Arjun Mehta',
    email: 'arjun@moneymap.in',
    role: 'admin',
  },
  viewer: {
    id: 'user-002',
    name: 'Priya Sharma',
    email: 'priya@moneymap.in',
    role: 'viewer',
  },
};

const now = new Date();
const d = (daysAgo) => {
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const MOCK_TRANSACTIONS = [
  { id: 'txn-001', title: 'Monthly Salary', amount: 95000, type: 'income', category: 'Salary', date: d(1), note: 'October salary credited', createdAt: d(1), updatedAt: d(1) },
  { id: 'txn-002', title: 'Zomato Order', amount: 680, type: 'expense', category: 'Food & Dining', date: d(1), createdAt: d(1), updatedAt: d(1) },
  { id: 'txn-003', title: 'Ola Cab', amount: 320, type: 'expense', category: 'Transport', date: d(2), createdAt: d(2), updatedAt: d(2) },
  { id: 'txn-004', title: 'Netflix Subscription', amount: 649, type: 'expense', category: 'Entertainment', date: d(3), createdAt: d(3), updatedAt: d(3) },
  { id: 'txn-005', title: 'Freelance Project', amount: 28000, type: 'income', category: 'Freelance', date: d(4), note: 'UI design for client', createdAt: d(4), updatedAt: d(4) },
  { id: 'txn-006', title: 'Grocery – DMart', amount: 3450, type: 'expense', category: 'Food & Dining', date: d(5), createdAt: d(5), updatedAt: d(5) },
  { id: 'txn-007', title: 'Mutual Fund SIP', amount: 10000, type: 'expense', category: 'Investment', date: d(6), createdAt: d(6), updatedAt: d(6) },
  { id: 'txn-008', title: 'Gym Membership', amount: 2500, type: 'expense', category: 'Health', date: d(7), createdAt: d(7), updatedAt: d(7) },
  { id: 'txn-009', title: 'Amazon Shopping', amount: 4899, type: 'expense', category: 'Shopping', date: d(9), createdAt: d(9), updatedAt: d(9) },
  { id: 'txn-010', title: 'Electricity Bill', amount: 1890, type: 'expense', category: 'Utilities', date: d(10), createdAt: d(10), updatedAt: d(10) },
  { id: 'txn-011', title: 'Rent', amount: 22000, type: 'expense', category: 'Housing', date: d(12), createdAt: d(12), updatedAt: d(12) },
  { id: 'txn-012', title: 'Dividend Income', amount: 3200, type: 'income', category: 'Investment', date: d(14), createdAt: d(14), updatedAt: d(14) },
  { id: 'txn-013', title: 'Swiggy Order', amount: 450, type: 'expense', category: 'Food & Dining', date: d(15), createdAt: d(15), updatedAt: d(15) },
  { id: 'txn-014', title: 'Book – Notion Press', amount: 599, type: 'expense', category: 'Shopping', date: d(16), createdAt: d(16), updatedAt: d(16) },
  { id: 'txn-015', title: 'Freelance – Logo Design', amount: 8000, type: 'income', category: 'Freelance', date: d(18), createdAt: d(18), updatedAt: d(18) },
  { id: 'txn-016', title: 'Doctor Consultation', amount: 800, type: 'expense', category: 'Health', date: d(20), createdAt: d(20), updatedAt: d(20) },
  { id: 'txn-017', title: 'Petrol', amount: 2100, type: 'expense', category: 'Transport', date: d(21), createdAt: d(21), updatedAt: d(21) },
  { id: 'txn-018', title: 'Salary – Last Month', amount: 95000, type: 'income', category: 'Salary', date: d(32), createdAt: d(32), updatedAt: d(32) },
  { id: 'txn-019', title: 'Goa Trip', amount: 14500, type: 'expense', category: 'Travel', date: d(35), createdAt: d(35), updatedAt: d(35) },
  { id: 'txn-020', title: 'Internet Bill', amount: 999, type: 'expense', category: 'Utilities', date: d(38), createdAt: d(38), updatedAt: d(38) },
  { id: 'txn-021', title: 'Freelance – Web App', amount: 35000, type: 'income', category: 'Freelance', date: d(40), createdAt: d(40), updatedAt: d(40) },
  { id: 'txn-022', title: 'Rent – Last Month', amount: 22000, type: 'expense', category: 'Housing', date: d(42), createdAt: d(42), updatedAt: d(42) },
  { id: 'txn-023', title: 'Spotify', amount: 119, type: 'expense', category: 'Entertainment', date: d(45), createdAt: d(45), updatedAt: d(45) },
  { id: 'txn-024', title: 'SIP – Last Month', amount: 10000, type: 'expense', category: 'Investment', date: d(47), createdAt: d(47), updatedAt: d(47) },
];

export const CATEGORY_COLORS = {
  'Food & Dining': '#00C896',
  'Shopping': '#4361EE',
  'Transport': '#FFB703',
  'Entertainment': '#7B2FBE',
  'Health': '#FF4757',
  'Housing': '#F97316',
  'Utilities': '#00B4D8',
  'Travel': '#EC4899',
  'Investment': '#06B6D4',
  'Salary': '#22C55E',
  'Freelance': '#A78BFA',
  'Other': '#6B7280',
};
