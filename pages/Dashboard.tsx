/** @format */

import React, { useState, useEffect, useMemo } from "react";
import {
  Award,
  Flame,
  Zap,
  CheckSquare,
  ArrowRight,
  BookOpen,
  Trophy,
  Play,
  CheckCircle,
  Clock,
  Activity,
  Star,
  Sparkles,
  TrendingUp,
  ChevronRight,
  Layers,
  Hand,
} from "lucide-react";
import { Task, UserProfile } from "../types";
import { CONTENT_DATA } from "../constants";
import { generateMotivationalQuote } from "../services/geminiService";

interface DashboardProps {
  tasks: Task[];
  user: UserProfile;
  completedTopics: string[];
  passedQuizzesCount: number;
  leaderboard: UserProfile[];
  onTaskComplete: (id: string) => void;
  onNavigate: (view: string, topicId?: string, chapterId?: string) => void;
}

const FALLBACK_QUOTES = [
  "READY TO CRUSH SOME CODE?",
  "CONSISTENCY IS THE KEY.",
  "DEBUGGING REALITY...",
  "INSTALLING NEW SKILLS...",
  "1% BETTER EVERY DAY.",
  "CODE IS POETRY.",
  "BUILDING THE FUTURE.",
  "ERROR 404: LAZINESS NOT FOUND.",
  "WHILE(ALIVE) { CODE(); }",
  "THINK TWICE, CODE ONCE.",
];

// Helper to type out text character by character
const TypewriterText: React.FC<{
  text: string;
  delay?: number;
  infinite?: boolean;
}> = ({ text, delay = 0, infinite = false }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText(""); // Reset on text change

    let timeout: ReturnType<typeof setTimeout>;
    let typeInterval: ReturnType<typeof setInterval>;

    const startTyping = () => {
      let i = 0;
      const speed = 60;
      typeInterval = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        if (i === text.length) clearInterval(typeInterval);
      }, speed);
      return typeInterval;
    };

    timeout = setTimeout(() => {
      startTyping();
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (typeInterval) clearInterval(typeInterval);
    };
  }, [text, delay]);

  return (
    <span className="font-mono border-r-[3px] border-black dark:border-white pr-1 typing-cursor">
      {displayedText}
    </span>
  );
};

const Dashboard: React.FC<DashboardProps> = ({
  tasks,
  user,
  completedTopics,
  passedQuizzesCount,
  leaderboard,
  onTaskComplete,
  onNavigate,
}) => {
  const [motivationalQuote, setMotivationalQuote] = useState(
    FALLBACK_QUOTES[0],
  );

  // Dynamic Random Hero Course State
  const [randomHeroCourse, setRandomHeroCourse] = useState<any>(null);

  useEffect(() => {
    // Fetch quote only ONCE on mount (Service handles caching)
    const fetchQuote = async () => {
      try {
        const aiQuote = await generateMotivationalQuote();
        if (aiQuote) setMotivationalQuote(aiQuote);
      } catch (e) {
        console.warn("Using fallback quote due to API limit.");
      }
    };

    fetchQuote();
  }, []);

  // Compute stats for "Quizzes Aced" based on user data, not just hardcoded 0
  const actualPassedQuizzes = user.quizScores
    ? Object.values(user.quizScores).filter((score: number) => score >= 4)
        .length
    : 0;

  // Use user.totalLearningDays for Focus Time, assuming 1 day = approx 1 hour of focus for simplicity in display
  const focusTimeHours = user.totalLearningDays || 0;

  const allCourseProgress = React.useMemo(() => {
    const courses: any[] = [];
    CONTENT_DATA.forEach(cat => {
      cat.chapters.forEach(chap => {
        const totalTopics = chap.topics.length;
        if (totalTopics === 0) return;
        const completedInChap = chap.topics.filter(t =>
          completedTopics.includes(t.id),
        ).length;
        const nextTopic = chap.topics.find(
          t => !completedTopics.includes(t.id),
        );
        courses.push({
          id: chap.id,
          title: chap.title,
          progress: Math.round((completedInChap / totalTopics) * 100),
          categoryTitle: cat.title,
          nextTopic: nextTopic,
          totalTopics,
          completedInChap,
          isStarted: completedInChap > 0,
        });
      });
    });
    return courses;
  }, [completedTopics]);

  const inProgressCourses = allCourseProgress.filter(
    c => c.isStarted && c.progress < 100,
  );

  // Randomize Hero Content ON MOUNT (Haar baar dynamic)
  useEffect(() => {
    if (inProgressCourses.length > 0) {
      // If courses are in progress, prioritize them, but shuffle slightly
      setRandomHeroCourse(inProgressCourses[0]);
    } else {
      // Completely random pick from all courses
      const randomIndex = Math.floor(Math.random() * allCourseProgress.length);
      setRandomHeroCourse(allCourseProgress[randomIndex]);
    }
  }, [allCourseProgress]); // Will update if progress changes, or can rely on mount

  // --- WEEKLY STREAK LOGIC ---
  const last7Days = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      // Check if this date exists in user history
      // (Assuming activityHistory is YYYY-MM-DD strings)
      const isActive = (user.activityHistory || []).includes(dateStr);

      days.push({
        label: d.toLocaleDateString("en-US", { weekday: "narrow" }), // M, T, W...
        date: dateStr,
        isActive: isActive,
      });
    }
    return days;
  }, [user.activityHistory]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 lg:px-8 pb-32">
      {/* Header with Typing Effect */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_#000]">
          <h1 className="text-4xl font-black text-black tracking-tighter flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <Hand
                className="text-yellow-400 animate-bounce fill-current"
                size={36}
              />
              <span>HEY,</span>
            </div>
            {/* Typing Name ONLY ONCE on Load */}
            <TypewriterText
              text={`${user.name.split(" ")[0].toUpperCase()}`}
              delay={0}
            />
          </h1>
          <p className="text-gray-600 mt-2 text-lg font-bold h-8 flex items-center">
            {/* Typing Quote - Changes every 5 mins */}
            <TypewriterText
              key={motivationalQuote}
              text={motivationalQuote}
              delay={1500}
            />
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* WEEKLY TRACKER REPLACING SIMPLE STREAK */}
          <div className="flex flex-col px-4 py-2 bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000] rounded-xl transform hover:-translate-y-1 transition-transform">
            <div className="flex items-center gap-2 mb-2">
              <Flame size={16} className="fill-orange-500 text-black" />
              <span className="text-xs font-black uppercase text-gray-400 tracking-wider">
                Weekly Streak
              </span>
              <span className="ml-auto font-black text-lg">{user.streak}</span>
            </div>
            <div className="flex gap-1.5">
              {last7Days.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-3 h-8 rounded-sm border border-black ${day.isActive ? "bg-orange-500" : "bg-gray-200"}`}></div>
                  <span className="text-[9px] font-bold text-gray-500">
                    {day.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 py-3 bg-black border-4 border-black shadow-[4px_4px_0px_0px_#ABFA00] rounded-xl transform hover:-translate-y-1 transition-transform h-[88px]">
            <Zap size={24} className="fill-acid text-acid" />
            <div>
              <div className="text-[10px] uppercase font-black text-gray-500">
                XP
              </div>
              <div className="font-black text-xl text-acid leading-none">
                {user.xp}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* --- LEFT COLUMN --- */}
        <div className="lg:col-span-8 space-y-10">
          {/* COMPACT HERO CARD (Randomized) */}
          {randomHeroCourse && (
            <div
              className="relative rounded-xl bg-black border-4 border-black overflow-hidden group cursor-pointer shadow-[6px_6px_0px_0px_#ABFA00] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_#ABFA00] transition-all"
              onClick={() =>
                randomHeroCourse.nextTopic
                  ? onNavigate(
                      "topic",
                      randomHeroCourse.nextTopic.id,
                      randomHeroCourse.id,
                    )
                  : onNavigate("chapter", undefined, randomHeroCourse.id)
              }>
              <div className="relative z-10 p-6 md:p-8">
                <div className="flex justify-between items-start mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-acid border-2 border-black font-black text-[10px] uppercase tracking-wider text-black rounded-md">
                    <Sparkles size={12} />{" "}
                    {randomHeroCourse.isStarted
                      ? "CONTINUE LEARNING"
                      : "SUGGESTED FOR YOU"}
                  </div>

                  <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0 bg-white rounded-full border-4 border-black">
                    <span className="font-black text-xs text-black">
                      {randomHeroCourse.progress}%
                    </span>
                  </div>
                </div>

                <h2 className="text-2xl md:text-4xl font-black text-white mb-4 leading-none tracking-tighter uppercase truncate">
                  {randomHeroCourse.title}
                </h2>

                <div className="flex flex-col md:flex-row gap-8 mb-6">
                  <div>
                    <div className="text-gray-500 text-[10px] font-black uppercase mb-1">
                      UP NEXT
                    </div>
                    <div className="text-acid font-bold text-base flex items-center gap-2">
                      <Layers size={16} />
                      {randomHeroCourse.nextTopic
                        ? randomHeroCourse.nextTopic.title
                        : "Introduction"}
                    </div>
                  </div>
                </div>

                <button className="neo-btn w-full md:w-auto text-sm py-2">
                  {randomHeroCourse.isStarted ? "RESUME" : "START"}{" "}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* YOUR LEARNING (Others) */}
          {inProgressCourses.length > 0 && (
            <section>
              <h3 className="text-xl font-black text-black mb-4 flex items-center gap-3 uppercase tracking-tight bg-white inline-block px-3 py-1 border-4 border-black shadow-[3px_3px_0px_0px_#000]">
                <BookOpen size={20} /> Your Learning
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {inProgressCourses.slice(0, 4).map(course => (
                  <div
                    key={course.id}
                    className="bg-white border-4 border-black p-5 rounded-lg shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all cursor-pointer flex flex-col justify-between h-full relative overflow-hidden"
                    onClick={() =>
                      onNavigate("topic", course.nextTopic?.id, course.id)
                    }>
                    <div className="absolute top-0 right-0 p-2">
                      <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-acid">
                        <Play size={10} className="ml-1 fill-current" />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1 block">
                        {course.categoryTitle}
                      </span>
                      <h4 className="font-black text-lg text-black mb-2 leading-tight uppercase truncate">
                        {course.title}
                      </h4>
                      <p className="text-xs font-bold text-gray-600 mb-4 border-l-4 border-acid pl-3 truncate">
                        Next: {course.nextTopic?.title}
                      </p>
                    </div>

                    <div>
                      <div className="w-full bg-gray-200 h-3 rounded-full border-2 border-black overflow-hidden">
                        <div
                          className="h-full bg-acid border-r-2 border-black"
                          style={{ width: `${course.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TASKS */}
          <section>
            <h3 className="text-xl font-black text-black mb-4 flex items-center gap-3 uppercase tracking-tight bg-white inline-block px-3 py-1 border-4 border-black shadow-[3px_3px_0px_0px_#000]">
              <CheckSquare size={20} /> Daily Tasks
            </h3>

            <div className="space-y-3">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`bg-white p-4 flex items-center justify-between border-4 border-black rounded-lg shadow-[3px_3px_0px_0px_#000] transition-all ${task.completed ? "opacity-60 grayscale" : "hover:translate-x-[-2px] hover:translate-y-[-2px]"}`}>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onTaskComplete(task.id)}
                      className={`w-6 h-6 rounded-md border-2 border-black flex items-center justify-center transition-all ${task.completed ? "bg-black" : "bg-white hover:bg-gray-100"}`}>
                      {task.completed && (
                        <CheckCircle size={14} className="text-acid" />
                      )}
                    </button>
                    <div>
                      <h4
                        className={`font-bold text-md text-black ${task.completed ? "line-through" : ""}`}>
                        {task.title}
                      </h4>
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-black inline-block mt-1 ${
                          task.type === "read"
                            ? "bg-blue-100"
                            : task.type === "quiz"
                              ? "bg-acid"
                              : "bg-purple-100"
                        }`}>
                        {task.type}
                      </span>
                    </div>
                  </div>

                  {!task.completed && (
                    <button
                      onClick={() => {
                        let chapterId = "";
                        let topicId = "";

                        // Search for the target ID in content
                        for (const cat of CONTENT_DATA) {
                          for (const chap of cat.chapters) {
                            if (chap.id === task.targetId) {
                              chapterId = chap.id;
                              break;
                            }
                            for (const top of chap.topics) {
                              if (top.id === task.targetId) {
                                topicId = top.id;
                                chapterId = chap.id;
                                break;
                              }
                            }
                          }
                        }

                        if (task.type === "quiz") {
                          if (chapterId)
                            onNavigate("chapter", undefined, chapterId);
                        } else {
                          if (topicId && chapterId)
                            onNavigate("topic", topicId, chapterId);
                        }
                      }}
                      className="p-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="lg:col-span-4 space-y-8">
          {/* LEADERBOARD */}
          <div className="bg-white border-4 border-black rounded-xl p-5 shadow-[6px_6px_0px_0px_#000]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b-4 border-black">
              <h3 className="font-black text-lg text-black flex items-center gap-2 uppercase">
                <Trophy size={18} className="text-black" /> Top Scholars
              </h3>
            </div>

            <div className="space-y-3">
              {leaderboard.map((s, i) => (
                <div
                  key={s._id}
                  className={`flex items-center p-2 rounded-lg border-2 border-black transition-all gap-3 ${s._id === user._id ? "bg-acid" : "bg-white"}`}>
                  <div className="w-6 font-black text-lg text-black text-center flex-shrink-0">
                    #{i + 1}
                  </div>
                  <img
                    src={s.avatarUrl}
                    className="w-8 h-8 rounded-md bg-white border-2 border-black object-cover flex-shrink-0"
                    alt={s.name}
                  />

                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p
                      className="text-sm font-bold text-black truncate w-full"
                      title={s.name}>
                      {s.name} {s._id === user._id && "(You)"}
                    </p>
                    <p className="text-[10px] font-bold text-gray-600 truncate w-full">
                      {s.streak} Day Streak
                    </p>
                  </div>

                  <div className="text-[10px] font-black bg-black text-white px-2 py-1 rounded flex-shrink-0 whitespace-nowrap">
                    {s.xp} XP
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK STATS - DYNAMICALLY LINKED */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000] text-center">
              <div className="text-3xl font-black text-black mb-1">
                {actualPassedQuizzes}
              </div>
              <div className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
                Quizzes Aced
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000] text-center">
              <div className="text-3xl font-black text-black mb-1">
                {focusTimeHours}h
              </div>
              <div className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
                Focus Time
              </div>
            </div>
          </div>

          {/* PROMO */}
          <div className="bg-black text-white rounded-xl p-6 border-4 border-black shadow-[6px_6px_0px_0px_#ABFA00] text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white border-4 border-black rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="text-black fill-black" size={24} />
              </div>
              <h3 className="font-black text-xl mb-1 uppercase italic">
                GO PRO
              </h3>
              <p className="text-gray-300 text-xs mb-4 font-bold">
                Unlock System Design & 1-on-1 Mentorship.
              </p>
              <button className="w-full py-2 bg-acid text-black font-black border-2 border-black rounded-lg hover:bg-white transition-colors uppercase tracking-wider text-sm">
                UPGRADE NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
