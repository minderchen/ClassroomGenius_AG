
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Trophy, RefreshCw, Sparkles, CheckCircle2, History } from 'lucide-react';
import { Participant } from '../types';

interface Props {
  participants: Participant[];
}

const Lottery: React.FC<Props> = ({ participants }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [allowRepeats, setAllowRepeats] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<Participant | null>(null);
  const [winnersHistory, setWinnersHistory] = useState<Participant[]>([]);
  const [displayIndex, setDisplayIndex] = useState(0);
  
  const spinInterval = useRef<number | null>(null);

  const eligibleParticipants = useMemo(() => {
    if (allowRepeats) return participants;
    const historyIds = new Set(winnersHistory.map(w => w.id));
    return participants.filter(p => !historyIds.has(p.id));
  }, [participants, winnersHistory, allowRepeats]);

  const startSpin = () => {
    if (eligibleParticipants.length === 0 || isSpinning) return;

    setIsSpinning(true);
    setCurrentWinner(null);

    let duration = 0;
    const maxDuration = 3000;
    let speed = 50;

    const tick = () => {
      setDisplayIndex(prev => (prev + 1) % eligibleParticipants.length);
      duration += speed;

      if (duration < maxDuration) {
        if (duration > maxDuration * 0.7) speed += 20;
        spinInterval.current = window.setTimeout(tick, speed);
      } else {
        const winner = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)];
        setCurrentWinner(winner);
        setWinnersHistory(prev => [winner, ...prev]);
        setIsSpinning(false);
      }
    };

    tick();
  };

  const resetLottery = () => {
    setWinnersHistory([]);
    setCurrentWinner(null);
  };

  useEffect(() => {
    return () => {
      if (spinInterval.current) clearTimeout(spinInterval.current);
    };
  }, []);

  const currentDisplayParticipant = eligibleParticipants[displayIndex] || null;

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Settings & Status */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-indigo-500" />
            Draw Settings
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
              <span className="text-sm font-medium text-slate-700">Allow Repeats</span>
              <button
                onClick={() => setAllowRepeats(!allowRepeats)}
                disabled={isSpinning}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  allowRepeats ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  allowRepeats ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
               <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Status</div>
               <div className="text-indigo-900 font-bold text-lg">
                 {eligibleParticipants.length} Available
               </div>
               <p className="text-xs text-indigo-600 mt-1">
                 {allowRepeats ? 'Every student can win again' : 'Once won, removed from pool'}
               </p>
            </div>

            <button
              onClick={resetLottery}
              className="w-full py-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
            >
              Reset Winners History
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-h-[400px] flex flex-col">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" />
            Recent Winners
          </h2>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
            {winnersHistory.length === 0 ? (
              <p className="text-slate-400 text-sm italic py-4 text-center">No winners yet</p>
            ) : (
              winnersHistory.map((w, idx) => (
                <div key={`${w.id}-${idx}`} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                    {winnersHistory.length - idx}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{w.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Draw Area */}
      <div className="md:col-span-2 flex flex-col items-center">
        <div className="w-full aspect-video bg-white rounded-3xl shadow-xl border border-slate-200 relative overflow-hidden flex flex-col items-center justify-center p-8">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          
          {/* Main Visual Display */}
          <div className="text-center space-y-8 w-full">
            {currentWinner ? (
              <div className="animate-in zoom-in duration-500">
                <div className="flex justify-center mb-6">
                  <div className="p-5 bg-yellow-100 rounded-full border-4 border-yellow-200 shadow-xl shadow-yellow-100">
                    <Trophy className="w-16 h-16 text-yellow-600" />
                  </div>
                </div>
                <h3 className="text-indigo-600 font-bold tracking-widest uppercase text-sm mb-2">CONGRATULATIONS</h3>
                <h2 className="text-5xl md:text-6xl font-black text-slate-800 break-words max-w-lg mx-auto leading-tight">
                  {currentWinner.name}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-6 text-emerald-500 font-bold">
                   <Sparkles className="w-5 h-5 animate-pulse" />
                   Winner Selected!
                   <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
              </div>
            ) : isSpinning ? (
              <div className="space-y-4">
                <p className="text-slate-400 uppercase tracking-widest font-bold text-sm">Selecting...</p>
                <div className="text-4xl md:text-5xl font-bold text-indigo-600 opacity-60">
                   {currentDisplayParticipant?.name || '---'}
                </div>
                <div className="flex justify-center gap-1 mt-8">
                   <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                   <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                   <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-8 bg-slate-50 rounded-full inline-block mb-4 border border-slate-100">
                  <Trophy className="w-16 h-16 text-slate-200" />
                </div>
                <p className="text-slate-400 text-lg">Ready to find a winner?</p>
                {eligibleParticipants.length === 0 && (
                   <p className="text-red-500 font-semibold bg-red-50 py-2 px-4 rounded-lg inline-block">
                     No more eligible participants
                   </p>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={startSpin}
          disabled={isSpinning || eligibleParticipants.length === 0}
          className="mt-8 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:from-slate-300 disabled:to-slate-400 text-white text-xl font-black px-12 py-5 rounded-2xl shadow-xl shadow-indigo-100 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3"
        >
          {isSpinning ? 'SPINNING...' : 'DRAW WINNER'}
          <Sparkles className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default Lottery;
