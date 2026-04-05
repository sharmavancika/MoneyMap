import React, { useEffect, useState } from 'react';
import './Splash.css';

export const Splash = ({ onDone }) => {
  const [phase, setPhase] = useState('enter'); // enter → hold → exit

  useEffect(() => {
    // hold after entrance animation completes (~700ms), then fade out
    const holdTimer = setTimeout(() => setPhase('exit'), 1800);
    const doneTimer = setTimeout(() => onDone(), 2400);
    return () => { clearTimeout(holdTimer); clearTimeout(doneTimer); };
  }, [onDone]);

  return (
    <div className={`splash ${phase === 'exit' ? 'splash--exit' : ''}`}>
      {/* ambient glow */}
      <div className="splash__glow splash__glow--1" />
      <div className="splash__glow splash__glow--2" />

      <div className={`splash__content ${phase === 'enter' ? 'splash__content--enter' : ''}`}>
        {/* Logo icon */}
        <div className="splash__icon-wrap">
          <div className="splash__icon">
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
              <path d="M5 28L19 5L33 28H5Z" fill="currentColor" opacity="0.9" />
              <circle cx="19" cy="28" r="5.5" fill="currentColor" />
            </svg>
          </div>
          {/* pulse ring */}
          <div className="splash__ring" />
        </div>

        {/* App name */}
        <div className="splash__name-wrap">
          <span className="splash__name">MoneyMap</span>
          <span className="splash__tagline">Your financial command centre</span>
        </div>
      </div>
    </div>
  );
};
