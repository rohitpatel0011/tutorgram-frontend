/** @format */

import React, { useState, useEffect, useMemo } from "react";
// Integrating React Icons as requested
import {
  FaFire,
  FaBolt,
  FaTrophy,
  FaChartLine,
  FaArrowRight,
  FaCheckCircle,
  FaPlay,
  FaRegCalendarCheck,
  FaLayerGroup,
} from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { BookOpen, Star, Brain } from "lucide-react";
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
  onStartRandomQuiz?: () => void; // New prop
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

// Helper to get local date string YYYY-MM-DD
const getLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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

// --- CUSTOM RESPONSIVE SVG GRAPH ---
const WeeklyActivityGraph = ({ history }: { history: string[] }) => {
  const data = useMemo(() => {
    const points = [];
    const today = new Date();
    const historySet = new Set(history);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = getLocalDateString(d);
      const dayName = days[d.getDay()];

      // Simulation: 0 hours if inactive, 1-4 hours if active
      const isActive = historySet.has(dateStr);
      const value = isActive ? Math.max(1.5, Math.random() * 4) : 0.2;

      points.push({ label: dayName, value });
    }
    return points;
  }, [history]);

  // Graph Dimensions
  const width = 300;
  const height = 120;
  const padding = 20;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;
  const maxVal = 5; // Max 5 hours scale

  // Generate Path
  const pointsStr = data
    .map((p, i) => {
      const x = padding + i * (graphWidth / (data.length - 1));
      const y = height - padding - (p.value / maxVal) * graphHeight;
      return `${x},${y}`;
    })
    .join(" ");

  const fillPath = `M ${padding},${height - padding} L ${pointsStr} L ${width - padding},${height - padding} Z`;

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      <div className="relative w-full aspect-[2/1] sm:aspect-[5/2]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ABFA00" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ABFA00" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[1, 2, 3, 4].map(i => {
            const y = height - padding - (i / maxVal) * graphHeight;
            return (
              <line
                key={i}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="currentColor"
                className="text-gray-200 dark:text-zinc-700"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Area Fill */}
          <path d={fillPath} fill="url(#chartGradient)" />

          {/* Line Stroke */}
          <polyline
            points={pointsStr}
            fill="none"
            stroke="#ABFA00"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {data.map((p, i) => {
            const x = padding + i * (graphWidth / (data.length - 1));
            const y = height - padding - (p.value / maxVal) * graphHeight;
            return (
              <g key={i} className="group">
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  className="fill-black dark:fill-white stroke-2 stroke-acid transition-all duration-300 group-hover:r-6"
                />
                {/* Tooltip on Hover */}
                <rect
                  x={x - 15}
                  y={y - 25}
                  width="30"
                  height="20"
                  rx="4"
                  fill="black"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <text
                  x={x}
                  y={y - 11}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="bold"
                  className="opacity-0 group-hover:opacity-100 transition-opacity">
                  {Math.round(p.value)}h
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between px-2 mt-[-10px]">
        {data.map((p, i) => (
          <span
            key={i}
            className="text-[10px] font-bold text-gray-400 uppercase w-8 text-center">
            {p.label}
          </span>
        ))}
      </div>
    </div>
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
  onStartRandomQuiz,
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

  const actualPassedQuizzes = user.quizScores
    ? Object.values(user.quizScores).filter((score: number) => score >= 4)
        .length
    : 0;

  // Course Progress Logic
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

  // Set Hero Course with Randomization Logic
  useEffect(() => {
    if (inProgressCourses.length > 0) {
      const sorted = [...inProgressCourses].sort(
        (a, b) => b.progress - a.progress,
      );
      setHeroCourse(sorted[0]);
    } else {
      // If nothing is explicitly in progress, show a RANDOM available course to encourage exploration
      // Filter out courses that are 100% complete so we don't suggest finished ones as "Jump Back In"
      const incompleteCourses = allCourseProgress.filter(c => c.progress < 100);

      if (incompleteCourses.length > 0) {
        const randomCourse =
          incompleteCourses[
            Math.floor(Math.random() * incompleteCourses.length)
          ];
        setHeroCourse(randomCourse);
      } else if (allCourseProgress.length > 0) {
        // If EVERYTHING is finished, just show a random one for review
        const randomReview =
          allCourseProgress[
            Math.floor(Math.random() * allCourseProgress.length)
          ];
        setHeroCourse(randomReview);
      }
    }
  }, [allCourseProgress]);

  const coursesToShow = useMemo(() => {
    if (!heroCourse) return [];
    const others = allCourseProgress.filter(c => c.id !== heroCourse.id);

    // Randomize others slightly to keep dashboard fresh
    const shuffled = [...others].sort(() => 0.5 - Math.random());

    // Prioritize active ones first, then random
    shuffled.sort((a, b) => {
      if (a.isStarted && !b.isStarted) return -1;
      if (!a.isStarted && b.isStarted) return 1;
      return 0;
    });

    return shuffled.slice(0, 4);
  }, [allCourseProgress, heroCourse]);

  return (
    <div className="w-full max-w-[1600px] mx-auto py-6 px-4 md:px-8 pb-32">
      {/* --- HEADER SECTION --- */}
      <header className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black dark:text-white tracking-tighter flex items-center gap-3 mb-2 flex-wrap">
            <span className="text-4xl md:text-5xl animate-bounce">👋</span>
            WELCOME BACK,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-acid-dark to-acid">
              {user.name.split(" ")[0].toUpperCase()}
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-lg font-bold flex items-center gap-2 h-8">
            <span className="text-acid dark:text-acid">❯</span>{" "}
            <TypewriterText
              key={motivationalQuote}
              text={motivationalQuote}
              delay={500}
            />
          </p>
        </div>

        {/* Stats Strip with React Icons */}
        <div className="flex gap-4 overflow-x-auto pb-2 lg:pb-0 no-scrollbar w-full lg:w-auto">
          <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 rounded-xl px-5 py-3 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#555] flex flex-col justify-center min-w-[140px] flex-shrink-0">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-500 mb-1">
              <FaFire size={14} className="text-orange-500" /> Streak
            </div>
            <div className="text-2xl font-black text-black dark:text-white">
              {user.streak} Days
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 rounded-xl px-5 py-3 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#555] flex flex-col justify-center min-w-[140px] flex-shrink-0">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-500 mb-1">
              <FaBolt size={14} className="text-acid" /> XP
            </div>
            <div className="text-2xl font-black text-black dark:text-white">
              {user.xp}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 rounded-xl px-5 py-3 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#555] flex flex-col justify-center min-w-[140px] flex-shrink-0">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-500 mb-1">
              <FaTrophy size={14} className="text-yellow-500" /> Quizzes
            </div>
            <div className="text-2xl font-black text-black dark:text-white">
              {actualPassedQuizzes}
            </div>
          </div>
        </div>
      </header>

      {/* --- BENTO GRID LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* === LEFT MAIN CONTENT === */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* 1. HERO COURSE CARD */}
          {heroCourse && (
            <div
              onClick={() =>
                heroCourse.nextTopic
                  ? onNavigate("topic", heroCourse.nextTopic.id, heroCourse.id)
                  : onNavigate("chapter", undefined, heroCourse.id)
              }
              className="group relative bg-black dark:bg-zinc-900 rounded-2xl border-4 border-black dark:border-zinc-500 overflow-hidden cursor-pointer shadow-[6px_6px_0px_0px_#ABFA00] hover:shadow-[8px_8px_0px_0px_#ABFA00] hover:translate-y-[-2px] transition-all">
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}></div>

              <div className="relative z-10 p-5 md:p-6 flex flex-row items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-acid border border-black rounded text-[10px] font-black uppercase mb-2">
                    <FaPlay size={10} className="text-black" />
                    {heroCourse.isStarted ? "RESUME" : "START NEW"}
                  </div>
                  <h2 className="text-xl md:text-3xl font-black text-white mb-1 uppercase tracking-tighter leading-none truncate">
                    {heroCourse.title}
                  </h2>
                  <div className="text-gray-400 font-bold mb-4 flex items-center gap-1.5 text-xs md:text-sm">
                    <FaLayerGroup size={14} className="shrink-0" />
                    <span className="truncate">
                      {heroCourse.nextTopic
                        ? `Next: ${heroCourse.nextTopic.title}`
                        : "Start from Beginning"}
                    </span>
                  </div>
                  <button className="bg-white text-black text-xs md:text-sm font-black uppercase px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                    {heroCourse.isStarted ? "Continue" : "Begin"}{" "}
                    <FaArrowRight size={12} />
                  </button>
                </div>
                <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="42%"
                      className="text-gray-800"
                      strokeWidth="12%"
                      fill="transparent"
                      stroke="currentColor"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="42%"
                      className="text-acid"
                      strokeWidth="12%"
                      fill="transparent"
                      strokeDasharray={251}
                      strokeDashoffset={251 - (251 * heroCourse.progress) / 100}
                      strokeLinecap="round"
                      stroke="currentColor"
                    />
                  </svg>
                  <span className="absolute font-black text-sm md:text-base text-white">
                    {heroCourse.progress}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 2. DAILY TASKS GRID */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg md:text-xl font-black text-black dark:text-white uppercase tracking-tight flex items-center gap-2">
                <FaRegCalendarCheck
                  size={20}
                  className="text-black dark:text-white"
                />{" "}
                Daily Missions
              </h3>
              <span className="text-xs font-bold bg-gray-200 dark:bg-zinc-800 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
                {tasks.filter(t => t.completed).length}/{tasks.length} Done
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-600 p-4 rounded-xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#555] flex flex-col justify-between min-h-[140px] transition-all ${task.completed ? "opacity-60 grayscale" : "hover:-translate-y-1"}`}>
                  <div className="mb-2">
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
                      className={`font-bold text-sm leading-tight text-black dark:text-white line-clamp-2 ${task.completed ? "line-through" : ""}`}>
                      {task.title}
                    </h4>
                  </div>

                  <div className="flex justify-between items-end mt-auto pt-2">
                    <button
                      onClick={() => onTaskComplete(task.id)}
                      className={`w-8 h-8 rounded-lg border-2 border-black dark:border-zinc-500 flex items-center justify-center transition-all ${task.completed ? "bg-black text-white" : "bg-white hover:bg-gray-100"}`}>
                      {task.completed && (
                        <FaCheckCircle size={14} className="text-acid" />
                      )}
                    </button>

                    {!task.completed && (
                      <button
                        onClick={() => {
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
                        GO <FaArrowRight size={10} className="ml-1" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. COURSES LIST */}
          {coursesToShow.length > 0 && (
            <section>
              <h3 className="text-lg md:text-xl font-black text-black dark:text-white mb-4 uppercase tracking-tight flex items-center gap-2">
                <BookOpen size={20} />
                {inProgressCourses.length > 1
                  ? "Other Active Courses"
                  : "Explore Modules"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coursesToShow.map((course: any) => (
                  <div
                    key={course.id}
                    onClick={() =>
                      onNavigate("topic", course.nextTopic?.id, course.id)
                    }
                    className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer group transition-colors gap-3 overflow-hidden">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-xs border-2 border-black dark:border-zinc-500 shrink-0 ${course.isStarted ? "bg-black dark:bg-white text-white dark:text-black" : "bg-gray-200 dark:bg-zinc-800 text-gray-500"}`}>
                        {course.progress}%
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm md:text-base text-black dark:text-white leading-tight mb-0.5 group-hover:underline truncate">
                          {course.title}
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase truncate">
                          {course.categoryTitle}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                        {course.isStarted ? "Next" : "Start"}
                      </span>
                      <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-acid hover:text-black flex items-center justify-center transition-colors">
                        <FaArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* === RIGHT SIDEBAR === */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* 1. BRAIN WORKOUT CARD (NEW) */}
          <div
            onClick={onStartRandomQuiz}
            className="cursor-pointer group relative bg-black dark:bg-white rounded-2xl border-4 border-black dark:border-zinc-700 p-6 shadow-[6px_6px_0px_0px_#ABFA00] hover:shadow-[8px_8px_0px_0px_#ABFA00] transition-all hover:translate-y-[-2px] overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Brain
                size={80}
                className="text-white dark:text-black transform rotate-12"
              />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-acid rounded-lg border-2 border-black mb-4">
                <FaBolt className="text-black" />
                <span className="text-xs font-black text-black uppercase">
                  Quick Practice
                </span>
              </div>

              <h3 className="text-2xl font-black text-white dark:text-black uppercase leading-none mb-2">
                Brain Workout
              </h3>
              <p className="text-gray-400 dark:text-gray-600 font-bold text-sm mb-6 max-w-[80%]">
                Test your knowledge with a random 10-question challenge from any
                module.
              </p>

              <button className="w-full py-3 bg-white dark:bg-black text-black dark:text-white font-black uppercase rounded-lg group-hover:bg-gray-100 dark:group-hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
                Start Quiz <FaArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* 2. NEW COMPACT WEEKLY GRAPH */}
          <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 rounded-2xl p-5 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#555]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-gray-100 dark:border-zinc-800">
              <h3 className="font-black text-sm md:text-base text-black dark:text-white uppercase flex items-center gap-2">
                <GoGraph size={16} className="text-black dark:text-white" />{" "}
                Weekly Activity
              </h3>
              <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-900">
                <FaChartLine size={10} /> +12%
              </div>
            </div>

            {/* Custom SVG Component */}
            <WeeklyActivityGraph history={user.activityHistory || []} />
          </div>

          {/* 3. LEADERBOARD */}
          <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 rounded-2xl p-6 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#555] flex-1">
            <h3 className="font-black text-lg text-black dark:text-white uppercase mb-4 flex items-center gap-2">
              <FaTrophy size={16} className="text-yellow-500" /> Top Learners
            </h3>
            <div className="space-y-3 overflow-y-auto max-h-[300px] lg:max-h-none pr-1 custom-scrollbar">
              {leaderboard.slice(0, 10).map((s, i) => (
                <div
                  key={s._id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <span
                    className={`font-black text-sm w-5 text-center ${i === 0 ? "text-yellow-500" : "text-gray-400"}`}>
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
                  <span className="text-xs font-black bg-black text-white px-2 py-0.5 rounded shrink-0">
                    {s.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. PROMO CARD */}
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
