import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Sidebar } from '@/shared/components/Sidebar';
import { Topbar } from '@/shared/components/Topbar';
import { FAB } from '@/shared/components/FAB';
import { Dashboard } from '@/features/dashboard/Dashboard';
import { TransactionList } from '@/features/transactions/TransactionList';
import { Insights } from '@/features/insights/Insights';
import { Budgets } from '@/features/budgets/Budgets';
import { Placeholder } from '@/features/Placeholder';
import { Login } from '@/features/auth/Login';
import { Splash } from '@/features/auth/Splash';
import { Premium } from '@/features/premium/Premium';
import { MunimButton, MunimChat } from '@/features/munim/Munim';
import './App.css';

const PAGE_MAP = {
  dashboard:    <Dashboard />,
  transactions: <TransactionList />,
  insights:     <Insights />,
  investments:  <Placeholder title="Investments"  icon="📈" description="Track your portfolio, mutual funds, and stocks. Coming soon!" />,
  budgets:      <Budgets />,
  debts:        <Placeholder title="Debts"        icon="💳" description="Manage loans, EMIs and repayment schedules. Coming soon!" />,
  premium:      <Premium />,
};

function App() {
  const { isLoggedIn, theme } = useStore();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (!splashDone) return <Splash onDone={() => setSplashDone(true)} />;
  if (!isLoggedIn) return <Login />;
  return <AppLayout />;
}

const MUNIM_WIDTH = 400;

const AppLayout = () => {
  const { activeNav } = useStore();
  const [transitionKey, setTransitionKey] = useState(activeNav);
  const [animClass, setAnimClass] = useState('animate-screenEnter');
  const prevNav = useRef(activeNav);
  const [munimOpen, setMunimOpen] = useState(false);

  useEffect(() => {
    if (activeNav !== prevNav.current) {
      setAnimClass('animate-screenFade');
      setTransitionKey(activeNav);
      prevNav.current = activeNav;
    }
  }, [activeNav]);

  return (
    <div className="app-layout" style={munimOpen ? { paddingRight: MUNIM_WIDTH } : {}}>
      <Sidebar />
      <div className="app-main">
        <Topbar />
        <main className="app-content">
          <div className={`page-wrapper ${animClass}`} key={transitionKey}>
            {PAGE_MAP[activeNav] || <Dashboard />}
          </div>
        </main>
      </div>
      <FAB />
      {munimOpen
        ? <MunimChat onClose={() => setMunimOpen(false)} />
        : <MunimButton onClick={() => setMunimOpen(true)} />
      }
    </div>
  );
};

export default App;
