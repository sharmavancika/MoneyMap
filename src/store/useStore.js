import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_TRANSACTIONS, MOCK_USERS } from '@/core/domain/mockData';

const DEFAULT_FILTERS = {
  search: '',
  category: 'All',
  type: 'All',
  dateRange: 'all',
  sortBy: 'date',
  sortOrder: 'desc',
};

let idCounter = 1000;
const genId = () => `txn-${Date.now()}-${idCounter++}`;

const DEFAULT_FIXED_PAYMENTS = [
  { id: 'fp-1', name: 'Rent / Maintenance', amount: 8000,  category: 'Housing',    icon: '🏠', type: 'maintenance' },
  { id: 'fp-2', name: 'LIC Insurance',      amount: 2500,  category: 'Insurance',  icon: '🛡️', type: 'insurance'   },
  { id: 'fp-3', name: 'Home Loan EMI',       amount: 15000, category: 'EMI',        icon: '🏦', type: 'emi'         },
  { id: 'fp-4', name: 'SIP - Mutual Fund',   amount: 5000,  category: 'Investment', icon: '📈', type: 'sip'         },
];

export const useStore = create(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
      },
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        get().setTheme(next);
      },

      // Auth
      isLoggedIn: false,
      currentUser: MOCK_USERS.admin,
      setRole: (role) => set({ currentUser: MOCK_USERS[role] }),
      login: (role, customName) => {
        const base = MOCK_USERS[role];
        const user = customName ? { ...base, name: customName } : base;
        set({ isLoggedIn: true, currentUser: user });
      },
      logout: () => set({ isLoggedIn: false }),

      // Transactions
      transactions: MOCK_TRANSACTIONS,
      addTransaction: (t) => {
        const now = new Date().toISOString();
        const newTxn = { ...t, id: genId(), createdAt: now, updatedAt: now };
        set((s) => ({ transactions: [newTxn, ...s.transactions] }));
      },
      updateTransaction: (id, updates) => {
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        }));
      },
      deleteTransaction: (id) => {
        set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) }));
      },

      // Budgets
      budgets: [],
      addBudget: (b) => set((s) => ({ budgets: [...s.budgets.filter(x => x.category !== b.category), b] })),
      deleteBudget: (id) => set((s) => ({ budgets: s.budgets.filter(b => b.id !== id) })),

      // Fixed Payments (EMI, Insurance, SIP, Maintenance)
      fixedPayments: DEFAULT_FIXED_PAYMENTS,
      addFixedPayment: (fp) => set((s) => ({ fixedPayments: [...s.fixedPayments, { ...fp, id: `fp-${Date.now()}` }] })),
      updateFixedPayment: (id, updates) => set((s) => ({
        fixedPayments: s.fixedPayments.map(fp => fp.id === id ? { ...fp, ...updates } : fp),
      })),
      deleteFixedPayment: (id) => set((s) => ({ fixedPayments: s.fixedPayments.filter(fp => fp.id !== id) })),

      // Filters
      filters: DEFAULT_FILTERS,
      setFilter: (key, value) =>
        set((s) => ({ filters: { ...s.filters, [key]: value } })),
      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

      // UI
      isSidebarOpen: false,
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
      activeNav: 'dashboard',
      setActiveNav: (nav) => set({ activeNav: nav }),
    }),
    {
      name: 'moneymap-storage',
      partialize: (s) => ({
        theme: s.theme,
        transactions: s.transactions,
        isLoggedIn: s.isLoggedIn,
        currentUser: s.currentUser,
        budgets: s.budgets,
        fixedPayments: s.fixedPayments,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    }
  )
);
