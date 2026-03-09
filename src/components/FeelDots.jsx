import React from 'react';

export default function FeelDots({ value, onChange, interactive = false }) {
  return (
    <div className="feel-dots">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`feel-dot ${n <= value ? 'feel-dot-filled' : ''}`}
          onClick={interactive ? () => onChange(n) : undefined}
          style={interactive ? { cursor: 'pointer' } : {}}
          role={interactive ? 'button' : undefined}
          aria-label={`Feel ${n}`}
        >
          ●
        </span>
      ))}
    </div>
  );
}
