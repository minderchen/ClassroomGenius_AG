
import React, { useState, useCallback, useMemo } from 'react';
import { LayoutGrid, Shuffle, UserPlus, Users, Download, ArrowRight } from 'lucide-react';
import { Participant, Group } from '../types';

interface Props {
  participants: Participant[];
}

const Grouper: React.FC<Props> = ({ participants }) => {
  const [perGroup, setPerGroup] = useState<number>(3);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);

  const performGrouping = useCallback(() => {
    if (participants.length === 0) return;
    
    setIsShuffling(true);
    
    // Simulate thinking/shuffling for effect
    setTimeout(() => {
      const shuffled = [...participants].sort(() => Math.random() - 0.5);
      const newGroups: Group[] = [];
      
      for (let i = 0; i < shuffled.length; i += perGroup) {
        newGroups.push({
          id: Math.floor(i / perGroup) + 1,
          members: shuffled.slice(i, i + perGroup)
        });
      }
      
      setGroups(newGroups);
      setIsShuffling(false);
    }, 600);
  }, [participants, perGroup]);

  const downloadResults = () => {
    if (groups.length === 0) return;

    const csvRows = [['Group', 'Participant Name']];
    groups.forEach(group => {
      group.members.forEach(member => {
        csvRows.push([`Group ${group.id}`, member.name]);
      });
    });

    const csvContent = csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `classroom_groups_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = useMemo(() => {
    return {
      total: participants.length,
      groupCount: Math.ceil(participants.length / perGroup),
      remainder: participants.length % perGroup
    };
  }, [participants, perGroup]);

  return (
    <div className="space-y-8">
      {/* Configuration Header */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-8 flex-1">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-black text-slate-800">Auto Grouping</h2>
            <p className="text-slate-500 font-medium">Split {participants.length} students instantly</p>
          </div>

          <div className="h-12 w-px bg-slate-200 hidden md:block" />

          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
            <span className="text-sm font-bold text-slate-500 ml-3">PER GROUP</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPerGroup(Math.max(2, perGroup - 1))}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors shadow-sm"
              >
                -
              </button>
              <input
                type="number"
                value={perGroup}
                onChange={(e) => setPerGroup(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center font-black text-xl bg-transparent outline-none text-indigo-600"
              />
              <button
                onClick={() => setPerGroup(Math.min(participants.length, perGroup + 1))}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors shadow-sm"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {groups.length > 0 && (
            <button
              onClick={downloadResults}
              title="Download results as CSV"
              className="p-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all shadow-sm flex items-center justify-center"
            >
              <Download className="w-6 h-6" />
            </button>
          )}
          <button
            onClick={performGrouping}
            disabled={isShuffling}
            className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-indigo-100 whitespace-nowrap"
          >
            {isShuffling ? (
               <Shuffle className="w-6 h-6 animate-spin" />
            ) : (
               <LayoutGrid className="w-6 h-6" />
            )}
            {isShuffling ? 'GROUPING...' : 'GENERATE GROUPS'}
          </button>
        </div>
      </div>

      {/* Visual Result Status */}
      {groups.length > 0 && !isShuffling && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
           <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center">
              <div className="text-slate-400 text-xs font-bold uppercase mb-1">Total Groups</div>
              <div className="text-2xl font-black text-slate-800">{stats.groupCount}</div>
           </div>
           <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center">
              <div className="text-slate-400 text-xs font-bold uppercase mb-1">Target Size</div>
              <div className="text-2xl font-black text-slate-800">{perGroup}</div>
           </div>
           <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center">
              <div className="text-slate-400 text-xs font-bold uppercase mb-1">Last Group</div>
              <div className="text-2xl font-black text-slate-800">{stats.remainder === 0 ? perGroup : stats.remainder} People</div>
           </div>
        </div>
      )}

      {/* Groups Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${isShuffling ? 'opacity-20' : 'opacity-100'}`}>
        {groups.map((group) => (
          <div 
            key={group.id} 
            className="bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden group border-b-4 border-b-indigo-500/10"
          >
            <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
                   {group.id}
                 </div>
                 <h3 className="font-bold text-slate-800">Group {group.id}</h3>
              </div>
              <div className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">
                {group.members.length} MEMBERS
              </div>
            </div>
            
            <div className="p-6 space-y-3">
              {group.members.map((member, idx) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </div>
                  <span className="text-slate-700 font-medium truncate">{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {groups.length === 0 && !isShuffling && (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-slate-300 space-y-4">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
               <Users className="w-12 h-12" />
            </div>
            <p className="text-xl font-medium">Ready to shuffle your class?</p>
            <p className="text-sm">Adjust the group size above and click generate.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grouper;
