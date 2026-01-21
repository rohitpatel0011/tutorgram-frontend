/** @format */

import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Video } from "lucide-react";
import { CONTENT_DATA } from "./constants";
import { UserState, Task, QuizData, UserProfile } from "./types";
import {
  regenerateTopicContent,
  generateTopicAudio,
  generateTopicVideo,
  generateChapterQuiz,
} from "./services/geminiService";
import LoginScreen from "./components/LoginScreen";
import { getInitialTasks } from "./services/mockDb";
import { api } from "./services/api";

// Page Imports
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import TopicView from "./pages/TopicView";
import ChapterView from "./pages/ChapterView";
import QuizModal from "./components/QuizModal";

// --- Audio Logic Helper ---
const playPCMAudio = async (base64Audio: string, onEnded: () => void) => {
  try {
    const audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )({ sampleRate: 24000 });
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const dataInt16 = new Int16Array(bytes.buffer);
    const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.onended = () => {
      onEnded();
      audioContext.close();
    };
    source.start(0);
    return source;
  } catch (e) {
    console.error("Error playing audio", e);
    onEnded();
    return null;
  }
};

// --- Main App Logic ---

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState("dashboard");
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // App State (Sync with Backend)
  const [aiOverrides, setAiOverrides] = useState<
    Record<string, { content: string; prompt: string }>
  >({});
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);

  // UI State
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  // Video State
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Module Quiz State
  const [moduleQuizData, setModuleQuizData] = useState<QuizData | null>(null);
  const [showModuleQuiz, setShowModuleQuiz] = useState(false);
  const [isGeneratingModuleQuiz, setIsGeneratingModuleQuiz] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const activeChapter = CONTENT_DATA.flatMap(c => c.chapters).find(
    ch => ch.id === activeChapterId,
  );
  const activeTopic = activeChapter?.topics.find(t => t.id === activeTopicId);

  const currentAiVersion =
    activeTopicId && aiOverrides[activeTopicId]
      ? aiOverrides[activeTopicId]
      : null;

  // Initialization & Session Restore
  useEffect(() => {
    const initSession = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const returningUser = await api.auth.getMe();
          if (returningUser) {
            setUser(returningUser);
            setTasks(getInitialTasks());
            setCompletedTopics(returningUser.completedTopics || []);
            setQuizScores(returningUser.quizScores || {});
            api.user.getLeaderboard().then(setLeaderboard);
          }
        } catch (e) {
          console.error("Session restore failed", e);
          localStorage.removeItem("token");
        }
      }
      setIsLoadingSession(false);
    };

    initSession();

    if (document.documentElement.classList.contains("dark")) setTheme("dark");
  }, []);

  // Poll leaderboard
  useEffect(() => {
    if (user) {
      api.user.getLeaderboard().then(setLeaderboard);
    }
  }, [user?.xp]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  useEffect(() => {
    return () => {
      if (audioSourceRef.current) {
        try {
          audioSourceRef.current.stop();
        } catch (e) {}
        audioSourceRef.current = null;
      }
    };
  }, [activeTopicId, activeView]);

  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    setTasks(getInitialTasks()); // Keep mock tasks for daily variety, unrelated to DB persistence for now

    // Load data from User Profile (API response)
    setCompletedTopics(newUser.completedTopics || []);
    setQuizScores(newUser.quizScores || {});

    api.user.getLeaderboard().then(setLeaderboard);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setActiveView("dashboard");
  };

  // --- Logic for Starting Module Quiz ---
  const startModuleQuiz = async (chapterId: string) => {
    const chapter = CONTENT_DATA.flatMap(c => c.chapters).find(
      c => c.id === chapterId,
    );
    if (!chapter) return;

    setShowModuleQuiz(true);
    setIsGeneratingModuleQuiz(true);
    setModuleQuizData(null);

    try {
      const fullContext = chapter.topics
        .map(t => `TOPIC: ${t.title}\nCONTENT:\n${t.content}`)
        .join("\n\n");

      const data = await generateChapterQuiz(chapter.title, fullContext);
      setModuleQuizData(data);
    } catch (e) {
      console.error("Failed to generate module quiz", e);
      setShowModuleQuiz(false);
    } finally {
      setIsGeneratingModuleQuiz(false);
    }
  };

  const handleNavigate = (
    view: string,
    topicId?: string,
    chapterId?: string,
  ) => {
    if (view === "module-quiz" && chapterId) {
      setActiveChapterId(chapterId);
      startModuleQuiz(chapterId);
      setActiveView("chapter");
      setSidebarOpen(false);
      return;
    }

    setActiveView(view);
    if (chapterId) setActiveChapterId(chapterId);
    if (topicId) setActiveTopicId(topicId);
    else if (view === "chapter") setActiveTopicId(null);
    setSidebarOpen(false);
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) {}
      setIsPlayingAudio(false);
    }
    setVideoUrl(null);
    if (window.innerWidth < 768) window.scrollTo(0, 0);
  };

  const handleNextTopic = async () => {
    if (!activeTopicId || !activeChapterId || !user) return;
    let catIdx = -1,
      chapIdx = -1,
      topIdx = -1;
    CONTENT_DATA.forEach((c, i) =>
      c.chapters.forEach((ch, j) => {
        if (ch.id === activeChapterId) {
          catIdx = i;
          chapIdx = j;
          ch.topics.forEach((t, k) => {
            if (t.id === activeTopicId) topIdx = k;
          });
        }
      }),
    );
    if (catIdx === -1) return;

    // Mark completed in Backend
    if (!completedTopics.includes(activeTopicId)) {
      const newCompleted = [...completedTopics, activeTopicId];
      setCompletedTopics(newCompleted);

      try {
        // 1. Update completed topics
        const updatedUser = await api.user.update(user._id, {
          completedTopics: newCompleted,
        });
        // 2. Update Streak
        const withStreak = await api.user.recordActivity(updatedUser);
        setUser(withStreak);
      } catch (e) {
        console.error("Failed to sync progress", e);
      }
    }

    const ch = CONTENT_DATA[catIdx].chapters[chapIdx];
    if (topIdx < ch.topics.length - 1) {
      handleNavigate("topic", ch.topics[topIdx + 1].id, ch.id);
      return;
    }
  };

  const handlePrevTopic = () => {
    if (!activeTopicId || !activeChapterId) return;
    let catIdx = -1,
      chapIdx = -1,
      topIdx = -1;
    CONTENT_DATA.forEach((c, i) =>
      c.chapters.forEach((ch, j) => {
        if (ch.id === activeChapterId) {
          catIdx = i;
          chapIdx = j;
          ch.topics.forEach((t, k) => {
            if (t.id === activeTopicId) topIdx = k;
          });
        }
      }),
    );
    if (catIdx === -1) return;
    const ch = CONTENT_DATA[catIdx].chapters[chapIdx];
    if (topIdx > 0) {
      handleNavigate("topic", ch.topics[topIdx - 1].id, ch.id);
    }
  };

  const toggleTask = async (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );

    // Record activity for streak on task complete
    if (user) {
      const updatedUser = await api.user.recordActivity(user);
      setUser(updatedUser);
    }
  };

  // --- Features ---

  const handleRegenerate = async (customPrompt?: string) => {
    if (!activeTopic || !activeChapter) return;
    setIsRegenerating(true);
    let categoryTitle = "Computer Science";
    for (const cat of CONTENT_DATA) {
      if (cat.chapters.some(c => c.id === activeChapter.id)) {
        categoryTitle = cat.title;
        break;
      }
    }

    try {
      const newContent = await regenerateTopicContent(
        categoryTitle,
        activeChapter.title,
        activeTopic.title,
        activeTopic.content,
        customPrompt || `Explain in Hinglish`,
      );

      setAiOverrides(prev => ({
        ...prev,
        [activeTopic.id]: {
          content: newContent,
          prompt: customPrompt || "Explain in Hinglish",
          timestamp: Date.now(),
        },
      }));
    } catch (e) {
      console.error("Regeneration failed", e);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleToggleAudio = async () => {
    if (isPlayingAudio) {
      if (audioSourceRef.current) {
        try {
          audioSourceRef.current.stop();
        } catch (e) {}
        audioSourceRef.current = null;
      }
      setIsPlayingAudio(false);
      return;
    }
    if (!activeTopic) return;

    setIsGeneratingAudio(true);
    try {
      const text = currentAiVersion
        ? currentAiVersion.content
        : activeTopic.content;
      const cleanText = text.replace(/[#*`]/g, " ").substring(0, 1000);
      const audio = await generateTopicAudio(cleanText);
      if (audio) {
        const source = await playPCMAudio(audio, () =>
          setIsPlayingAudio(false),
        );
        if (source) {
          audioSourceRef.current = source;
          setIsPlayingAudio(true);
        }
      }
    } catch (e) {
      console.error("Audio failed", e);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleWatchExplanation = async () => {
    if (!activeTopic) return;
    if ((window as any).aistudio) {
      try {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await (window as any).aistudio.openSelectKey();
        }
      } catch (e) {
        console.error("API Key Check Error", e);
      }
    }

    setIsGeneratingVideo(true);
    try {
      const url = await generateTopicVideo(activeTopic.title);
      if (url) {
        setVideoUrl(url);
        setShowVideoModal(true);
      }
    } catch (e: any) {
      console.error("Video generation error", e);
      const errString = JSON.stringify(e);
      if (
        errString.includes("403") ||
        errString.includes("PERMISSION_DENIED") ||
        errString.includes("not found") ||
        errString.includes("NOT_FOUND")
      ) {
        if ((window as any).aistudio)
          await (window as any).aistudio.openSelectKey();
      }
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleTopicQuizPass = async (score: number) => {
    if (!user || !activeTopicId) return;
    const newScores = { ...quizScores, [activeTopicId]: score };
    setQuizScores(newScores);

    // Update in Backend
    try {
      const updatedUser = await api.user.update(user._id, {
        quizScores: newScores,
        xp: user.xp + 5,
      });
      const withStreak = await api.user.recordActivity(updatedUser);
      setUser(withStreak);
      api.user.getLeaderboard().then(setLeaderboard);
    } catch (e) {
      console.error("Failed to update quiz score", e);
    }
  };

  const handleModuleQuizPass = async () => {
    if (!user) return;
    try {
      const updatedUser = await api.user.update(user._id, {
        xp: user.xp + 100,
      });
      const withStreak = await api.user.recordActivity(updatedUser);
      setUser(withStreak);
      api.user.getLeaderboard().then(setLeaderboard);
    } catch (e) {
      console.error("Failed to update module completion", e);
    }
  };

  const passedQuizzesCount = Object.values(quizScores).filter(
    (s: number) => s >= 4,
  ).length;

  if (isLoadingSession) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-black">
        <div className="animate-spin h-10 w-10 border-4 border-black dark:border-white border-t-acid rounded-full"></div>
      </div>
    );
  }

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div
      className={`relative z-10 flex h-screen font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300 ${theme}`}>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        activeTopicId={activeTopicId}
        activeView={activeView}
        user={user}
        theme={theme}
        onNavigate={handleNavigate}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onLogout={handleLogout}
        onThemeToggle={toggleTheme}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="md:hidden h-16 bg-white dark:bg-near-black border-b border-slate-200 dark:border-dark-border flex items-center px-4 flex-shrink-0 justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-600 dark:text-slate-400 mr-3">
              <Menu size={24} />
            </button>
            <span className="font-bold text-lg text-indigo-900 dark:text-indigo-400">
              Tutorgram
            </span>
          </div>
          <img
            src={user.avatarUrl}
            className="w-8 h-8 rounded-full bg-indigo-100"
          />
        </div>

        <main className="flex-1 overflow-y-auto scroll-smooth">
          {activeView === "dashboard" && (
            <Dashboard
              tasks={tasks}
              user={user}
              completedTopics={completedTopics}
              passedQuizzesCount={passedQuizzesCount}
              leaderboard={leaderboard}
              onTaskComplete={toggleTask}
              onNavigate={handleNavigate}
            />
          )}

          {activeView === "chapter" && activeChapter && (
            <ChapterView
              activeChapter={activeChapter}
              completedTopics={completedTopics}
              onNavigate={handleNavigate}
            />
          )}

          {activeView === "topic" && activeTopic && activeChapter && (
            <TopicView
              activeChapter={activeChapter}
              activeTopic={activeTopic}
              currentAiVersion={currentAiVersion}
              aiOverrides={aiOverrides}
              setAiOverrides={setAiOverrides}
              quizScores={quizScores}
              onNavigate={handleNavigate}
              handlePrevTopic={handlePrevTopic}
              handleNextTopic={handleNextTopic}
              handleTopicQuizPass={handleTopicQuizPass}
              onRegenerate={handleRegenerate}
              onGenerateVideo={handleWatchExplanation}
              onToggleAudio={handleToggleAudio}
              isRegenerating={isRegenerating}
              isGeneratingVideo={isGeneratingVideo}
              isGeneratingAudio={isGeneratingAudio}
              isPlayingAudio={isPlayingAudio}
            />
          )}
        </main>
      </div>

      {/* Video Modal */}
      {showVideoModal && videoUrl && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-black w-full max-w-5xl rounded-2xl overflow-hidden relative shadow-2xl border border-slate-800">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setShowVideoModal(false)}
                className="bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-all">
                <X size={24} />
              </button>
            </div>
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-auto aspect-video">
              Your browser does not support the video tag.
            </video>
            <div className="p-4 bg-slate-900 text-white border-t border-slate-800">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Video size={20} className="text-acid" />
                AI Video Explanation: {activeTopic?.title}
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Generated by Veo • 720p HD
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Module Quiz Modal */}
      <QuizModal
        isOpen={showModuleQuiz}
        onClose={() => setShowModuleQuiz(false)}
        quizData={moduleQuizData}
        loading={isGeneratingModuleQuiz}
        title="Final Module Exam"
        xpReward={100}
        passingScore={8}
        onPass={handleModuleQuizPass}
      />
    </div>
  );
}
