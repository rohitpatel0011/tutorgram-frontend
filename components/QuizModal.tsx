import React, { useState } from 'react';
import { QuizData } from '../types';
import { CheckCircle, XCircle, AlertCircle, Trophy, RefreshCw, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  quizData: QuizData | null;
  loading: boolean;
  title?: string;
  xpReward?: number;
  passingScore?: number; 
  onPass?: () => void;
}

const QuizModal: React.FC<Props> = ({
    isOpen, onClose, quizData, loading,
    title = "Quiz", xpReward = 100, passingScore, onPass
}) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [hasAwarded, setHasAwarded] = useState(false);

  if (!isOpen) return null;

  const handleResult = (finalScore: number, total: number) => {
      setShowResult(true);
      const threshold = passingScore || Math.ceil(total * 0.8);

      if (finalScore >= threshold && !hasAwarded && onPass) {
          onPass();
          setHasAwarded(true);
      }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-[8px_8px_0px_0px_#ABFA00] border-4 border-black text-center max-w-sm w-full">
          <div className="animate-spin h-12 w-12 border-4 border-black dark:border-white border-t-acid rounded-full mx-auto mb-6"></div>
          <h3 className="font-black text-xl mb-2 text-black dark:text-white">GENERATING EXAM</h3>
          <p className="text-gray-600 dark:text-gray-400 font-bold">Analyzing full module content...</p>
        </div>
      </div>
    );
  }

  if (!quizData) return null;

  const question = quizData.questions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === quizData.questions.length - 1;

  const handleOptionSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (selectedOption === question.correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleResult(score + (selectedOption === question.correctAnswerIndex ? 0 : 0), quizData.questions.length);
    } else {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    }
  };

  const resetQuiz = () => {
      onClose();
      setTimeout(() => {
        setCurrentQuestionIdx(0);
        setSelectedOption(null);
        setIsSubmitted(false);
        setScore(0);
        setShowResult(false);
        setHasAwarded(false);
      }, 300);
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-black rounded-2xl shadow-[10px_10px_0px_0px_#ABFA00] border-4 border-black dark:border-zinc-600 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col relative">

        {/* Header */}
        <div className="p-6 border-b-4 border-black dark:border-zinc-700 flex justify-between items-center bg-gray-50 dark:bg-zinc-900">
          <div>
              <h2 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter">{title}</h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  {showResult ? 'Results' : `Question ${currentQuestionIdx + 1} of ${quizData.questions.length}`}
              </p>
          </div>
          <button onClick={resetQuiz} className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-800 p-2 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          {showResult ? (
            <div className="text-center py-8">
              <div className="mb-6 inline-block p-6 rounded-full bg-white dark:bg-zinc-800 border-4 border-black dark:border-zinc-500 shadow-[6px_6px_0px_0px_#000]">
                  {score >= (passingScore || 8) ? <Trophy size={64} className="text-yellow-500 fill-current" /> : <RefreshCw size={64} className="text-gray-400" />}
              </div>

              <h3 className="text-4xl font-black mb-4 uppercase italic text-black dark:text-white">
                  {score >= (passingScore || 8) ? "MODULE CONQUERED!" : "NICE TRY!"}
              </h3>

              <div className="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-300">
                  You scored <span className="text-acid-dark dark:text-acid font-black text-4xl">{score}</span> / {quizData.questions.length}
              </div>

              {score >= (passingScore || 8) ? (
                  <div className="bg-acid/20 border-2 border-acid text-acid-dark dark:text-acid p-4 rounded-xl mb-8 inline-block">
                      <p className="font-black text-xl flex items-center gap-2 justify-center">
                          <Trophy size={20} /> +{xpReward} XP EARNED
                      </p>
                  </div>
              ) : (
                  <p className="text-gray-500 mb-8 font-bold">You need {passingScore || 8} correct answers to pass and earn XP.</p>
              )}

              <button
                onClick={resetQuiz}
                className="neo-btn w-full md:w-auto"
              >
                {score >= (passingScore || 8) ? 'CLAIM REWARD & CLOSE' : 'CLOSE & REVIEW'}
              </button>
            </div>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-zinc-800 h-4 rounded-full border-2 border-black dark:border-zinc-600 mb-8 overflow-hidden">
                 <div
                    className="bg-acid h-full border-r-2 border-black transition-all duration-300"
                    style={{ width: `${((currentQuestionIdx + 1) / quizData.questions.length) * 100}%` }}
                 ></div>
              </div>

              {/* Question */}
              <h3 className="text-2xl font-black text-black dark:text-white mb-8 leading-snug">
                {question.question}
              </h3>

              {/* Options */}
              <div className="space-y-4">
                {question.options.map((option, idx) => {
                  let optionClass = "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group font-bold ";

                  if (isSubmitted) {
                    if (idx === question.correctAnswerIndex) {
                      optionClass += "border-green-600 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
                    } else if (idx === selectedOption) {
                      optionClass += "border-red-600 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
                    } else {
                      optionClass += "border-gray-200 dark:border-zinc-700 text-gray-400 opacity-50";
                    }
                  } else {
                    if (selectedOption === idx) {
                      optionClass += "border-black bg-black text-white dark:bg-white dark:text-black shadow-[4px_4px_0px_0px_#acid]";
                    } else {
                      optionClass += "border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-black dark:hover:border-white hover:bg-gray-50 dark:hover:bg-zinc-800 text-black dark:text-white";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={isSubmitted}
                      className={optionClass}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-lg border-2 border-current flex items-center justify-center text-sm font-black`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {option}
                      </div>
                      {isSubmitted && idx === question.correctAnswerIndex && <CheckCircle className="text-green-600" size={24} />}
                      {isSubmitted && idx === selectedOption && idx !== question.correctAnswerIndex && <XCircle className="text-red-600" size={24} />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {isSubmitted && (
                <div className="mt-8 p-6 bg-blue-50 dark:bg-zinc-800 border-l-8 border-blue-500 rounded-r-xl">
                  <strong className="block text-xs font-black uppercase tracking-widest text-blue-600 mb-2">Explanation</strong>
                  <p className="text-blue-900 dark:text-blue-100 font-medium leading-relaxed">{question.explanation}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!showResult && (
          <div className="p-6 border-t-4 border-black dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 flex justify-end">
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-black rounded-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[4px_4px_0px_0px_#888] uppercase tracking-wider"
              >
                Lock Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-acid text-black border-2 border-black font-black rounded-xl hover:shadow-[4px_4px_0px_0px_#000] transition-all flex items-center gap-2 uppercase tracking-wider"
              >
                {isLastQuestion ? 'Submit Exam' : 'Next Question'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;