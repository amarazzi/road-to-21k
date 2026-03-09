import React, { useState } from 'react';
import Titlebar from './components/Titlebar';
import TabBar from './components/TabBar';
import Dashboard from './views/Dashboard';
import SessionLog from './views/SessionLog';
import AICoach from './views/AICoach';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      <Titlebar />
      <main className="app-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'sessions' && <SessionLog />}
        {activeTab === 'coach' && <AICoach />}
      </main>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
