export const RACE_DATE = '2025-04-19T00:00:00';

export const PHASE_COLORS = {
  Base: '#c8b89a',
  Velocidad: '#e07b5a',
  Recuperación: '#8aad8a',
  Especificidad: '#7a9ec0',
  Taper: '#a889c0',
};

export const trainingPlan = [
  {
    week: 1,
    type: 'Base',
    sessions: ['Rodaje 5k fácil', 'Técnica + strides 4k', 'Rodaje largo 10k'],
  },
  {
    week: 2,
    type: 'Base',
    sessions: ['Rodaje 6k fácil', 'Tempo 3k', 'Rodaje largo 12k'],
  },
  {
    week: 3,
    type: 'Velocidad',
    sessions: ['Intervalos 6x800m', 'Rodaje 5k fácil', 'Rodaje largo 13k'],
  },
  {
    week: 4,
    type: 'Recuperación',
    sessions: ['Rodaje suave 4k', 'Movilidad + strides', 'Rodaje largo 10k'],
  },
  {
    week: 5,
    type: 'Velocidad',
    sessions: ['Intervalos 5x1000m', 'Tempo 5k', 'Rodaje largo 15k'],
  },
  {
    week: 6,
    type: 'Especificidad',
    sessions: ['Ritmo 21k 8k', 'Rodaje 6k fácil', 'Rodaje largo 17k'],
  },
  {
    week: 7,
    type: 'Taper',
    sessions: ['Rodaje 5k fácil', 'Tempo corto 3k', 'Rodaje largo 12k'],
  },
  {
    week: 8,
    type: 'Taper',
    sessions: ['Rodaje 4k suave', 'Strides 2k', 'CARRERA 21k 🏁'],
  },
];

export function getCurrentWeek() {
  const now = new Date();
  const race = new Date(RACE_DATE);
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  // Training starts 8 weeks before race
  const trainingStart = new Date(race.getTime() - 8 * msPerWeek);
  const weeksSinceStart = Math.floor((now - trainingStart) / msPerWeek) + 1;
  return Math.max(1, Math.min(8, weeksSinceStart));
}

export function getDaysUntilRace() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const race = new Date(RACE_DATE);
  race.setHours(0, 0, 0, 0);
  const diff = race - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
