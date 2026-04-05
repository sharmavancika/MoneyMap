import React, { useState } from 'react';
import { Check, X, Zap, Crown, Sparkles, ArrowRight, Tag } from 'lucide-react';
import './Premium.css';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    subtitle: '5K+ Users',
    originalPrice: 999,
    price: 549,
    discount: 45,
    period: '12 Months',
    icon: '⚡',
    color: '#4361EE',
    colorDim: '#4361EE18',
    features: [
      { label: 'Unlimited Transactions', included: true },
      { label: 'Budget Tracking', included: true },
      { label: 'Basic Reports', included: true },
      { label: 'CSV Export', included: true },
      { label: 'Priority Support', included: false },
      { label: 'AI Insights', included: false },
      { label: 'Investment Tracker', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    subtitle: '12K+ Users',
    originalPrice: 1999,
    price: 1099,
    discount: 45,
    period: '12 Months',
    icon: '👑',
    color: '#00C896',
    colorDim: '#00C89618',
    popular: true,
    features: [
      { label: 'Unlimited Transactions', included: true },
      { label: 'Budget Tracking', included: true },
      { label: 'Advanced Reports & Charts', included: true },
      { label: 'All Export Formats', included: true },
      { label: 'Priority Support', included: true },
      { label: 'AI Insights', included: true },
      { label: 'Investment Tracker', included: false },
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    subtitle: '3K+ Users',
    originalPrice: 3499,
    price: 1924,
    discount: 45,
    period: '12 Months',
    icon: '✨',
    color: '#FFB703',
    colorDim: '#FFB70318',
    features: [
      { label: 'Unlimited Transactions', included: true },
      { label: 'Budget Tracking', included: true },
      { label: 'Advanced Reports & Charts', included: true },
      { label: 'All Export Formats', included: true },
      { label: '24/7 Priority Support', included: true },
      { label: 'AI Insights & Suggestions', included: true },
      { label: 'Investment Tracker', included: true },
    ],
  },
];

const formatINR = (n) => '₹' + n.toLocaleString('en-IN');

export const Premium = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="premium-page">
      <div className="premium-page__hero">
        <div className="premium-hero__badge">
          <Zap size={13} /> Limited Offer
        </div>
        <h2 className="premium-hero__title">Upgrade Your <span>MoneyMap</span></h2>
        <p className="premium-hero__sub">Unlock powerful tools to take full control of your finances</p>
      </div>

      <div className="premium-plans">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`plan-card ${plan.popular ? 'plan-card--popular' : ''} ${selected === plan.id ? 'plan-card--selected' : ''}`}
            style={{ '--plan-color': plan.color, '--plan-color-dim': plan.colorDim }}
          >
            {plan.popular && (
              <div className="plan-card__badge">
                <Crown size={11} /> Most Popular
              </div>
            )}

            <div className="plan-card__header">
              <div className="plan-card__icon">{plan.icon}</div>
              <div>
                <h3 className="plan-card__name">{plan.name}</h3>
                <p className="plan-card__subtitle">({plan.subtitle})</p>
              </div>
            </div>

            <div className="plan-card__divider" />

            <div className="plan-card__pricing">
              <span className="plan-card__original">{formatINR(plan.originalPrice)}</span>
              <div className="plan-card__price-row">
                <span className="plan-card__price">{formatINR(plan.price)}</span>
                <span className="plan-card__discount">
                  <Tag size={11} /> {plan.discount}% OFF
                </span>
              </div>
              <div className="plan-card__period">🗓 {plan.period}</div>
            </div>

            <div className="plan-card__divider" />

            <ul className="plan-card__features">
              {plan.features.map((f) => (
                <li key={f.label} className={`plan-feat ${f.included ? 'plan-feat--yes' : 'plan-feat--no'}`}>
                  <span className="plan-feat__icon">
                    {f.included ? <Check size={13} /> : <X size={12} />}
                  </span>
                  <span className="plan-feat__label">{f.label}</span>
                </li>
              ))}
            </ul>

            <button
              className={`plan-card__cta ${selected === plan.id ? 'plan-card__cta--selected' : ''}`}
              onClick={() => setSelected(plan.id)}
            >
              {selected === plan.id ? (
                <><Sparkles size={15} /> Selected!</>
              ) : (
                <>Upgrade Now <ArrowRight size={15} /></>
              )}
            </button>
          </div>
        ))}
      </div>

      <p className="premium-page__note">
        🔒 Secure payment · Cancel anytime · 7-day money back guarantee
      </p>
    </div>
  );
};
