/** @format */

import React, { useState } from "react";
import {
  ChevronRight,
  LogOut,
  Video,
  Loader2,
  StopCircle,
  Headphones,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  RefreshCcw,
  Languages,
} from "lucide-react";
import MarkdownRenderer from "../components/MarkdownRenderer";
import TopicQuiz from "../components/TopicQuiz";

interface Props {
  activeChapter: any;
  activeTopic: any;
  currentAiVersion: any;
  aiOverrides: any;
  setAiOverrides: any;
  quizScores: any;
  onNavigate: any;
  handlePrevTopic: any;
  handleNextTopic: any;
  handleTopicQuizPass: any;
  // Actions
  onRegenerate: (customPrompt?: string) => void;
  onGenerateVideo: () => void;
  onToggleAudio: () => void;
  isRegenerating: boolean;
  isGeneratingVideo: boolean;
  isGeneratingAudio: boolean;
  isPlayingAudio: boolean;
}

const TopicView: React.FC<Props> = ({
  activeChapter,
  activeTopic,
  currentAiVersion,
  aiOverrides,
  setAiOverrides,
  quizScores,
  onNavigate,
  handlePrevTopic,
  handleNextTopic,
  handleTopicQuizPass,
  onRegenerate,
  onGenerateVideo,
  onToggleAudio,
  isRegenerating,
  isGeneratingVideo,
  isGeneratingAudio,
  isPlayingAudio,
}) => {
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [promptText, setPromptText] = useState(
    "Explain like I have VS Code open. Give me 5 practical examples and code snippets.",
  );
  const [useHinglish, setUseHinglish] = useState(false);

  const handleRegenSubmit = () => {
    setShowPromptInput(false);
    let finalPrompt = promptText.trim();

    if (!finalPrompt) {
      finalPrompt = "Explain this topic practically with examples.";
    }

    // Explicit language instruction based on toggle
    if (useHinglish) {
      finalPrompt += " Explain in Hinglish (Roman Hindi).";
    } else {
      finalPrompt += " Explain in clear English.";
    }

    onRegenerate(finalPrompt);
  };

  const currentTopicIndex = activeChapter.topics.findIndex(
    (t: any) => t.id === activeTopic.id,
  );
  const isLastTopic = currentTopicIndex === activeChapter.topics.length - 1;
  const isFirstTopic = currentTopicIndex === 0;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 md:px-6 pb-40 relative">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm font-bold mb-8 bg-white dark:bg-black border-2 border-black dark:border-zinc-700 px-4 py-2 rounded-lg shadow-[4px_4px_0px_0px_#000] w-fit">
        <span
          className="text-gray-500 hover:text-black dark:hover:text-white cursor-pointer transition-colors"
          onClick={() => onNavigate("chapter", undefined, activeChapter.id)}>
          {activeChapter.title}
        </span>
        <ChevronRight size={16} className="mx-2 text-black dark:text-white" />
        <span className="text-black dark:text-acid">{activeTopic.title}</span>
      </nav>

      {/* Content Card */}
      <div className="bg-white dark:bg-black rounded-xl border-4 border-black dark:border-zinc-700 p-8 md:p-12 shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#333]">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-10 border-b-4 border-black dark:border-zinc-800 pb-6">
          <h1 className="text-3xl md:text-5xl font-black text-black dark:text-white uppercase tracking-tighter leading-none">
            {activeTopic.title}
          </h1>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => setShowPromptInput(!showPromptInput)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-500 text-black dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all font-bold shadow-[3px_3px_0px_0px_#000]">
              <RefreshCcw
                size={16}
                className={isRegenerating ? "animate-spin" : ""}
              />
              {isRegenerating ? "Regenerating..." : "Regenerate"}
            </button>
            {currentAiVersion && (
              <button
                onClick={() => {
                  const n = { ...aiOverrides };
                  delete n[activeTopic.id];
                  setAiOverrides(n);
                }}
                className="p-2 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-500 text-black dark:text-white rounded-lg hover:bg-red-50 hover:text-red-600 shadow-[3px_3px_0px_0px_#000]">
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Prompt Input Area */}
        {showPromptInput && (
          <div className="mb-10 bg-acid dark:bg-zinc-900 p-6 rounded-xl border-4 border-black dark:border-white animate-in fade-in slide-in-from-top-4 shadow-[6px_6px_0px_0px_#000]">
            <label className="block text-xs font-black uppercase text-black dark:text-white mb-2 tracking-widest">
              CUSTOM INSTRUCTION
            </label>
            <textarea
              className="w-full p-4 rounded-lg border-2 border-black font-medium text-lg outline-none mb-4 bg-white dark:bg-black dark:text-white resize-none"
              placeholder="e.g. 'Explain like I'm 5', 'Focus on interview questions', 'Use a cooking analogy'"
              rows={3}
              value={promptText}
              onChange={e => setPromptText(e.target.value)}></textarea>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Hinglish Toggle */}
              <button
                onClick={() => setUseHinglish(!useHinglish)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all w-full sm:w-auto ${useHinglish ? "bg-black text-white border-black" : "bg-white text-gray-500 border-gray-400 hover:border-black hover:text-black"}`}>
                <Languages size={18} />
                <div className="flex flex-col items-start text-xs">
                  <span className="font-black uppercase tracking-wider">
                    {useHinglish ? "HINGLISH: ON" : "HINGLISH: OFF"}
                  </span>
                  <span className="text-[10px] font-medium opacity-80">
                    {useHinglish
                      ? "Explains in Roman Hindi"
                      : "Explains in English"}
                  </span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border border-current ml-2 flex items-center justify-center`}>
                  {useHinglish && (
                    <div className="w-2 h-2 rounded-full bg-current"></div>
                  )}
                </div>
              </button>

              <div className="flex justify-end gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowPromptInput(false)}
                  className="px-5 py-2 font-bold text-black dark:text-white hover:underline">
                  Cancel
                </button>
                <button
                  onClick={handleRegenSubmit}
                  className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black font-bold rounded-lg hover:scale-105 transition-transform shadow-[3px_3px_0px_0px_rgba(255,255,255,0.5)]">
                  Generate
                </button>
              </div>
            </div>
          </div>
        )}

        {isRegenerating ? (
          <div className="animate-pulse space-y-6 py-8">
            <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-3/4"></div>
            <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded w-full"></div>
            <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded w-full"></div>
            <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded w-5/6"></div>
            <div className="h-32 bg-gray-100 dark:bg-zinc-800 rounded w-full border-2 border-dashed border-gray-300 dark:border-zinc-700"></div>
          </div>
        ) : (
          <div className="text-lg leading-relaxed">
            <MarkdownRenderer
              content={
                currentAiVersion
                  ? currentAiVersion.content
                  : activeTopic.content
              }
            />
          </div>
        )}
      </div>

      {/* Inline Topic Quiz Section */}
      <TopicQuiz
        key={activeTopic.id}
        topicTitle={activeTopic.title}
        topicContent={
          currentAiVersion ? currentAiVersion.content : activeTopic.content
        }
        topicId={activeTopic.id}
        previousScore={quizScores[activeTopic.id]}
        onPass={handleTopicQuizPass}
      />

      {/* Navigation Bar */}
      <div className="sticky bottom-6 z-30 mt-12">
        <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl shadow-[0px_10px_40px_-10px_rgba(0,0,0,0.2)] border-4 border-black dark:border-zinc-600 flex items-center justify-between gap-4 max-w-2xl mx-auto">
          <button
            onClick={handlePrevTopic}
            disabled={isFirstTopic}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl border-2 font-black transition-all shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#555]
                        ${
                          isFirstTopic
                            ? "bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-400 dark:text-zinc-600 cursor-not-allowed shadow-none"
                            : "bg-white dark:bg-black border-black dark:border-zinc-500 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 active:translate-y-1"
                        }`}>
            <ArrowLeft size={20} />{" "}
            <span className="hidden sm:inline uppercase tracking-wider">
              Previous
            </span>
          </button>

          {isLastTopic ? (
            <button
              onClick={() => onNavigate("chapter", undefined, activeChapter.id)}
              className="flex-[2] flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-acid text-black border-2 border-black font-black hover:bg-acid-dark transition-all active:translate-y-1 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
              <span className="uppercase tracking-wider">FINISH MODULE</span>
              <CheckCircle size={20} />
            </button>
          ) : (
            <button
              onClick={handleNextTopic}
              className="flex-[2] flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white font-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:translate-y-1 shadow-[4px_4px_0px_0px_#888] dark:shadow-[4px_4px_0px_0px_#555]">
              <span className="uppercase tracking-wider">NEXT TOPIC</span>
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Floating Actions */}
      {!isRegenerating && (
        <div className="fixed bottom-32 right-8 flex flex-col gap-4 z-40">
          <button
            onClick={onGenerateVideo}
            disabled={isGeneratingVideo}
            className="w-16 h-16 bg-white dark:bg-black text-black dark:text-white rounded-xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] border-2 border-black dark:border-white flex items-center justify-center hover:bg-acid hover:text-black transition-all hover:-translate-y-1"
            title="Watch Video Explanation">
            {isGeneratingVideo ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <Video size={28} />
            )}
          </button>

          <button
            onClick={onToggleAudio}
            disabled={isGeneratingAudio}
            className={`w-16 h-16 rounded-xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] border-2 border-black dark:border-white flex items-center justify-center transition-all hover:-translate-y-1 ${isPlayingAudio ? "bg-acid text-black" : "bg-white dark:bg-black text-black dark:text-white"}`}
            title="Listen to Audio">
            {isGeneratingAudio ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : isPlayingAudio ? (
              <StopCircle size={28} />
            ) : (
              <Headphones size={28} />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default TopicView;
