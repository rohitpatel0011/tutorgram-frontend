/** @format */

import React, { useState } from "react";
import {
  Brain,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trophy,
  ArrowRight,
  Shuffle,
  Code2,
  AlertTriangle,
  RotateCcw,
  Terminal,
} from "lucide-react";
import { generateTopicQuiz } from "../services/geminiService";
import { QuizData } from "../types";

interface Props {
  topicTitle: string;
  topicContent: string;
  topicId: string;
  previousScore?: number;
  onPass: (score: number) => void;
}

// Reuse Simple Syntax Highlight Logic
const highlightLine = (line: string): React.ReactNode[] => {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let i = 0;
  // Simplified Regex for Quiz snippets (Code is usually shorter)
  const regex =
    /(\/\/.*$|#.*$)|(".*?"|'.*?')|(\b\d+\b)|([a-zA-Z_]\w*)|([^\s\w])/g;

  const KEYWORDS = new Set([
    "const",
    "let",
    "var",
    "function",
    "return",
    "if",
    "else",
    "for",
    "while",
    "int",
    "void",
    "float",
    "char",
    "include",
    "printf",
    "cout",
    "cin",
    "def",
    "print",
    "import",
    "from",
    "class",
    "public",
  ]);

  let match;
  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex)
      nodes.push(
        <span key={i++} className="text-[#d4d4d4]">
          {line.substring(lastIndex, match.index)}
        </span>,
      );
    const [full, comment, str, num, word, symbol] = match;
    if (comment)
      nodes.push(
        <span key={i++} className="text-[#6A9955] italic">
          {comment}
        </span>,
      );
    else if (str)
      nodes.push(
        <span key={i++} className="text-[#CE9178]">
          {str}
        </span>,
      );
    else if (num)
      nodes.push(
        <span key={i++} className="text-[#B5CEA8]">
          {num}
        </span>,
      );
    else if (word) {
      if (KEYWORDS.has(word))
        nodes.push(
          <span key={i++} className="text-[#C586C0] font-bold">
            {word}
          </span>,
        );
      else
        nodes.push(
          <span key={i++} className="text-[#9CDCFE]">
            {word}
          </span>,
        );
    } else if (symbol)
      nodes.push(
        <span key={i++} className="text-[#d4d4d4]">
          {symbol}
        </span>,
      );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < line.length)
    nodes.push(
      <span key={i++} className="text-[#d4d4d4]">
        {line.substring(lastIndex)}
      </span>,
    );
  return nodes;
};

const QuizCodeSnippet = ({ code }: { code: string }) => {
  return (
    <div className="my-3 rounded-lg border-2 border-black dark:border-zinc-700 overflow-hidden bg-[#1e1e1e] shadow-sm">
      <div className="flex items-center px-3 py-1.5 bg-[#252526] border-b border-white/10">
        <Terminal size={10} className="text-gray-400 mr-2" />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Snippet
        </span>
      </div>
      <div className="p-3 overflow-x-auto custom-scrollbar">
        <pre className="font-mono text-xs leading-relaxed text-[#d4d4d4]">
          <code>
            {code.split("\n").map((line, i) => (
              <div key={i}>{highlightLine(line)}</div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

const TopicQuiz: React.FC<Props> = ({
  topicTitle,
  topicContent,
  topicId,
  previousScore,
  onPass,
}) => {
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [minimized, setMinimized] = useState(
    previousScore !== undefined && previousScore >= 4,
  );

  const handleGenerate = async (bypassCache = false) => {
    setLoading(true);
    setQuizData(null);
    setShowResult(false);
    setScore(0);
    setCurrentQIndex(0);
    setMinimized(false);

    const data = await generateTopicQuiz(topicTitle, topicContent, bypassCache);
    setQuizData(data);
    setLoading(false);
  };

  const handleReset = () => {
    setShowResult(false);
    setScore(0);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const handleOptionSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (!quizData) return;
    setIsSubmitted(true);
    if (
      selectedOption === quizData.questions[currentQIndex].correctAnswerIndex
    ) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (!quizData) return;
    if (currentQIndex < quizData.questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setShowResult(true);
      if (score >= 4) {
        onPass(score);
      }
    }
  };

  // Helper to render text that might contain markdown code blocks
  const renderQuestionText = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```")) {
        const code = part.replace(/```[a-z]*\n?/, "").replace(/```$/, "");
        return <QuizCodeSnippet key={i} code={code} />;
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (minimized) {
    return (
      <div className="mt-12 border-4 border-green-500 bg-green-50 dark:bg-green-900/10 rounded-xl p-6 flex items-center justify-between shadow-[6px_6px_0px_0px_#166534]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-green-500 rounded-lg border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000]">
            <Trophy size={28} />
          </div>
          <div>
            <h3 className="font-black text-xl text-green-800 dark:text-green-400 uppercase tracking-tight">
              Topic Mastered!
            </h3>
            <p className="font-bold text-green-700 dark:text-green-500">
              You scored {previousScore}/5. Great job!
            </p>
          </div>
        </div>
        <button
          onClick={() => handleGenerate(true)} // Force new questions
          className="px-5 py-3 bg-white dark:bg-black border-2 border-black dark:border-white text-black dark:text-white font-black rounded-lg hover:shadow-[4px_4px_0px_0px_#000] dark:hover:shadow-[4px_4px_0px_0px_#fff] transition-all uppercase text-sm">
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="mt-16 bg-white dark:bg-black rounded-xl border-4 border-black dark:border-zinc-700 overflow-hidden shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#444]">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-zinc-900 p-6 border-b-4 border-black dark:border-zinc-700 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-xl font-black text-black dark:text-white flex items-center gap-2 uppercase tracking-tight">
            <Brain className="text-black dark:text-acid" size={24} />
            Topic Quiz
          </h3>
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
            Prove your knowledge on "{topicTitle}"
          </p>
        </div>
        <div className="flex gap-2">
          {!quizData && !loading && (
            <button
              onClick={() => handleGenerate(false)}
              className="px-8 py-3 bg-black dark:bg-acid text-white dark:text-black font-black rounded-lg hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_#888] uppercase tracking-wider">
              Start Quiz
            </button>
          )}
          {quizData && !showResult && (
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-black dark:border-zinc-500 text-black dark:text-white font-bold rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
                title="Restart Quiz">
                <RotateCcw size={16} /> Reset
              </button>
              <button
                onClick={() => handleGenerate(true)} // Force regeneration
                className="px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-black dark:border-zinc-500 text-black dark:text-white font-bold rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
                title="Generate New Questions">
                <Shuffle size={16} /> Change MCQ
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 md:p-10">
        {loading && (
          <div className="text-center py-10">
            <div className="animate-spin w-12 h-12 border-4 border-black dark:border-white border-t-acid rounded-full mx-auto mb-6"></div>
            <p className="font-bold text-black dark:text-white text-lg">
              Brewing fresh questions...
            </p>
          </div>
        )}

        {!quizData && !loading && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 font-medium flex flex-col items-center">
            <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-full mb-4">
              <Code2 size={32} className="text-gray-400" />
            </div>
            Ready? Click "Start Quiz" to generate 5 challenging, code-focused
            questions.
          </div>
        )}

        {quizData && !showResult && (
          <div className="max-w-3xl mx-auto">
            {/* Progress Bar */}
            <div className="flex items-center gap-4 mb-8">
              <span className="font-black text-black dark:text-white text-xs bg-acid px-2 py-1 rounded border border-black">
                Q{currentQIndex + 1}/5
              </span>
              <div className="flex-1 h-3 bg-gray-200 dark:bg-zinc-800 rounded-full border-2 border-black dark:border-zinc-600 overflow-hidden">
                <div
                  className="h-full bg-black dark:bg-white"
                  style={{
                    width: `${((currentQIndex + 1) / 5) * 100}%`,
                  }}></div>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-xl md:text-2xl font-black text-black dark:text-white leading-relaxed">
                {renderQuestionText(quizData.questions[currentQIndex].question)}
              </h4>
            </div>

            <div className="space-y-3 mb-8">
              {quizData.questions[currentQIndex].options.map((opt, idx) => {
                let statusClass =
                  "border-black dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:shadow-[4px_4px_0px_0px_#000] dark:hover:shadow-[4px_4px_0px_0px_#fff]";
                let icon = null;

                if (isSubmitted) {
                  if (
                    idx === quizData.questions[currentQIndex].correctAnswerIndex
                  ) {
                    statusClass =
                      "bg-green-100 dark:bg-green-900 border-green-600 dark:border-green-400 text-green-900 dark:text-green-100";
                    icon = <CheckCircle size={20} />;
                  } else if (idx === selectedOption) {
                    statusClass =
                      "bg-red-100 dark:bg-red-900 border-red-600 dark:border-red-400 text-red-900 dark:text-red-100";
                    icon = <XCircle size={20} />;
                  } else {
                    statusClass =
                      "border-gray-200 dark:border-zinc-800 opacity-50";
                  }
                } else if (selectedOption === idx) {
                  statusClass =
                    "bg-black text-white dark:bg-white dark:text-black border-black shadow-[4px_4px_0px_0px_#acid]";
                }

                // Check if option is code-like
                const isCodeOption =
                  opt.includes("(") ||
                  opt.includes(";") ||
                  opt.includes("{") ||
                  opt.includes("==");

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={isSubmitted}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center justify-between group ${statusClass}`}>
                    <div className="flex items-center gap-4">
                      <span
                        className={`w-8 h-8 rounded-md border-2 border-current flex items-center justify-center text-sm font-black flex-shrink-0`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span
                        className={`font-semibold text-base ${isCodeOption ? "font-mono text-sm" : ""}`}>
                        {opt}
                      </span>
                    </div>
                    {icon}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end">
              {!isSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-black rounded-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[4px_4px_0px_0px_#888] uppercase tracking-wider">
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-8 py-4 bg-acid text-black border-2 border-black font-black rounded-lg hover:shadow-[6px_6px_0px_0px_#000] transition-all flex items-center gap-2 uppercase tracking-wider">
                  {currentQIndex < 4 ? "Next Question" : "See Results"}{" "}
                  <ArrowRight size={20} />
                </button>
              )}
            </div>

            {isSubmitted && (
              <div className="mt-6 p-5 bg-blue-50 dark:bg-zinc-900 border-l-4 border-blue-500 rounded-r-lg text-blue-900 dark:text-blue-100 animate-in fade-in slide-in-from-top-2">
                <strong className="block uppercase text-xs font-black tracking-widest mb-1 text-blue-500">
                  Explanation
                </strong>
                {quizData.questions[currentQIndex].explanation}
              </div>
            )}
          </div>
        )}

        {showResult && (
          <div className="text-center py-10">
            <div className="mb-6 inline-block p-6 rounded-full bg-gray-100 dark:bg-zinc-800 border-4 border-black dark:border-zinc-600">
              {score >= 4 ? (
                <Trophy size={64} className="text-yellow-500" />
              ) : (
                <RefreshCw size={64} className="text-gray-400" />
              )}
            </div>
            <h3 className="text-3xl font-black text-black dark:text-white mb-2 uppercase">
              {score >= 4 ? "QUIZ CRUSHED!" : "KEEP PRACTICING"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 font-bold text-lg">
              You got{" "}
              <span className="text-acid-dark dark:text-acid font-black text-2xl mx-1">
                {score}
              </span>{" "}
              / 5 correct.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-white dark:bg-zinc-800 border-2 border-black dark:border-white text-black dark:text-white font-black rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all uppercase tracking-wider shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
                Retry Quiz
              </button>
              <button
                onClick={() => handleGenerate(true)} // Force new questions
                className="px-6 py-3 bg-black dark:bg-acid border-2 border-black dark:border-acid text-white dark:text-black font-black rounded-lg hover:scale-105 transition-all uppercase tracking-wider shadow-[4px_4px_0px_0px_#888]">
                New Questions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicQuiz;
