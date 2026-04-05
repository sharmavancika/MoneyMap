import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import './Login.css';

export const Login = () => {
  const login = useStore((s) => s.login);
  const [username,      setUsername]      = useState('');
  const [password,      setPassword]      = useState('');
  const [isLoading,     setIsLoading]     = useState(false);
  const [oauthLoading,  setOauthLoading]  = useState(null);
  const [errors,        setErrors]        = useState({});

  const validate = () => {
    const e = {};
    if (!username.trim())  e.username = 'Please enter your username';
    if (!password.trim())  e.password = 'Please enter a password';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;
    setIsLoading(true);
    setTimeout(() => {
      login('admin', username.trim());
      setIsLoading(false);
    }, 800);
  };

  const handleOAuth = (provider) => {
    setOauthLoading(provider);
    const names = { google: 'Google User', github: 'GitHub User' };
    setTimeout(() => {
      login('admin', names[provider]);
      setOauthLoading(null);
    }, 1400);
  };

  const clearError = (field) => setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });

  return (
    <div className="login-page">
      {/* ambient bg */}
      <div className="login-bg">
        <div className="login-bg__orb login-bg__orb--1" />
        <div className="login-bg__orb login-bg__orb--2" />
        <div className="login-bg__grid" />
      </div>

      <div className="login-card animate-fadeInUp">

        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo__icon">
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <path d="M4 20L14 4L24 20H4Z" fill="currentColor" opacity="0.9" />
              <circle cx="14" cy="20" r="4" fill="currentColor" />
            </svg>
          </div>
          <span className="login-logo__text">MoneyMap</span>
        </div>

        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">Sign in to continue</p>

        {/* Username */}
        <div className="login-field">
          <label className="login-label">Username</label>
          <input
            className={`login-input ${errors.username ? 'login-input--error' : ''}`}
            type="text"
            placeholder="Enter your username"
            value={username}
            autoFocus
            onChange={e => { setUsername(e.target.value); clearError('username'); }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
          {errors.username && <span className="login-error">{errors.username}</span>}
        </div>

        {/* Password */}
        <div className="login-field">
          <div className="login-label-row">
            <label className="login-label">Password</label>
            <span className="login-forgot">Forgot password?</span>
          </div>
          <input
            className={`login-input ${errors.password ? 'login-input--error' : ''}`}
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => { setPassword(e.target.value); clearError('password'); }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
          {errors.password && <span className="login-error">{errors.password}</span>}
        </div>

        {/* Sign in button */}
        <button
          className="login-submit tap-feedback"
          onClick={handleLogin}
          disabled={isLoading || !!oauthLoading}
        >
          {isLoading
            ? <span className="login-submit__spinner" />
            : 'Sign in'}
        </button>

        {/* Divider */}
        <div className="login-divider"><span>or continue with</span></div>

        {/* OAuth icon buttons */}
        <div className="login-oauth">
          <button
            className="oauth-icon-btn tap-feedback"
            onClick={() => handleOAuth('google')}
            disabled={!!oauthLoading || isLoading}
            title="Continue with Google"
          >
            {oauthLoading === 'google'
              ? <span className="oauth-spinner" />
              : (
                <svg width="20" height="20" viewBox="0 0 18 18">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
              )}
          </button>

          <button
            className="oauth-icon-btn tap-feedback"
            onClick={() => handleOAuth('github')}
            disabled={!!oauthLoading || isLoading}
            title="Continue with GitHub"
          >
            {oauthLoading === 'github'
              ? <span className="oauth-spinner" />
              : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              )}
          </button>
        </div>

        <p className="login-note">Demo app — no real authentication.</p>
      </div>
    </div>
  );
};
