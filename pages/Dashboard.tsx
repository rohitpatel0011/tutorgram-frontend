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
  Target,
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

const TypewriterText: React.FC<{
  text: string;
  delay?: number;
  infinite?: boolean;
}> = ({ text, delay = 0, infinite = false }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    setDisplayedText("");
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
  const [heroCourse, setHeroCourse] = useState<any>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const aiQuote = await generateMotivationalQuote();
        if (aiQuote) setMotivationalQuote(aiQuote);
      } catch (e) {
        console.warn("Using fallback quote.");
      }
    };
    fetchQuote();
  }, []);

  // Compute stats
  const actualPassedQuizzes = user.quizScores
    ? Object.values(user.quizScores).filter((score: number) => score >= 4)
        .length
    : 0;
  const focusTimeHours = user.totalLearningDays || 0;

  // Course Progress Logic - Enhanced
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

  // Set Hero Course: Prioritize Highest Progress Course that isn't finished
  useEffect(() => {
    if (inProgressCourses.length > 0) {
      // Sort by progress descending to show the one closest to completion or most engaged with
      const sorted = [...inProgressCourses].sort(
        (a, b) => b.progress - a.progress,
      );
      setHeroCourse(sorted[0]);
    } else if (allCourseProgress.length > 0) {
      // Fallback to the first available course (C Foundations)
      setHeroCourse(allCourseProgress[0]);
    }
  }, [allCourseProgress]);

  // Weekly Streak Logic
  const last7Days = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const isActive = (user.activityHistory || []).includes(dateStr);
      days.push({
        label: d.toLocaleDateString("en-US", { weekday: "narrow" }),
        date: dateStr,
        isActive: isActive,
      });
    }
    return days;
  }, [user.activityHistory]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 lg:px-8 pb-32">
      {/* --- HEADER SECTION --- */}
      <header className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-tighter flex items-center gap-3 mb-2">
            <Hand
              className="text-yellow-400 animate-bounce fill-current hidden sm:block"
              size={40}
            />
            WELCOME BACK,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-acid-dark to-acid">
              {user.name.split(" ")[0].toUpperCase()}
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-bold flex items-center gap-2 h-8">
            <span className="text-acid dark:text-acid">❯</span>{" "}
            <TypewriterText
              key={motivationalQuote}
              text={motivationalQuote}
              delay={500}
            />
          </p>
        </div>

        {/* Stats Strip */}
        <div className="flex gap-4 overflow-x-auto pb-2 xl:pb-0 no-scrollbar">
          {/* Streak */}
          <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 rounded-xl px-5 py-3 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#555] flex flex-col justify-center min-w-[120px]">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-500 mb-1">
              <Flame size={14} className="text-orange-500 fill-orange-500" />{" "}
              Streak
            </div>
            <div className="text-2xl font-black text-black dark:text-white">
              {user.streak} Days
            </div>
          </div>

          {/* XP */}
          <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 rounded-xl px-5 py-3 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#555] flex flex-col justify-center min-w-[120px]">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-500 mb-1">
              <Zap size={14} className="text-acid fill-acid" /> XP
            </div>
            <div className="text-2xl font-black text-black dark:text-white">
              {user.xp}
            </div>
          </div>

          {/* Quizzes */}
          <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 rounded-xl px-5 py-3 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#555] flex flex-col justify-center min-w-[120px]">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-500 mb-1">
              <Trophy size={14} className="text-yellow-500 fill-yellow-500" />{" "}
              Quizzes
            </div>
            <div className="text-2xl font-black text-black dark:text-white">
              {actualPassedQuizzes}
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* --- MAIN COLUMN (Left 2/3) --- */}
        <div className="xl:col-span-2 space-y-8">
          {/* HERO COURSE CARD (Dynamic) */}
          {heroCourse && (
            <div
              onClick={() =>
                heroCourse.nextTopic
                  ? onNavigate("topic", heroCourse.nextTopic.id, heroCourse.id)
                  : onNavigate("chapter", undefined, heroCourse.id)
              }
              className="group relative bg-black dark:bg-zinc-900 rounded-2xl border-4 border-black dark:border-zinc-500 overflow-hidden cursor-pointer shadow-[8px_8px_0px_0px_#ABFA00] hover:shadow-[12px_12px_0px_0px_#ABFA00] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

              <div className="relative z-10 p-8 flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-acid border-2 border-black rounded-lg text-xs font-black uppercase mb-4">
                    <Sparkles size={14} className="fill-black" />
                    {heroCourse.isStarted
                      ? "Jump Back In"
                      : "Start Your Journey"}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tighter">
                    {heroCourse.title}
                  </h2>
                  <p className="text-gray-400 font-bold mb-6 flex items-center gap-2">
                    <Layers size={18} />
                    {heroCourse.nextTopic
                      ? `Continue: ${heroCourse.nextTopic.title}`
                      : "Introduction"}
                  </p>

                  <div className="flex items-center gap-4">
                    <button className="neo-btn px-6 py-3 text-sm">
                      {heroCourse.isStarted
                        ? "Resume Learning"
                        : "Start Module"}{" "}
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>

                {/* Circular Progress */}
                <div className="flex items-center justify-center">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="56"
                        cy="56"
                        r="50"
                        className="text-gray-800"
                        strokeWidth="12"
                        fill="transparent"
                        stroke="currentColor"
                      />
                      <circle
                        cx="56"
                        cy="56"
                        r="50"
                        className="text-acid"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={314}
                        strokeDashoffset={
                          314 - (314 * heroCourse.progress) / 100
                        }
                        strokeLinecap="round"
                        stroke="currentColor"
                      />
                    </svg>
                    <span className="absolute font-black text-2xl text-white">
                      {heroCourse.progress}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DAILY TASKS GRID */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-tight flex items-center gap-2">
                <CheckSquare size={24} className="text-black dark:text-white" />{" "}
                Daily Missions
              </h3>
              <span className="text-xs font-bold bg-gray-200 dark:bg-zinc-800 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
                {tasks.filter(t => t.completed).length}/{tasks.length} Done
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-600 p-4 rounded-xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#555] flex flex-col justify-between h-full transition-all ${task.completed ? "opacity-60 grayscale" : "hover:-translate-y-1"}`}>
                  <div className="mb-4">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border border-black dark:border-zinc-500 inline-block mb-2 ${
                        task.type === "read"
                          ? "bg-blue-200 text-blue-900"
                          : task.type === "quiz"
                            ? "bg-acid text-black"
                            : "bg-purple-200 text-purple-900"
                      }`}>
                      {task.type}
                    </span>
                    <h4
                      className={`font-bold text-sm leading-tight text-black dark:text-white ${task.completed ? "line-through" : ""}`}>
                      {task.title}
                    </h4>
                  </div>

                  <div className="flex justify-between items-end">
                    <button
                      onClick={() => onTaskComplete(task.id)}
                      className={`w-8 h-8 rounded-lg border-2 border-black dark:border-zinc-500 flex items-center justify-center transition-all ${task.completed ? "bg-black text-white" : "bg-white hover:bg-gray-100"}`}>
                      {task.completed && (
                        <CheckCircle size={16} className="text-acid" />
                      )}
                    </button>

                    {!task.completed && (
                      <button
                        onClick={() => {
                          // Navigation Logic
                          let chapterId = "";
                          let topicId = "";
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
                        className="text-xs font-bold underline flex items-center text-black dark:text-white hover:text-acid transition-colors">
                        GO <ArrowRight size={12} className="ml-1" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* OTHER COURSES */}
          {inProgressCourses.length > 1 && (
            <section>
              <h3 className="text-xl font-black text-black dark:text-white mb-4 uppercase tracking-tight flex items-center gap-2">
                <BookOpen size={24} /> Other Active Courses
              </h3>
              <div className="space-y-4">
                {inProgressCourses.slice(1, 4).map(course => (
                  <div
                    key={course.id}
                    onClick={() =>
                      onNavigate("topic", course.nextTopic?.id, course.id)
                    }
                    className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer group transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center font-black text-xs border-2 border-black dark:border-zinc-500">
                        {course.progress}%
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-black dark:text-white leading-none mb-1 group-hover:underline">
                          {course.title}
                        </h4>
                        <p className="text-xs text-gray-500 font-bold uppercase">
                          {course.categoryTitle}
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:block text-right">
                      <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
                        Next Topic
                      </span>
                      <span className="text-sm font-bold text-black dark:text-acid flex items-center gap-1 justify-end">
                        {course.nextTopic?.title} <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* --- SIDE COLUMN (Right 1/3) --- */}
        <div className="space-y-8">
          {/* 1. WEEKLY ACTIVITY */}
          <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 rounded-2xl p-6 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#555]">
            <h3 className="font-black text-lg text-black dark:text-white uppercase mb-4 flex items-center gap-2">
              <Activity size={20} /> Weekly Activity
            </h3>
            <div className="flex justify-between items-end h-32 gap-2">
              {last7Days.map((day, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                  <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-t-lg relative flex items-end overflow-hidden h-full">
                    <div
                      className={`w-full transition-all duration-500 ${day.isActive ? "bg-orange-500" : "bg-transparent"}`}
                      style={{
                        height: day.isActive
                          ? `${40 + Math.random() * 60}%`
                          : "0%",
                      }}></div>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase text-center w-full ${day.isActive ? "text-black dark:text-white" : "text-gray-300 dark:text-zinc-600"}`}>
                    {day.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* LEADERBOARD (Compact) */}
          <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 rounded-2xl p-6 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#555]">
            <h3 className="font-black text-lg text-black dark:text-white uppercase mb-4 flex items-center gap-2">
              <Trophy size={20} /> Top Learners
            </h3>
            <div className="space-y-3">
              {leaderboard.slice(0, 5).map((s, i) => (
                <div key={s._id} className="flex items-center gap-3">
                  <span
                    className={`font-black text-sm w-4 ${i === 0 ? "text-yellow-500" : "text-gray-400"}`}>
                    {i + 1}
                  </span>
                  <img
                    src={s.avatarUrl}
                    className="w-8 h-8 rounded-full border border-black bg-gray-200"
                    alt={s.name}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-bold truncate ${s._id === user._id ? "text-acid dark:text-acid" : "text-black dark:text-white"}`}>
                      {s.name} {s._id === user._id && "(You)"}
                    </p>
                  </div>
                  <span className="text-xs font-black bg-black text-white px-2 py-0.5 rounded">
                    {s.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PROMO CARD */}
          <div className="bg-acid rounded-2xl p-6 border-4 border-black shadow-[6px_6px_0px_0px_#000] text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <Star className="mx-auto mb-3 text-black fill-white" size={32} />
            <h3 className="font-black text-xl text-black uppercase mb-1">
              Go Pro
            </h3>
            <p className="text-xs font-bold text-black/70 mb-4 px-2">
              Unlock System Design, 1-on-1 Mentorship & Advanced Analytics.
            </p>
            <button className="w-full py-2 bg-black text-white font-black uppercase rounded-lg hover:scale-105 transition-transform">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
