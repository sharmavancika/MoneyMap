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
| **JavaScript (ES6+)** | ES2022 | Core logic, async/await patterns, functional programming |
| **React** | 18.2 | UI framework, hooks-first |
| **Vite** | 5.1 | Build tool, sub-second HMR, `@/` path aliases |
| **Zustand** + persist | 4.5 | Global state + localStorage persistence |
| **Recharts** | 2.12 | Composable SVG charts with custom tooltips |
| **Lucide React** | 0.344 | Tree-shakable icon set |
| **date-fns** | 3.3 | Modular, immutable date utilities |
| **Vanilla CSS** + Custom Properties | — | Zero-runtime theming, light/dark token system |

---

## ✨ Features

### 🏠 Dashboard
Balance, Income, Expenses & Savings Rate summary cards · 6-month trend line chart · Spending breakdown doughnut chart · Recent transactions feed

### 💳 Transactions
Full CRUD via modal · Live search · Filter by type, category & date range · Sort by date, amount, or category · Export to CSV, JSON, or PDF (all client-side)

### 📊 Insights
Top spending category · Month-over-month comparison · Average daily spend · 6-month bar chart · Category breakdown table

### 🎯 Budgets
Set monthly spending limits per category with animated progress bars · Over-budget alerts with visual warning states · Edit and delete budgets · Per-budget history mini-chart (1M / 3M / 12M toggle) · Summary cards for total budgeted, total spent, and budgets at risk

### 🔒 Fixed Payments
Track recurring obligations independently from transactions — Rent/Maintenance, EMIs, Insurance premiums, SIPs/Mutual Funds, Subscriptions, and custom fixed costs · Full CRUD (add, edit, delete) · Monthly total commitment summary card · Colour-coded type badges with emoji icons

### 👑 Premium Page
Three-tier upgrade plans (Basic · Pro · Elite) with INR pricing, 45% limited-time discount display, per-plan feature comparison checklist, and a one-click plan selection CTA

### 🔐 Auth & RBAC
Username + password login with validation · OAuth simulation (Google / GitHub) · Admin (full read/write) vs Viewer (read-only) roles · Custom display name from login input · Animated splash screen on first load

### 🌗 Dark / Light Mode
Full CSS custom-property token system, persisted across sessions via Zustand + localStorage

### 📱 Mobile-First
Responsive sidebar drawer with overlay · FAB quick-add button for mobile admins · Page transition animations

---

## 🏗️ Architecture

Clean Architecture — domain layer has zero knowledge of React. UI is a detail.

```
src/
├── core/                            # 🏛️ Business Rules & Domain
│   ├── domain/
│   │   ├── types.js                 # Domain constants (transaction types, categories)
│   │   └── mockData.js              # Seed data (users, transactions, category colours)
│   └── use-cases/
│       ├── calculations.js          # Pure financial calculations (balance, monthly data, filters, INR formatters)
│       └── downloadUtils.js         # Client-side export: CSV, JSON, PDF
│
├── store/
│   └── useStore.js                  # Zustand global store with persist middleware
│                                    # Slices: theme · auth · transactions · budgets · fixedPayments · filters · UI
│
├── shared/                          # ♻️ Reusable Primitives
│   ├── components/
│   │   ├── Button.jsx & Button.css
│   │   ├── Card.jsx & Card.css
│   │   ├── FAB.jsx & FAB.css        # Floating action button (mobile quick-add)
│   │   ├── Modal.jsx & Modal.css
│   │   ├── Sidebar.jsx & Sidebar.css
│   │   └── Topbar.jsx & Topbar.css
│   └── hooks/
│       └── useTheme.js
│
├── features/                        # 🎨 Feature Modules
│   ├── auth/
│   │   ├── Login.jsx & Login.css    # Username/password + OAuth simulation
│   │   └── Splash.jsx & Splash.css  # Animated entry screen
│   ├── dashboard/
│   │   └── Dashboard.jsx & Dashboard.css
│   ├── transactions/
│   │   ├── TransactionList.jsx & TransactionList.css
│   │   └── TransactionForm.jsx & TransactionForm.css
│   ├── insights/
│   │   └── Insights.jsx & Insights.css
│   ├── budgets/                     # ← NEW
│   │   └── Budgets.jsx & Budgets.css   # Budget limits + Fixed Payments tracker
│   ├── premium/                     # ← NEW
│   │   └── Premium.jsx & Premium.css   # Upgrade plans & pricing page
│   └── Placeholder.jsx & Placeholder.css  # Stub for upcoming pages
│
├── styles/                          # 🎨 Global Styles
│   ├── variables.css                # CSS custom properties (light/dark tokens)
│   ├── global.css                   # Base styles & reset
│   └── animations.css               # CSS keyframe animations
│
├── App.jsx                          # Root — page map, layout, theme sync, route transitions
├── App.css
└── main.jsx                         # React entry point
```

| Principle | How it's applied |
|---|---|
| **Separation of concerns** | Business logic lives in `core/`, never in components |
| **Pure functions** | All calculations are stateless and easily testable |
| **Single source of truth** | One Zustand store with `partialize` persistence; components only read/dispatch |
| **Reusable primitives** | `Button`, `Card`, `Modal` are fully feature-agnostic |

---

## 📦 State Shape (Zustand)

| Slice | What it holds |
|---|---|
| `theme` | `'dark'` \| `'light'`, applied to `<html data-theme>` |
| `auth` | `isLoggedIn`, `currentUser` (name, role) |
| `transactions` | Array of transaction objects; full CRUD actions |
| `budgets` | Monthly category budget limits; add / delete |
| `fixedPayments` | Recurring obligations (EMI, SIP, insurance…); add / update / delete |
| `filters` | Active search, category, type, date-range, sort state |
| `ui` | `activeNav`, `isSidebarOpen` |

Persisted slices: `theme · transactions · isLoggedIn · currentUser · budgets · fixedPayments`

---

## 🚀 Getting Started

```bash
git clone https://github.com/yourusername/moneymap.git
cd moneymap
npm install
npm run dev       # → http://localhost:5173
npm run build     # Production build → /dist
npm run preview   # Preview production build locally
```

---

## 🗺️ Roadmap

- [x] Dashboard with summary cards & charts
- [x] Transaction CRUD with search, filter, sort & export
- [x] Insights with MoM comparison & category breakdown
- [x] Budget tracking with animated progress bars
- [x] Fixed Payments tracker (EMI, SIP, Insurance, Maintenance)
- [x] Premium upgrade page with pricing plans
- [x] Dark / light mode with CSS token system
- [x] RBAC (Admin / Viewer)
- [x] Mobile-first responsive layout + FAB
- [x] Investments — portfolio, mutual funds, stocks
- [x] Debts — EMI schedule and repayment tracker
- [x] Recurring transactions (auto-add on schedule)

---

<div align="center">

**Built with care, structured with intent, and designed to scale.**

*If you're a recruiter or engineer reading this — yes, this is the kind of code I write at work too.*

⭐ **Star this repo if it impressed you.**

</div>
