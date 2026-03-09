import React, { useEffect, useState } from 'react';
import WeekBar from '../components/WeekBar';
import {
  trainingPlan,
  PHASE_COLORS,
  getCurrentWeek,
  getDaysUntilRace,
} from '../data/trainingPlan';

function parsePace(paceStr) {
  if (!paceStr) return null;
  const parts = paceStr.split(':');
  if (parts.length !== 2) return null;
  const mins = parseInt(parts[0], 10);
  const secs = parseInt(parts[1], 10);
  if (isNaN(mins) || isNaN(secs)) return null;
  return mins + secs / 60;
}

function formatPace(decimalMins) {
  const mins = Math.floor(decimalMins);
  const secs = Math.round((decimalMins - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatTime(totalMins) {
  const hours = Math.floor(totalMins / 60);
  const mins = Math.round(totalMins % 60);
  return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const daysLeft = getDaysUntilRace();
  const currentWeek = getCurrentWeek();
  const weekData = trainingPlan[currentWeek - 1];

  useEffect(() => {
    async function load() {
      if (window.electronAPI) {
        const stored = await window.electronAPI.storeGet('sessions');
        if (stored) setSessions(stored);
      }
    }
    load();
  }, []);

  const totalKm = sessions.reduce((sum, s) => sum + (parseFloat(s.distance) || 0), 0);
  const avgFeel =
    sessions.length > 0
      ? (sessions.reduce((sum, s) => sum + (s.feel || 0), 0) / sessions.length).toFixed(1)
      : '—';

  const paces = sessions.map((s) => parsePace(s.pace)).filter((p) => p !== null);
  const avgPace = paces.length > 0 ? paces.reduce((a, b) => a + b, 0) / paces.length : null;

  // Projected finish: avg pace × 21 × 1.05
  const projectedFinish = avgPace ? avgPace * 21 * 1.05 : null;

  return (
    <div className="view dashboard">
      {/* Countdown */}
      <div className="countdown-card">
        <div className="countdown-number">{daysLeft}</div>
        <div className="countdown-label">días para el 21k</div>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{totalKm.toFixed(1)}</div>
          <div className="stat-label">km totales</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{avgFeel}</div>
          <div className="stat-label">feel prom.</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{avgPace ? formatPace(avgPace) : '—'}</div>
          <div className="stat-label">pace prom.</div>
        </div>
      </div>

      {/* Projected finish */}
      <div className="projected-card">
        <div className="projected-label">Tiempo proyectado 21k</div>
        <div className="projected-value">
          {projectedFinish ? formatTime(projectedFinish) : '— sin datos —'}
        </div>
        {avgPace && (
          <div className="projected-detail">
            Pace prom. {formatPace(avgPace)} × 1.05 factor
          </div>
        )}
      </div>

      {/* Current week */}
      <div className="week-card" style={{ borderLeftColor: PHASE_COLORS[weekData.type] }}>
        <div className="week-card-header">
          <span className="week-card-title">Semana {weekData.week}</span>
          <span
            className="phase-badge"
            style={{ backgroundColor: PHASE_COLORS[weekData.type] }}
          >
            {weekData.type}
          </span>
        </div>
        <ul className="week-sessions">
          {weekData.sessions.map((s, i) => (
            <li key={i} className="week-session-item">
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* 8-week visual bar */}
      <WeekBar />
    </div>
  );
}
