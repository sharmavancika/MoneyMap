import React from 'react';
import {
  LayoutDashboard, Receipt, TrendingUp, BarChart2,
  Wallet, CreditCard, LogOut, X, ChevronRight, Crown
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import './Sidebar.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'transactions', label: 'Records', icon: Receipt },
  { id: 'insights', label: 'Statistics', icon: BarChart2 },
  { id: 'investments', label: 'Investments', icon: TrendingUp },
  { id: 'budgets', label: 'Budgets', icon: Wallet },
  { id: 'debts', label: 'Debts', icon: CreditCard },
];

const PREMIUM_ITEM = { id: 'premium', label: 'Go Premium', icon: Crown };

export const Sidebar = () => {
  const { activeNav, setActiveNav, isSidebarOpen, setSidebarOpen, currentUser, logout } = useStore();

  const handleNav = (id) => {
    setActiveNav(id);
    setSidebarOpen(false);
  };

  return (
    <>
      {isSidebarOpen && (
        <div className="sidebar-overlay animate-fadeIn" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <div className="sidebar__logo-icon">
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <path d="M4 20L14 4L24 20H4Z" fill="currentColor" opacity="0.9" />
                <circle cx="14" cy="20" r="4" fill="currentColor" />
              </svg>
            </div>
            <span className="sidebar__logo-text">MoneyMap</span>
          </div>
          <button className="sidebar__close" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <X size={18} />
          </button>
        </div>

        <div className="sidebar__user">
          <div className="sidebar__avatar">{currentUser.name.charAt(0)}</div>
          <div className="sidebar__user-info">
            <span className="sidebar__user-name">{currentUser.name}</span>
            <span className={`sidebar__user-role sidebar__user-role--${currentUser.role}`}>
              {currentUser.role}
            </span>
          </div>
          <ChevronRight size={14} className="sidebar__user-arrow" />
        </div>

        <nav className="sidebar__nav">
          <span className="sidebar__section-label">Menu</span>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`sidebar__nav-item ${activeNav === id ? 'sidebar__nav-item--active' : ''}`}
              onClick={() => handleNav(id)}
            >
              <span className="sidebar__nav-icon">
                <Icon size={18} strokeWidth={activeNav === id ? 2.5 : 1.75} />
              </span>
              <span className="sidebar__nav-label">{label}</span>
              {activeNav === id && <span className="sidebar__nav-dot" />}
            </button>
          ))}
        </nav>

        <div className="sidebar__footer">
          <button
            className={`sidebar__nav-item sidebar__nav-item--premium ${activeNav === 'premium' ? 'sidebar__nav-item--active' : ''}`}
            onClick={() => handleNav('premium')}
          >
            <span className="sidebar__nav-icon"><Crown size={18} strokeWidth={activeNav === 'premium' ? 2.5 : 1.75} /></span>
            <span className="sidebar__nav-label">Go Premium</span>
            {activeNav !== 'premium' && <span className="sidebar__premium-badge">45% OFF</span>}
          </button>
          <div className="sidebar__footer-bottom">
            <button className="sidebar__logout" onClick={logout}>
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
            <span className="sidebar__version">v1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
