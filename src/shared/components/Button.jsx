import React from 'react';
import './Button.css';

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      className={`btn btn--${variant} btn--${size} tap-feedback ${fullWidth ? 'btn--full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="btn__spinner" aria-hidden />
      ) : icon ? (
        <span className="btn__icon">{icon}</span>
      ) : null}
      {children && <span className="btn__label">{children}</span>}
      {iconRight && <span className="btn__icon btn__icon--right">{iconRight}</span>}
    </button>
  );
};
