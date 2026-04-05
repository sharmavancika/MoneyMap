import React from 'react';
import './Card.css';

export const Card = ({
  glass = false,
  padding = 'md',
  children,
  className = '',
  ...props
}) => (
  <div
    className={`card card--pad-${padding} ${glass ? 'card--glass' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
);
