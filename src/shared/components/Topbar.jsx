import React, { useState } from 'react';
import { Menu, Sun, Moon, Bell, X, LogOut, User } from 'lucide-react';
import { useStore } from '@/store/useStore';
import './Topbar.css';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  transactions: 'Records',
  insights: 'Statistics',
  investments: 'Investments',
  budgets: 'Budgets',
  debts: 'Debts',
};

const ProfileModal = ({ onClose }) => {
  const { currentUser, logout } = useStore();

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal__header">
          <span className="profile-modal__title">My Profile</span>
          <button className="profile-modal__close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="profile-modal__avatar-wrap">
          <div className="profile-modal__avatar">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-modal__name-wrap">
            <span className="profile-modal__name">{currentUser.name}</span>
            <span className="profile-modal__email">{currentUser.email}</span>
          </div>
        </div>

        <div className="profile-modal__info">
          <div className="profile-modal__row">
            <span className="profile-modal__row-label">Role</span>
            <span className={`profile-modal__badge profile-modal__badge--${currentUser.role}`}>
              {currentUser.role === 'admin' ? '⚡ Admin' : '👁 Viewer'}
            </span>
          </div>
          <div className="profile-modal__row">
            <span className="profile-modal__row-label">Account</span>
            <span className="profile-modal__row-value">Demo Account</span>
          </div>
        </div>

        <button className="profile-modal__logout" onClick={logout}>
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export const Topbar = () => {
  const { toggleSidebar, toggleTheme, theme, activeNav, currentUser, setRole } = useStore();
  const isDark = theme === 'dark';
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <header className="topbar">
        <div className="topbar__left">
          <button className="topbar__menu-btn" onClick={toggleSidebar} aria-label="Toggle sidebar">
            <Menu size={20} />
          </button>
          <div className="topbar__page-info">
            <h2 className="topbar__title">{PAGE_TITLES[activeNav] || 'Dashboard'}</h2>
            <span className="topbar__date">
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="topbar__right">
          <div className="topbar__role-toggle">
            <button
              className={`role-toggle__btn ${currentUser.role === 'admin' ? 'role-toggle__btn--active' : ''}`}
              onClick={() => setRole('admin')}
            >
              Admin
            </button>
            <button
              className={`role-toggle__btn ${currentUser.role === 'viewer' ? 'role-toggle__btn--active' : ''}`}
              onClick={() => setRole('viewer')}
            >
              Viewer
            </button>
          </div>

          <button className="topbar__icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="topbar__icon-btn topbar__icon-btn--notif" aria-label="Notifications">
            <Bell size={18} />
            <span className="notif-badge" />
          </button>

          <button
            className="topbar__avatar topbar__avatar--btn"
            onClick={() => setProfileOpen(true)}
            aria-label="Open profile"
            title="View profile"
          >
            {currentUser.name.charAt(0).toUpperCase()}
          </button>
        </div>
      </header>

      {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}
    </>
  );
};
