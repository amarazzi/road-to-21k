import React from 'react';

export default function Titlebar() {
  const api = window.electronAPI;

  return (
    <div className="titlebar">
      <span className="titlebar-title">21k Coach</span>
      {api && (
        <div className="titlebar-controls">
          <button onClick={() => api.minimize()} className="titlebar-btn" aria-label="Minimize">
            ─
          </button>
          <button onClick={() => api.maximize()} className="titlebar-btn" aria-label="Maximize">
            □
          </button>
          <button
            onClick={() => api.close()}
            className="titlebar-btn titlebar-btn-close"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
