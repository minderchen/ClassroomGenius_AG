
import React, { useState } from 'react';
// Added Users to imports
import { Upload, ClipboardEdit, Plus, UserX, ChevronRight, Users } from 'lucide-react';
import { Participant } from '../types';

interface Props {
  participants: Participant[];
  onUpdate: (newList: Participant[]) => void;
  onGoToLottery: () => void;
}

const ParticipantManager: React.FC<Props> = ({ participants, onUpdate, onGoToLottery }) => {
  const [manualInput, setManualInput] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
      
      const newParticipants: Participant[] = lines.map(name => ({
        id: Math.random().toString(36).substr(2, 9),
        name: name.replace(/,$/, '').replace(/^"/, '').replace(/"$/, '').trim()
      }));

      onUpdate([...participants, ...newParticipants]);
      // Reset input
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const handleManualAdd = () => {
    const lines = manualInput.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    const newParticipants: Participant[] = lines.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));

    onUpdate([...participants, ...newParticipants]);
    setManualInput('');
  };

  const removeParticipant = (id: string) => {
    onUpdate(participants.filter(p => p.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Import Controls */}
      <div className="lg:col-span-1 space-y-6">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-500" />
            Import CSV
          </h2>
          <p className="text-slate-500 text-sm mb-4">
            Upload a text or CSV file with one name per line.
          </p>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-300 transition-all cursor-pointer">
            <Upload className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-sm font-medium text-slate-600">Choose File</span>
            <input type="file" className="hidden" accept=".csv,.txt" onChange={handleFileUpload} />
          </label>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <ClipboardEdit className="w-5 h-5 text-indigo-500" />
            Paste Names
          </h2>
          <textarea
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Enter names here...&#10;One name per line"
            className="w-full h-48 p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none mb-4"
          />
          <button
            onClick={handleManualAdd}
            disabled={!manualInput.trim()}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-md shadow-indigo-100"
          >
            <Plus className="w-5 h-5" />
            Add to List
          </button>
        </section>
      </div>

      {/* Right Column: Participant List */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-220px)] overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Class List</h2>
              <p className="text-sm text-slate-500">Manage your students</p>
            </div>
            {participants.length > 0 && (
               <button
                  onClick={onGoToLottery}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-100"
               >
                  Next Step
                  <ChevronRight className="w-5 h-5" />
               </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {participants.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                   {/* Users component is now correctly imported */}
                   <Users className="w-8 h-8" />
                </div>
                <p>Your class list is currently empty.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {participants.map((p) => (
                  <div 
                    key={p.id} 
                    className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl group hover:border-indigo-200 hover:shadow-sm transition-all"
                  >
                    <span className="font-medium text-slate-700 truncate">{p.name}</span>
                    <button
                      onClick={() => removeParticipant(p.id)}
                      className="p-1 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantManager;
