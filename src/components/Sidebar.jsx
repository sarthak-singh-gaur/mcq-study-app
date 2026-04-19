import React from 'react';
import { BookOpen, ChevronRight, BarChart3, GraduationCap } from 'lucide-react';

const Sidebar = ({ units, activeUnit, onSelectUnit, stats }) => {
  return (
    <aside className="sidebar">
      <div className="p-8 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">MCQ Master</h1>
        </div>
        <p className="text-[10px] text-slate-400 tracking-[0.2em] uppercase font-bold">
          Data Structures & Algorithms
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {Object.keys(units).map((unitName) => {
          const isActive = activeUnit === unitName;
          const unitStats = stats[unitName] || { completed: 0, total: units[unitName].length };
          const progress = (unitStats.completed / unitStats.total) * 100;

          return (
            <button
              key={unitName}
              onClick={() => onSelectUnit(unitName)}
              className={`w-full text-left p-4 rounded-xl flex flex-col gap-3 transition-all ${
                isActive 
                  ? 'bg-indigo-600 shadow-xl shadow-indigo-900/40 text-white' 
                  : 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-sm uppercase tracking-wide truncate">
                  {unitName}
                </span>
                {isActive && <ChevronRight size={14} />}
              </div>
              
              <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ${isActive ? 'bg-white' : 'bg-indigo-500'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center text-[10px] font-black uppercase opacity-60">
                <span>Progress</span>
                <span>{unitStats.completed} / {unitStats.total}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-6 bg-slate-900/50 border-t border-white/5">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <BarChart3 size={20} />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase">Total Questions Done</span>
            <span className="text-lg font-black text-white">
              {Object.values(stats).reduce((acc, s) => acc + s.completed, 0)}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
