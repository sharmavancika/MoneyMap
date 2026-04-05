
<div align="center">

# 💸 MoneyMap

### A production-grade personal finance dashboard — built to impress.

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Zustand](https://img.shields.io/badge/Zustand-4.5-brown)](https://zustand-demo.pmnd.rs)
[![Recharts](https://img.shields.io/badge/Recharts-2.12-22B5BF)](https://recharts.org)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

**[🚀 Live Demo](https://moneymap-fawn.vercel.app)**

> *A full-featured SPA with real-world architecture decisions, a clean domain layer, role-based access control, and a polished UI that works beautifully on every screen size.*

</div>

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **JavaScript (ES6+)** | ES2022 | Core logic, asynchronous patterns (async/await), and functional programming |
| **React** | 18.2 | UI framework, hooks-first |
| **Vite** | 5.1 | Build tool, sub-second HMR, `@/` path aliases |
| **Zustand** + persist | 4.5 | Global state + localStorage persistence |
| **Recharts** | 2.12 | Composable SVG charts with custom tooltips |
| **Lucide React** | 0.344 | Tree-shakable icon set |
| **date-fns** | 3.3 | Modular, immutable date utilities |
| **Vanilla CSS** + Custom Properties | — | Zero-runtime theming, light/dark token system |

---

## ✨ Features

- **Dashboard** — Balance, Income, Expenses & Savings Rate cards · 6-month trend line chart · Spending breakdown doughnut chart · Recent transactions
- **Transactions** — Full CRUD via modal · Live search · Filter by type, category & date range · Sort by date/amount/category · Export to CSV, JSON, or PDF (all client-side)
- **Insights** — Top spending category · Month-over-month comparison · Avg daily spend · 6-month bar chart · Category breakdown table
- **RBAC** — Admin (full read/write) vs Viewer (read-only), switchable live from the topbar
- **Dark / Light Mode** — Full CSS token system, persisted across sessions
- **Mobile-first** — Responsive sidebar drawer + FAB quick-add button for mobile admins

---

## 🏗️ Architecture

Clean Architecture — domain layer has zero knowledge of React. UI is a detail.

```
src/
├── domain/                          # 🏛️ Business Rules & Entities (Inner Layer)
│   ├── entities/                    # Domain models with business logic
│   │   ├── Transaction.js           # Transaction entity class
│   │   └── User.js                  # User entity class
│   ├── constants.js                 # Domain constants (types, categories)
│   └── mockData.js                  # Mock data for development
│
├── application/                     # ⚙️ Use Cases & Services (Application Layer)
│   └── use-cases/                   # Business logic orchestrators
│       ├── calculations.js          # Financial calculations
│       └── downloadUtils.js         # Data export utilities
│
├── infrastructure/                  # 🔌 External Interfaces (Outer Layer)
│   ├── store/                       # State management
│   │   └── useStore.js              # Zustand global store
│   └── persistence/                 # Data persistence layer
│       └── localStorage.js          # Local storage abstraction
│
├── presentation/                    # 🎨 UI Layer (Outer Layer)
│   ├── components/                  # Shared UI components
│   │   ├── Button.jsx & Button.css
│   │   ├── Card.jsx & Card.css
│   │   ├── FAB.jsx & FAB.css
│   │   ├── Modal.jsx & Modal.css
│   │   ├── Sidebar.jsx & Sidebar.css
│   │   └── Topbar.jsx & Topbar.css
│   ├── features/                    # Feature-specific components
│   │   ├── auth/
│   │   │   ├── Login.jsx & Login.css
│   │   │   └── Splash.jsx & Splash.css
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx & Dashboard.css
│   │   ├── transactions/
│   │   │   ├── TransactionForm.jsx & TransactionForm.css
│   │   │   └── TransactionList.jsx & TransactionList.css
│   │   ├── insights/
│   │   │   └── Insights.jsx & Insights.css
│   │   ├── premium/
│   │   │   └── Premium.jsx & Premium.css
│   │   └── budgets/
│   │       └── Budgets.jsx & Budgets.css
│   ├── hooks/                       # Custom React hooks
│   │   └── useTheme.js
│   └── styles/                      # Global styles
│       ├── variables.css            # CSS custom properties
│       ├── global.css               # Base styles & reset
│       └── animations.css           # CSS animations
│
├── App.jsx                          # Main app component
├── App.css                          # App-specific styles
├── main.jsx                         # React entry point
└── assets/                          # Static assets (images, icons)
```

| Principle | How it's applied |
|---|---|
| **Separation of concerns** | Business logic lives in `core/`, never in components |
| **Pure functions** | All calculations are stateless and easily testable |
| **Single source of truth** | One Zustand store; components only read/dispatch |
| **Reusable primitives** | `Button`, `Card`, `Modal` are feature-agnostic |

---

## 🚀 Getting Started

```bash
git clone https://github.com/yourusername/moneymap.git
cd moneymap
npm install
npm run dev       # → http://localhost:5173
npm run build     # Production build → /dist
```

---

## 🗺️ Roadmap

- [ ] Investments — portfolio, mutual funds, stocks
- [ ] Budgets — monthly category limits with progress
- [ ] Debts — EMI schedule and repayment tracker
- [ ] Recurring transactions
- [ ] Backend integration (REST / Firebase)

---

<div align="center">

**Built with care, structured with intent, and designed to scale.**

*If you're a recruiter or engineer reading this — yes, this is the kind of code I write at work too.*

⭐ **Star this repo if it impressed you.**

</div>
# MoneyMap
