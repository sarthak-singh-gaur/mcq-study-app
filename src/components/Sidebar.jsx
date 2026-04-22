import React from 'react';
import { BookOpen, ChevronRight, BarChart3, GraduationCap, RotateCcw, Trash2 } from 'lucide-react';

const Sidebar = ({ units, activeUnit, onSelectUnit, onResetUnit, onResetAll, stats }) => {
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
            <div key={unitName} className="relative group">
              <button
                onClick={() => onSelectUnit(unitName)}
                className={`w-full text-left p-4 rounded-xl flex flex-col gap-3 transition-all ${
                  isActive 
                    ? 'bg-indigo-600 shadow-xl shadow-indigo-900/40 text-white' 
                    : 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-sm uppercase tracking-wide truncate pr-8">
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
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onResetUnit(unitName);
                }}
                title={`Reset ${unitName}`}
                className={`absolute right-3 top-4 p-2 rounded-lg transition-all ${
                  isActive 
                    ? 'text-indigo-200 hover:bg-white/10 hover:text-white' 
                    : 'text-slate-500 hover:bg-slate-600/50 hover:text-rose-400 opacity-0 group-hover:opacity-100'
                }`}
              >
                <RotateCcw size={14} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-slate-900/50 border-t border-white/5 space-y-4">
        <div className="flex items-center gap-4 px-2">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <BarChart3 size={20} />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase">Total Done</span>
            <span className="text-lg font-black text-white">
              {Object.values(stats).reduce((acc, s) => acc + s.completed, 0)}
            </span>
          </div>
        </div>

        <button 
          onClick={onResetAll}
          className="w-full py-3 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
        >
          <Trash2 size={14} />
          Reset All Progress
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
