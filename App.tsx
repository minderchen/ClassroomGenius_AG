
import React, { useState, useCallback, useMemo } from 'react';
import { Users, Gift, LayoutGrid, Settings2, Trash2 } from 'lucide-react';
import { Participant, AppView } from './types';
import ParticipantManager from './components/ParticipantManager';
import Lottery from './components/Lottery';
import Grouper from './components/Grouper';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeView, setActiveView] = useState<AppView>('setup');

  const handleUpdateParticipants = useCallback((newList: Participant[]) => {
    setParticipants(newList);
  }, []);

  const clearParticipants = () => {
    if (window.confirm('Are you sure you want to clear the entire list?')) {
      setParticipants([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 hidden sm:block">
                Classroom Genius
              </h1>
            </div>

            <nav className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveView('setup')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeView === 'setup'
                    ? 'bg-white shadow-sm text-indigo-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Settings2 className="w-4 h-4" />
                <span className="text-sm">Setup</span>
              </button>
              <button
                onClick={() => setActiveView('lottery')}
                disabled={participants.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  participants.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  activeView === 'lottery'
                    ? 'bg-white shadow-sm text-indigo-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Gift className="w-4 h-4" />
                <span className="text-sm">Lottery</span>
              </button>
              <button
                onClick={() => setActiveView('grouping')}
                disabled={participants.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  participants.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  activeView === 'grouping'
                    ? 'bg-white shadow-sm text-indigo-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="text-sm">Groups</span>
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <div className="text-xs text-slate-400 font-medium hidden md:block">
                {participants.length} PARTICIPANTS
              </div>
              {participants.length > 0 && (
                <button
                  onClick={clearParticipants}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Clear all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="transition-opacity duration-300">
          {activeView === 'setup' && (
            <ParticipantManager 
              participants={participants} 
              onUpdate={handleUpdateParticipants} 
              onGoToLottery={() => setActiveView('lottery')}
            />
          )}
          {activeView === 'lottery' && (
            <Lottery participants={participants} />
          )}
          {activeView === 'grouping' && (
            <Grouper participants={participants} />
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Classroom Genius • Built for Teachers</p>
      </footer>
    </div>
  );
};

export default App;
