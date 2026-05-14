import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, ArrowRight } from 'lucide-react';

interface QuestionModalProps {
  question: Question;
  onCorrect: () => void;
  onIncorrect: () => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ question, onCorrect, onIncorrect }) => {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSubmit = (index: number) => {
    if (isSubmitted) return;
    setSelectedChoice(index);
    setIsSubmitted(true);
    const correct = index === question.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setTimeout(() => {
        onCorrect();
      }, 1500);
    } else {
      setTimeout(() => {
        onIncorrect();
        // Reset for another try
        setSelectedChoice(null);
        setIsSubmitted(false);
        setIsCorrect(null);
      }, 2500);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border-4 border-white"
      >
        <div className="bg-blue-600 p-6 text-white text-center">
          <h2 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Knowledge Challenge</h2>
          <p className="text-xl font-medium leading-tight">{question.question}</p>
        </div>
        
        <div className="p-6 space-y-3">
          {question.choices.map((choice, index) => {
            const isSelected = selectedChoice === index;
            const isActuallyCorrect = isSubmitted && index === question.correctAnswer;
            const isWrongSelection = isSubmitted && isSelected && !isCorrect;

            let bgColor = "bg-gray-50 hover:bg-gray-100 border-gray-200";
            let textColor = "text-gray-800";
            
            if (isActuallyCorrect) {
              bgColor = "bg-green-100 border-green-500 ring-2 ring-green-500";
              textColor = "text-green-800";
            } else if (isWrongSelection) {
              bgColor = "bg-red-100 border-red-500 ring-2 ring-red-500";
              textColor = "text-red-800";
            } else if (isSelected && !isSubmitted) {
              bgColor = "bg-blue-50 border-blue-500";
            }

            return (
              <button
                key={index}
                disabled={isSubmitted}
                onClick={() => handleSubmit(index)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left flex items-center justify-between font-medium group ${bgColor} ${textColor}`}
                id={`choice-${index}`}
              >
                <span>{choice}</span>
                {isActuallyCorrect && <Check className="w-5 h-5 text-green-600" />}
                {isWrongSelection && <X className="w-5 h-5 text-red-600" />}
                {!isSubmitted && (
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-blue-500" />
                )}
              </button>
            );
          })}
        </div>
        
        <AnimatePresence>
          {isSubmitted && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className={`p-4 text-center font-bold ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
            >
              {isCorrect ? (
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-6 h-6" />
                  <span>Correct! Good job!</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-2">
                    <X className="w-6 h-6" />
                    <span>Not quite... Try again!</span>
                  </div>
                  {question.explanation && (
                    <p className="text-xs font-normal opacity-90 mt-1 max-w-sm mx-auto">{question.explanation}</p>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4 bg-gray-50 text-center text-xs text-gray-400 font-medium border-t border-gray-100">
          Answer correctly to continue your game!
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuestionModal;
