import React from 'react';
import { trainingPlan, PHASE_COLORS, getCurrentWeek } from '../data/trainingPlan';

export default function WeekBar() {
  const currentWeek = getCurrentWeek();

  return (
    <div className="week-bar">
      <div className="week-bar-label">Plan de 8 semanas</div>
      <div className="week-bar-track">
        {trainingPlan.map((w) => (
          <div
            key={w.week}
            className={`week-bar-segment ${w.week === currentWeek ? 'week-bar-current' : ''}`}
            style={{ backgroundColor: PHASE_COLORS[w.type] }}
            title={`Sem ${w.week}: ${w.type}`}
          >
            <span className="week-bar-num">{w.week}</span>
          </div>
        ))}
      </div>
      <div className="week-bar-legend">
        {Object.entries(PHASE_COLORS).map(([name, color]) => (
          <span key={name} className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: color }} />
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
