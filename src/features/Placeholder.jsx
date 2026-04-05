import React from 'react';
import { Card } from '@/shared/components/Card';
import './Placeholder.css';

export const Placeholder = ({ title, icon, description }) => (
  <div className="placeholder-page">
    <Card className="placeholder-card">
      <div className="placeholder-icon animate-float">{icon}</div>
      <h2 className="placeholder-title">{title}</h2>
      <p className="placeholder-desc">{description}</p>
      <div className="placeholder-badge">Coming Soon</div>
    </Card>
  </div>
);
