import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import QuestionCard from './components/QuestionCard';
import mcqData from './data/mcqs.json';
import { Trophy, RefreshCw, BarChart4, CheckCircle2, XCircle } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'mcq_study_progress_v2'; // New key for the overhauled version

function App() {
  const [activeUnit, setActiveUnit] = useState(Object.keys(mcqData)[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(progress).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress]);

  const questions = useMemo(() => mcqData[activeUnit] || [], [activeUnit]);
  const currentQuestion = questions[currentIndex];

  const handleAnswer = (selected, isCorrect) => {
    setProgress(prev => ({
      ...prev,
      [activeUnit]: {
        ...(prev[activeUnit] || {}),
        [currentIndex]: { selected, isCorrect }
      }
    }));
  };

  const unitStats = useMemo(() => {
    const unitProgress = progress[activeUnit] || {};
    const answers = Object.values(unitProgress);
    const correct = answers.filter(a => a.isCorrect).length;
    const totalAnswered = answers.length;
    return {
      completed: totalAnswered,
      correct: correct,
      wrong: totalAnswered - correct,
      total: questions.length
    };
  }, [progress, activeUnit, questions]);


  const statsAcrossUnits = useMemo(() => {
    const allStats = {};
    Object.keys(mcqData).forEach(unit => {
      const unitProgress = progress[unit] || {};
      allStats[unit] = {
        completed: Object.keys(unitProgress).length,
        total: mcqData[unit].length
      };
    });
    return allStats;
  }, [progress]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const resetUnit = () => {
    if (window.confirm(`Are you sure you want to reset all progress for ${activeUnit}?`)) {
      const newProgress = { ...progress };
      delete newProgress[activeUnit];
      setProgress(newProgress);
      setCurrentIndex(0);
      setShowSummary(false);
    }
  };

  const startUnit = (unit) => {
    setActiveUnit(unit);
    setCurrentIndex(0);
    setShowSummary(false);
  };

  return (
    <div id="root">
      <Sidebar 
        units={mcqData} 
        activeUnit={activeUnit} 
        onSelectUnit={startUnit}
        stats={statsAcrossUnits}
      />

      <main className="main-content">
        {!showSummary && (
          <div className="w-full max-w-3xl mx-auto mb-8 flex gap-4">
            <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-emerald-500/60 mb-1">Correct</span>
                <span className="text-2xl font-black text-emerald-400">{unitStats.correct}</span>
              </div>
              <div className="h-10 w-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={20} />
              </div>
            </div>
            
            <div className="flex-1 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-rose-500/60 mb-1">Wrong</span>
                <span className="text-2xl font-black text-rose-400">{unitStats.wrong}</span>
              </div>
              <div className="h-10 w-10 bg-rose-500/20 rounded-xl flex items-center justify-center text-rose-400">
                <XCircle size={20} />
              </div>
            </div>

            <div className="flex-1 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-indigo-500/60 mb-1">Accuracy</span>
                <span className="text-2xl font-black text-indigo-400">
                  {unitStats.completed > 0 ? Math.round((unitStats.correct / unitStats.completed) * 100) : 0}%
                </span>
              </div>
              <div className="h-10 w-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                <BarChart4 size={20} />
              </div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">

          {showSummary ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl"
            >
              <div className="card text-center space-y-10">
                <div className="h-24 w-24 bg-indigo-600/20 text-indigo-400 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/10">
                  <Trophy size={48} />
                </div>
                
                <div>
                  <h2 className="text-4xl font-black text-white mb-3 uppercase tracking-tight">Unit Mastered!</h2>
                  <p className="text-slate-400 font-bold text-lg">{activeUnit} Complete</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-8 rounded-2xl bg-black/20 border border-white/5">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Accuracy</span>
                    <span className="text-4xl font-black text-emerald-400">
                      {Math.round((unitStats.correct / unitStats.total) * 100)}%
                    </span>
                  </div>
                  <div className="p-8 rounded-2xl bg-black/20 border border-white/5">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Solved</span>
                    <span className="text-4xl font-black text-indigo-400">
                      {unitStats.correct} / {unitStats.total}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setShowSummary(false)} className="flex-[2] primary-btn justify-center py-5">
                    Practice More
                  </button>
                  <button onClick={resetUnit} className="flex-1 bg-slate-800 text-slate-400 p-5 rounded-2xl hover:text-rose-400 hover:bg-rose-500/10 transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px]">
                    <RefreshCw size={18} />
                    Reset
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <QuestionCard 
              question={currentQuestion}
              currentIndex={currentIndex}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
              onNext={handleNext}
              onPrev={handlePrev}
              savedAnswer={progress[activeUnit]?.[currentIndex]}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
