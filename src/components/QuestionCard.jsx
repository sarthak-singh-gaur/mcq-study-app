import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ChevronRight, ChevronLeft, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuestionCard = ({ 
  question, 
  onAnswer, 
  onNext, 
  onPrev, 
  currentIndex, 
  totalQuestions, 
  savedAnswer 
}) => {
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    if (savedAnswer) {
      setSelected(savedAnswer.selected);
      setIsCorrect(savedAnswer.isCorrect);
    } else {
      setSelected(null);
      setIsCorrect(null);
    }
  }, [question, savedAnswer]);

  const handleSelect = (key) => {
    if (selected !== null) return;
    const correct = key === question.answer;
    setSelected(key);
    setIsCorrect(correct);
    onAnswer(key, correct);
  };

  if (!question) return null;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-10">
      {/* Question Header */}
      <div className="flex items-center justify-between bg-slate-800/50 p-6 rounded-2xl border border-white/5">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-900/40">
            {currentIndex + 1}
          </div>
          <div>
            <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Question</span>
            <span className="text-sm font-bold text-slate-300">Of {totalQuestions} Questions</span>

          </div>
        </div>
        <div className="flex gap-2">
           <button onClick={onPrev} disabled={currentIndex === 0} className="p-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 disabled:opacity-20 transition-all">
            <ChevronLeft size={20} />
          </button>
          <button onClick={onNext} disabled={currentIndex === totalQuestions - 1} className="p-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 disabled:opacity-20 transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {/* Question Text - HUGE and CLEAR */}
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-12 leading-tight tracking-tight">
            {question.question}
          </h2>

          {/* Options List */}
          <div className="space-y-4">
            {question.options.map((option) => {
              const isSelected = selected === option.key;
              const isCorrectOption = option.key === question.answer;
              
              let statusClass = "option-btn";
              if (selected !== null) {
                if (isCorrectOption) statusClass += " correct scale-[1.02]";
                else if (isSelected) statusClass += " wrong scale-[1.02]";
                else statusClass += " opacity-25";
              }

              return (
                <button
                  key={option.key}
                  disabled={selected !== null}
                  onClick={() => handleSelect(option.key)}
                  className={statusClass}
                >
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-black border-2 shrink-0 ${
                    isSelected ? 'border-current' : 'border-white/10'
                  }`}>
                    {option.key.toUpperCase()}
                  </div>
                  <span className="flex-1">{option.text}</span>
                  {selected !== null && isCorrectOption && <CheckCircle2 size={24} className="text-emerald-400" />}
                  {selected !== null && isSelected && !isCorrectOption && <XCircle size={24} className="text-rose-400" />}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Action Footer */}
      <div className="pt-8 flex items-center justify-between border-t border-white/5">
        <div className="flex items-center gap-3">
          {selected !== null && (
            <div className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest ${
              isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              <Target size={14} />
              {isCorrect ? 'Correct!' : 'Try Next!'}
            </div>
          )}
        </div>
        
        <button onClick={handleNextClick(onNext, currentIndex, totalQuestions)} className="primary-btn py-4">
          <span className="uppercase tracking-widest text-[11px] font-black">
            {currentIndex === totalQuestions - 1 ? 'View Analytics' : 'Next Question'}
          </span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

const handleNextClick = (onNext, index, total) => () => onNext();

export default QuestionCard;
