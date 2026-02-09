/** @format */

import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Video, Flame, LogOut, AlertTriangle } from "lucide-react";
import { CONTENT_DATA } from "./constants";
import { UserState, Task, QuizData, UserProfile } from "./types";
import {
  regenerateTopicContent,
  generateTopicAudio,
  generateTopicVideo,
  generateChapterQuiz,
} from "./services/geminiService";
import LoginScreen from "./components/LoginScreen";
import { api } from "./services/api";

// Page Imports
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import TopicView from "./pages/TopicView";
import ChapterView from "./pages/ChapterView";
import QuizModal from "./components/QuizModal";

// --- Helper: Dynamic Task Generation ---
const generateTasksFromProfile = (user: UserProfile): Task[] => {
  // 1. Find next uncompleted topic
  let nextTopic = null;
  let quizChapter = null;

  // Flatten topics
  for (const cat of CONTENT_DATA) {
    for (const chap of cat.chapters) {
      // Check if user has finished this chapter?
      const allTopicsInChap = chap.topics.map(t => t.id);
      const finishedChap = allTopicsInChap.every(tid =>
        (user.completedTopics || []).includes(tid),
      );

      if (!finishedChap) {
        // Find first uncompleted
        const t = chap.topics.find(
          top => !(user.completedTopics || []).includes(top.id),
        );
        if (t && !nextTopic) {
          nextTopic = { ...t, chapterId: chap.id };
        }
      } else {
        // If chapter finished, suggest quiz
        if (!quizChapter) quizChapter = chap;
      }
    }
  }

  // Default Fallback
  if (!nextTopic) {
    // All done? Just pick first
    const c = CONTENT_DATA[0].chapters[0];
    nextTopic = { ...c.topics[0], chapterId: c.id };
  }
  if (!quizChapter) {
    quizChapter = CONTENT_DATA[0].chapters[0];
  }

  // Random review topic
  const completed = user.completedTopics || [];
  let reviewTopicId =
    completed.length > 0
      ? completed[Math.floor(Math.random() * completed.length)]
      : nextTopic.id;

  let reviewTopicTitle = "C Basics";
  // Find title
  for (const cat of CONTENT_DATA) {
    for (const ch of cat.chapters) {
      const f = ch.topics.find(t => t.id === reviewTopicId);
      if (f) reviewTopicTitle = f.title;
    }
  }

  return [
    {
      id: `t-${Date.now()}-1`,
      title: `Read: ${nextTopic.title}`,
      completed: false,
      type: "read",
      targetId: nextTopic.id,
      dueDate: "Today",
    },
    {
      id: `t-${Date.now()}-2`,
      title: `Review: ${reviewTopicTitle}`,
      completed: false,
      type: "regenerate",
      targetId: reviewTopicId,
      dueDate: "Today",
    },
    {
      id: `t-${Date.now()}-3`,
      title: `Quiz: ${quizChapter.title}`,
      completed: false,
      type: "quiz",
      targetId: quizChapter.id,
      dueDate: "Tomorrow",
    },
  ];
};

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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // New state for logout modal

  // Video State
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Module Quiz State
  const [moduleQuizData, setModuleQuizData] = useState<QuizData | null>(null);
  const [showModuleQuiz, setShowModuleQuiz] = useState(false);
  const [isGeneratingModuleQuiz, setIsGeneratingModuleQuiz] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // Streak Popup State
  const [showStreakPopup, setShowStreakPopup] = useState(false);

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
            setTasks(generateTasksFromProfile(returningUser));
            setCompletedTopics(returningUser.completedTopics || []);
            setQuizScores(returningUser.quizScores || {});
            api.user.getLeaderboard().then(setLeaderboard);

            // Trigger Streak Popup on restore
            setShowStreakPopup(true);
            setTimeout(() => setShowStreakPopup(false), 2000);
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
    if (user && !user._id.startsWith("guest-")) {
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
    setTasks(generateTasksFromProfile(newUser));

    // Load data from User Profile (API response)
    setCompletedTopics(newUser.completedTopics || []);
    setQuizScores(newUser.quizScores || {});

    // Only fetch leaderboard if not guest
    if (!newUser._id.startsWith("guest-")) {
      api.user.getLeaderboard().then(setLeaderboard);
    }

    // Trigger Streak Popup on explicit login
    setShowStreakPopup(true);
    setTimeout(() => setShowStreakPopup(false), 2000);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setActiveView("dashboard");
    setShowLogoutConfirm(false);
  };

  // --- Centralized Progress Sync Logic ---
  const syncUserProgress = async (
    updates: Partial<UserProfile>,
    checkStreak: boolean = false,
  ) => {
    if (!user) return;

    // 1. Optimistic Local Update (Fast UI)
    let nextUser = { ...user, ...updates };

    // Simulate Streak Calculation Locally
    if (checkStreak) {
      const today = new Date().toISOString().split("T")[0];
      if (nextUser.lastActiveDate !== today) {
        const lastDate = new Date(nextUser.lastActiveDate);
        const currDate = new Date(today);
        const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) nextUser.streak += 1;
        else if (diffDays > 1) nextUser.streak = 1;

        nextUser.lastActiveDate = today;
        nextUser.totalLearningDays = (nextUser.totalLearningDays || 0) + 1;

        // Add to activity history for graph
        const history = [...(nextUser.activityHistory || [])];
        if (!history.includes(today)) history.push(today);
        nextUser.activityHistory = history;
      }
    }
    setUser(nextUser);

    // 2. Network Sync (Skip if Guest)
    if (!user._id.startsWith("guest-")) {
      try {
        if (Object.keys(updates).length > 0) {
          // Update backend data
          const u1 = await api.user.update(user._id, updates);

          // If activity recording is needed, chain it
          if (checkStreak) {
            const u2 = await api.user.recordActivity(u1);
            setUser(u2);
          } else {
            setUser(u1);
          }
        } else if (checkStreak) {
          // Just recording activity
          const u2 = await api.user.recordActivity(user);
          setUser(u2);
        }
        // Refresh leaderboard after updates
        api.user.getLeaderboard().then(setLeaderboard);
      } catch (e) {
        console.warn(
          "Background sync failed (Network Error). Kept local state.",
          e,
        );
      }
    }
  };

  // --- Logic for Starting Module Quiz ---
  const startModuleQuiz = async (chapterId: string, bypassCache = false) => {
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

      const data = await generateChapterQuiz(
        chapter.title,
        fullContext,
        bypassCache,
      );
      setModuleQuizData(data);
    } catch (e) {
      console.error("Failed to generate module quiz", e);
      setShowModuleQuiz(false);
      alert(
        "Quiz generation failed due to high AI demand. Please try again in a moment.",
      );
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
      // Default start (use cache if available)
      startModuleQuiz(chapterId, false);
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

    // Mark completed
    if (!completedTopics.includes(activeTopicId)) {
      const newCompleted = [...completedTopics, activeTopicId];
      setCompletedTopics(newCompleted);

      // Use new sync method
      syncUserProgress({ completedTopics: newCompleted }, true);
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
      syncUserProgress({}, true);
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
      // Force fresh generation (bypassCache = true)
      const newContent = await regenerateTopicContent(
        categoryTitle,
        activeChapter.title,
        activeTopic.title,
        activeTopic.content,
        customPrompt || `Explain in Hinglish`,
        true,
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
      alert(
        "AI Service is currently overloaded (503). Please try again in 1 minute.",
      );
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

    // Sync with centralized logic
    syncUserProgress(
      {
        quizScores: newScores,
        xp: user.xp + 5,
      },
      true,
    );
  };

  const handleModuleQuizPass = async () => {
    if (!user) return;
    syncUserProgress({ xp: user.xp + 100 }, true);
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

      {/* --- STREAK POPUP --- */}
      {showStreakPopup && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="text-center p-8 bg-acid border-4 border-black shadow-[10px_10px_0px_0px_#fff] rounded-2xl transform rotate-2 max-w-sm w-full mx-4">
            <Flame
              size={64}
              className="mx-auto mb-4 text-black animate-pulse"
              fill="black"
            />
            <h2 className="text-5xl font-black text-black mb-2">
              {user.streak} DAY
            </h2>
            <div className="text-xl font-bold bg-black text-white py-2 px-4 inline-block transform -rotate-2">
              STREAK UNLOCKED!
            </div>
            <p className="mt-4 font-bold text-black uppercase tracking-widest text-xs">
              Keep the fire burning!
            </p>
          </div>
        </div>
      )}

      {/* --- LOGOUT MODAL --- */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md p-6 rounded-2xl border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_#ABFA00] transform scale-100 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center border-2 border-black dark:border-red-500">
                <LogOut className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <h3 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter">
                Log Out?
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-bold mb-8">
              You are about to end your session. Your current progress has been
              saved.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 px-4 font-black text-black dark:text-white border-2 border-black dark:border-zinc-500 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors uppercase">
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-3 px-4 font-black text-white bg-black dark:bg-white dark:text-black border-2 border-black dark:border-white rounded-xl hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#ABFA00] transition-all uppercase">
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <Sidebar
        isOpen={sidebarOpen}
        activeTopicId={activeTopicId}
        activeChapterId={activeChapterId} // Passed activeChapterId prop
        activeView={activeView}
        user={user}
        theme={theme}
        onNavigate={handleNavigate}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onLogout={handleLogoutClick} // Updated to open modal
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
