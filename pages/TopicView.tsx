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
  handleTopicComplete: (topicId: string) => void; // Added Prop
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
  handleTopicComplete,
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
  const [promptText, setPromptText] = useState("");
  const [useHinglish, setUseHinglish] = useState(false);

  const handleRegenSubmit = () => {
    setShowPromptInput(false);
    let basePrompt = promptText.trim();

    if (!basePrompt) {
      basePrompt = "Explain this topic practically with examples.";
    }

    let finalPrompt = "";

    // Strict Language Control
    if (useHinglish) {
      finalPrompt = `${basePrompt} \n\nSTRICT REQUIREMENT: Explain this concept in **Hinglish** (Roman Hindi). Use Hindi grammar/flow but keep technical terms in English. Example style: 'Memory leak tab hota hai jab heap memory free nahi ki jati'.`;
    } else {
      finalPrompt = `${basePrompt} \n\nSTRICT REQUIREMENT: Explain this in **Simple, Clear English** only.`;
    }

    onRegenerate(finalPrompt);
  };

  const currentTopicIndex = activeChapter.topics.findIndex(
    (t: any) => t.id === activeTopic.id,
  );
  const isLastTopic = currentTopicIndex === activeChapter.topics.length - 1;
  const isFirstTopic = currentTopicIndex === 0;

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 md:px-6 pb-40 relative">
      {/* Breadcrumb */}
      <nav className="flex items-center text-xs md:text-sm font-bold mb-6 bg-white dark:bg-black border-2 border-black dark:border-zinc-700 px-3 md:px-4 py-2 rounded-lg shadow-[4px_4px_0px_0px_#000] w-fit overflow-hidden max-w-full">
        <span
          className="text-gray-500 hover:text-black dark:hover:text-white cursor-pointer transition-colors truncate"
          onClick={() => onNavigate("chapter", undefined, activeChapter.id)}>
          {activeChapter.title}
        </span>
        <ChevronRight
          size={14}
          className="mx-2 text-black dark:text-white shrink-0"
        />
        <span className="text-black dark:text-acid truncate">
          {activeTopic.title}
        </span>
      </nav>

      {/* Content Card */}
      <div className="bg-white dark:bg-black rounded-xl border-4 border-black dark:border-zinc-700 p-5 md:p-12 shadow-[6px_6px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#333]">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8 border-b-4 border-black dark:border-zinc-800 pb-6">
          <h1 className="text-2xl md:text-5xl font-black text-black dark:text-white uppercase tracking-tighter leading-tight">
            {activeTopic.title}
          </h1>
          <div className="flex flex-wrap gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => setShowPromptInput(!showPromptInput)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-500 text-black dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all font-bold shadow-[3px_3px_0px_0px_#000] text-sm md:text-base">
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
          <div className="mb-10 bg-acid dark:bg-zinc-900 p-4 md:p-6 rounded-xl border-4 border-black dark:border-white animate-in fade-in slide-in-from-top-4 shadow-[6px_6px_0px_0px_#000]">
            <label className="block text-xs font-black uppercase text-black dark:text-white mb-2 tracking-widest">
              CUSTOM INSTRUCTION
            </label>
            <textarea
              className="w-full p-4 rounded-lg border-2 border-black font-medium text-base md:text-lg outline-none mb-4 bg-white dark:bg-black dark:text-white resize-none"
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
          <div className="text-base md:text-lg leading-relaxed">
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
      <div className="sticky bottom-4 md:bottom-6 z-30 mt-12 px-2">
        <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl shadow-[0px_10px_40px_-10px_rgba(0,0,0,0.2)] border-4 border-black dark:border-zinc-600 flex items-center justify-between gap-3 max-w-2xl mx-auto">
          <button
            onClick={handlePrevTopic}
            disabled={isFirstTopic}
            className={`flex-1 flex items-center justify-center gap-2 py-3 md:py-4 px-4 md:px-6 rounded-xl border-2 font-black transition-all shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#555] md:shadow-[4px_4px_0px_0px_#000]
                        ${
                          isFirstTopic
                            ? "bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-400 dark:text-zinc-600 cursor-not-allowed shadow-none"
                            : "bg-white dark:bg-black border-black dark:border-zinc-500 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 active:translate-y-1"
                        }`}>
            <ArrowLeft size={16} className="md:w-5 md:h-5" />{" "}
            <span className="hidden sm:inline uppercase tracking-wider text-xs md:text-sm">
              Previous
            </span>
          </button>

          {isLastTopic ? (
            <button
              onClick={() => {
                // Mark the current (last) topic as complete before navigating
                handleTopicComplete(activeTopic.id);
                onNavigate("chapter", undefined, activeChapter.id);
              }}
              className="flex-[2] flex items-center justify-center gap-2 py-3 md:py-4 px-4 md:px-6 rounded-xl bg-acid text-black border-2 border-black font-black hover:bg-acid-dark transition-all active:translate-y-1 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] md:shadow-[4px_4px_0px_0px_#000]">
              <span className="uppercase tracking-wider text-xs md:text-sm">
                FINISH MODULE
              </span>
              <CheckCircle size={16} className="md:w-5 md:h-5" />
            </button>
          ) : (
            <button
              onClick={handleNextTopic}
              className="flex-[2] flex items-center justify-center gap-2 py-3 md:py-4 px-4 md:px-6 rounded-xl bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white font-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:translate-y-1 shadow-[2px_2px_0px_0px_#888] dark:shadow-[2px_2px_0px_0px_#555] md:shadow-[4px_4px_0px_0px_#888]">
              <span className="uppercase tracking-wider text-xs md:text-sm">
                NEXT TOPIC
              </span>
              <ArrowRight size={16} className="md:w-5 md:h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Floating Actions */}
      {!isRegenerating && (
        <div className="fixed bottom-28 md:bottom-32 right-4 md:right-8 flex flex-col gap-3 md:gap-4 z-40">
          <button
            onClick={onGenerateVideo}
            disabled={isGeneratingVideo}
            className="w-12 h-12 md:w-16 md:h-16 bg-white dark:bg-black text-black dark:text-white rounded-xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] border-2 border-black dark:border-white flex items-center justify-center hover:bg-acid hover:text-black transition-all hover:-translate-y-1"
            title="Watch Video Explanation">
            {isGeneratingVideo ? (
              <Loader2 size={20} className="animate-spin md:w-6 md:h-6" />
            ) : (
              <Video size={24} className="md:w-7 md:h-7" />
            )}
          </button>

          <button
            onClick={onToggleAudio}
            disabled={isGeneratingAudio}
            className={`w-12 h-12 md:w-16 md:h-16 rounded-xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] border-2 border-black dark:border-white flex items-center justify-center transition-all hover:-translate-y-1 ${isPlayingAudio ? "bg-acid text-black" : "bg-white dark:bg-black text-black dark:text-white"}`}
            title="Listen to Audio">
            {isGeneratingAudio ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : isPlayingAudio ? (
              <StopCircle size={24} className="md:w-7 md:h-7" />
            ) : (
              <Headphones size={24} className="md:w-7 md:h-7" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default TopicView;
