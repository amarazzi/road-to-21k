import React, { useState, useEffect } from 'react';
import FeelDots from '../components/FeelDots';

export default function SessionLog() {
  const [sessions, setSessions] = useState([]);
  const [distance, setDistance] = useState('');
  const [paceMin, setPaceMin] = useState('');
  const [paceSec, setPaceSec] = useState('');
  const [feel, setFeel] = useState(3);
  const [note, setNote] = useState('');

  useEffect(() => {
    async function load() {
      if (window.electronAPI) {
        const stored = await window.electronAPI.storeGet('sessions');
        if (stored) setSessions(stored);
      }
    }
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!distance || !paceMin) return;

    const pace = `${paceMin}:${(paceSec || '00').padStart(2, '0')}`;
    const newSession = {
      id: Date.now(),
      date: new Date().toISOString(),
      distance: parseFloat(distance),
      pace,
      feel,
      note: note.trim(),
    };

    const updated = [newSession, ...sessions];
    setSessions(updated);

    if (window.electronAPI) {
      await window.electronAPI.storeSet('sessions', updated);
    }

    // Reset form
    setDistance('');
    setPaceMin('');
    setPaceSec('');
    setFeel(3);
    setNote('');
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  return (
    <div className="view session-log">
      <h2 className="view-title">Registrar sesión</h2>

      <form className="session-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Distancia (km)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              className="form-input"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="10.0"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Pace (min:seg)</label>
            <div className="pace-inputs">
              <input
                type="number"
                min="0"
                max="59"
                className="form-input pace-input"
                value={paceMin}
                onChange={(e) => setPaceMin(e.target.value)}
                placeholder="5"
                required
              />
              <span className="pace-sep">:</span>
              <input
                type="number"
                min="0"
                max="59"
                className="form-input pace-input"
                value={paceSec}
                onChange={(e) => setPaceSec(e.target.value)}
                placeholder="30"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">¿Cómo te sentiste?</label>
          <FeelDots value={feel} onChange={setFeel} interactive />
        </div>

        <div className="form-group">
          <label className="form-label">Nota</label>
          <input
            type="text"
            className="form-input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ej: Buena sesión, piernas pesadas..."
            maxLength={120}
          />
        </div>

        <button type="submit" className="btn-primary">
          Guardar sesión
        </button>
      </form>

      <h3 className="sessions-list-title">Historial</h3>

      {sessions.length === 0 ? (
        <p className="empty-state">Todavía no registraste sesiones.</p>
      ) : (
        <div className="sessions-list">
          {sessions.map((s) => (
            <div key={s.id} className="session-card">
              <div className="session-card-header">
                <span className="session-date">{formatDate(s.date)}</span>
                <FeelDots value={s.feel} />
              </div>
              <div className="session-card-body">
                <span className="session-stat">{s.distance} km</span>
                <span className="session-stat">{s.pace} /km</span>
              </div>
              {s.note && <div className="session-note">{s.note}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
