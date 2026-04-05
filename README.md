# MoneyMap 💰

A sleek, production-grade personal finance dashboard built with React, TypeScript, Zustand, and Recharts.

---

## ✨ Features

- **Dashboard Overview** — Summary cards (Balance, Income, Expenses), Balance Trend line chart, Spending Breakdown doughnut chart
- **Transactions** — Full CRUD, search, filter by category/type/date range, sort by date/amount/category
- **Insights** — Highest spending category, monthly comparison, avg daily spend, expense breakdown table + bar chart
- **Role-Based UI (RBAC)** — Admin (add/edit/delete) vs Viewer (read-only), switchable via topbar toggle
- **Dark & Light Mode** — Full theme toggle, persisted to localStorage
- **Local Storage Persistence** — Transactions and theme survive page refresh via Zustand persist
- **Mobile-First** — Responsive sidebar drawer, stacked cards, accessible touch targets
- **FAB Button** — Floating Add button on mobile for Admins

---

## 🏗️ Architecture: Clean Architecture / Modular Pattern

```
moneymap/
├── public/
├── src/
│   ├── styles/
│   │   ├── variables.css        # CSS custom properties (light/dark tokens)
│   │   ├── global.css           # Reset, typography, scrollbar
│   │   └── animations.css       # Keyframes, utility animation classes
│   ├── core/                    # Domain Layer
│   │   ├── domain/
│   │   │   ├── types.ts         # Entities: Transaction, User, FilterState
│   │   │   └── mockData.ts      # Seed data + category colour map
│   │   └── use-cases/
│   │       └── calculations.ts  # Pure functions: totals, filters, insights
│   ├── store/
│   │   └── useStore.ts          # Zustand store (persisted)
│   ├── shared/                  # Shared UI Kit
│   │   ├── components/          # Button, Card, Modal, Sidebar, Topbar, FAB
│   │   └── hooks/               # useTheme, useLocalStorage
│   ├── features/                # Feature Modules
│   │   ├── auth/                # Login with OAuth placeholders
│   │   ├── dashboard/           # Summary cards + charts
│   │   ├── transactions/        # List, search, filter, CRUD
│   │   └── insights/            # Metrics + breakdown
│   ├── App.tsx
│   └── main.tsx
└── README.md
```

---

## 🚀 Getting Started

```bash
npm install
npm run dev
# → http://localhost:5173
```

Build for production:
```bash
vite build (no tsc step) && npm run preview
```

---

## 👤 Role-Based UI

| Feature | Admin | Viewer |
|---|---|---|
| View dashboard & charts | ✅ | ✅ |
| Add / Edit / Delete transactions | ✅ | ❌ |
| FAB mobile add button | ✅ | ❌ |

**Switch roles:** Topbar toggle (Admin / Viewer) or Login screen.

---

## 🎨 Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 + TypeScript |
| State Management | Zustand (persist middleware) |
| Charts | Recharts |
| Icons | Lucide React |
| Date Utilities | date-fns |
| Build Tool | Vite |
| Styling | Component-scoped CSS + CSS Variables |
