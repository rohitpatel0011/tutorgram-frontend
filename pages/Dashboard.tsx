import React from 'react';
import { Award, Flame, Zap, CheckSquare, ArrowRight, BookOpen, Trophy, Play, CheckCircle, Clock, Activity, Star, Sparkles, TrendingUp, ChevronRight, Layers, Hand, BadgeCheck } from 'lucide-react';
import { Task, UserProfile } from '../types';
import { CONTENT_DATA } from '../constants';

interface DashboardProps {
  tasks: Task[];
  user: UserProfile;
  completedTopics: string[];
  passedQuizzesCount: number;
  leaderboard: UserProfile[];
  onTaskComplete: (id: string) => void;
  onNavigate: (view: string, topicId?: string, chapterId?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  tasks, user, completedTopics, passedQuizzesCount, leaderboard, onTaskComplete, onNavigate
}) => {

  const allCourseProgress = React.useMemo(() => {
     const courses: any[] = [];
     CONTENT_DATA.forEach(cat => {
         cat.chapters.forEach(chap => {
             const totalTopics = chap.topics.length;
             if (totalTopics === 0) return;
             const completedInChap = chap.topics.filter(t => completedTopics.includes(t.id)).length;
             const nextTopic = chap.topics.find(t => !completedTopics.includes(t.id));
             courses.push({
                 id: chap.id,
                 title: chap.title,
                 progress: Math.round((completedInChap / totalTopics) * 100),
                 categoryTitle: cat.title,
                 nextTopic: nextTopic,
                 totalTopics,
                 completedInChap,
                 isStarted: completedInChap > 0
             });
         });
     });
     return courses;
  }, [completedTopics]);

  const inProgressCourses = allCourseProgress.filter(c => c.isStarted && c.progress < 100);
  const recommendedCourse = allCourseProgress.find(c => !c.isStarted) || allCourseProgress[0];
  const heroCourse = inProgressCourses.length > 0 ? inProgressCourses[0] : recommendedCourse;

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 lg:px-8 pb-32">
      {/* Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_#000]">
          <h1 className="text-4xl font-black text-black tracking-tighter flex items-center gap-3">
            HEY,{user.name.split(" ")[0].toUpperCase()}
                      <BadgeCheck size={36} />
          </h1>
          <p className="text-gray-600 mt-2 text-lg font-bold">
            READY TO CRUSH SOME CODE?
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-6 py-3 bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000] rounded-xl transform hover:-translate-y-1 transition-transform">
            <Flame size={24} className="fill-orange-500 text-black" />
            <div>
              <div className="text-[10px] uppercase font-black text-gray-400">
                Streak
              </div>
              <div className="font-black text-xl text-black leading-none">
                {user.streak}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-black border-4 border-black shadow-[4px_4px_0px_0px_#ABFA00] rounded-xl transform hover:-translate-y-1 transition-transform">
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
        <div className="lg:col-span-8 space-y-12">
          {/* HERO CARD */}
          <div
            className="relative rounded-2xl bg-black border-4 border-black overflow-hidden group cursor-pointer shadow-[8px_8px_0px_0px_#ABFA00] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_#ABFA00] transition-all"
            onClick={() =>
              heroCourse.nextTopic
                ? onNavigate("topic", heroCourse.nextTopic.id, heroCourse.id)
                : onNavigate("chapter", undefined, heroCourse.id)
            }>
            <div className="relative z-10 p-8 md:p-10">
              <div className="flex justify-between items-start mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-acid border-2 border-black font-black text-xs uppercase tracking-wider text-black rounded-md">
                  <Sparkles size={12} />{" "}
                  {heroCourse.isStarted ? "IN PROGRESS" : "NEW MODULE"}
                </div>

                <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0 bg-white rounded-full border-4 border-black">
                  <span className="font-black text-sm text-black">
                    {heroCourse.progress}%
                  </span>
                </div>
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-none tracking-tighter uppercase">
                {heroCourse.title}
              </h2>

              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div>
                  <div className="text-gray-500 text-xs font-black uppercase mb-1">
                    UP NEXT
                  </div>
                  <div className="text-acid font-bold text-lg flex items-center gap-2">
                    <Layers size={18} />
                    {heroCourse.nextTopic
                      ? heroCourse.nextTopic.title
                      : "Introduction"}
                  </div>
                </div>
              </div>

              <button className="neo-btn w-full md:w-auto">
                {heroCourse.isStarted ? "RESUME SESSION" : "START MODULE"}{" "}
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* YOUR LEARNING */}
          {inProgressCourses.length > 0 && (
            <section>
              <h3 className="text-2xl font-black text-black mb-6 flex items-center gap-3 uppercase tracking-tight bg-white inline-block px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                <BookOpen size={24} /> Your Learning
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inProgressCourses.slice(0, 4).map(course => (
                  <div
                    key={course.id}
                    className="bg-white border-4 border-black p-6 rounded-xl shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000] transition-all cursor-pointer flex flex-col justify-between h-full relative overflow-hidden"
                    onClick={() =>
                      onNavigate("topic", course.nextTopic?.id, course.id)
                    }>
                    <div className="absolute top-0 right-0 p-2">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-acid">
                        <Play size={14} className="ml-1 fill-current" />
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2 block">
                        {course.categoryTitle}
                      </span>
                      <h4 className="font-black text-xl text-black mb-2 leading-tight uppercase">
                        {course.title}
                      </h4>
                      <p className="text-sm font-bold text-gray-600 mb-6 border-l-4 border-acid pl-3">
                        Next: {course.nextTopic?.title}
                      </p>
                    </div>

                    <div>
                      <div className="w-full bg-gray-200 h-4 rounded-full border-2 border-black overflow-hidden">
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
            <h3 className="text-2xl font-black text-black mb-6 flex items-center gap-3 uppercase tracking-tight bg-white inline-block px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
              <CheckSquare size={24} /> Daily Tasks
            </h3>

            <div className="space-y-4">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`bg-white p-5 flex items-center justify-between border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] transition-all ${task.completed ? "opacity-60 grayscale" : "hover:translate-x-[-2px] hover:translate-y-[-2px]"}`}>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onTaskComplete(task.id)}
                      className={`w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center transition-all ${task.completed ? "bg-black" : "bg-white hover:bg-gray-100"}`}>
                      {task.completed && (
                        <CheckCircle size={20} className="text-acid" />
                      )}
                    </button>
                    <div>
                      <h4
                        className={`font-bold text-lg text-black ${task.completed ? "line-through" : ""}`}>
                        {task.title}
                      </h4>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-black inline-block mt-1 ${
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
                        // Navigation logic is now handled more robustly in App.tsx but we still trigger a generic handler here
                        // The onClick below assumes parent passed a smart onNavigate wrapper or we just bubble up the ID
                        // For simplicity, we just bubble the ID handling to App.tsx via onNavigate isn't enough because we need custom logic.
                        // Wait, the Dashboard parent prop `onNavigate` is generic.
                        // We will move the "Find correct location" logic to App.tsx and just pass special params here?
                        // Actually, let's trigger a specialized function passed from App.tsx or use a special view type.
                        // To keep it simple, we will call onNavigate with special flags that App.tsx intercepts.

                        // Actually, the easiest way is to let App.tsx handle the task logic.
                        // But here we are inside Dashboard.
                        // Let's rely on the App.tsx modification to `handleNavigate` or pass a specific `onOpenTask` prop.
                        // Since we only have `onNavigate` in props, we will assume App.tsx wraps this logic if we pass a special view or just use the targetId directly if we can find it.

                        // Updated Plan: Dashboard doesn't need to know the mapping.
                        // We will modify App.tsx to handle the lookup.
                        // HERE, we just call a new prop `onTaskClick`? No, let's use onNavigate with the Task ID logic.
                        // Actually, I'll update App.tsx to pass a specific `handleTaskClick` to Dashboard.
                        // But wait, I can't change the Props interface easily without changing App.tsx too.
                        // I will stick to using `onNavigate` but I will handle the lookups inside App.tsx `handleNavigate` if I passed a special flag?
                        // No, simpler: I'll just look up the IDs here using CONTENT_DATA since I have it imported.

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
                          // Quiz targets a chapter usually
                          if (chapterId)
                            onNavigate("chapter", undefined, chapterId);
                        } else {
                          // Read/Regenerate targets a topic
                          if (topicId && chapterId)
                            onNavigate("topic", topicId, chapterId);
                        }
                      }}
                      className="p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                      <ArrowRight size={20} />
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
          <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_#000]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-black">
              <h3 className="font-black text-xl text-black flex items-center gap-2 uppercase">
                <Trophy size={20} className="text-black" /> Top Scholars
              </h3>
            </div>

            <div className="space-y-4">
              {leaderboard.map((s, i) => (
                <div
                  key={s._id}
                  className={`flex items-center p-3 rounded-xl border-2 border-black transition-all gap-3 ${s._id === user._id ? "bg-acid" : "bg-white"}`}>
                  <div className="w-8 font-black text-xl text-black text-center flex-shrink-0">
                    #{i + 1}
                  </div>
                  <img
                    src={s.avatarUrl}
                    className="w-10 h-10 rounded-lg bg-white border-2 border-black object-cover flex-shrink-0"
                    alt={s.name}
                  />

                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p
                      className="text-sm font-bold text-black truncate w-full"
                      title={s.name}>
                      {s.name} {s._id === user._id && "(You)"}
                    </p>
                    <p className="text-xs font-bold text-gray-600 truncate w-full">
                      {s.streak} Day Streak
                    </p>
                  </div>

                  <div className="text-xs font-black bg-black text-white px-2 py-1 rounded flex-shrink-0 whitespace-nowrap">
                    {s.xp} XP
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_#000] text-center">
              <div className="text-4xl font-black text-black mb-1">
                {passedQuizzesCount}
              </div>
              <div className="text-xs font-black uppercase text-gray-500 tracking-wider">
                Quizzes Aced
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_#000] text-center">
              <div className="text-4xl font-black text-black mb-1">
                {user.totalLearningDays}h
              </div>
              <div className="text-xs font-black uppercase text-gray-500 tracking-wider">
                Focus Time
              </div>
            </div>
          </div>

          {/* PROMO */}
          <div className="bg-black text-white rounded-2xl p-6 border-4 border-black shadow-[8px_8px_0px_0px_#ABFA00] text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white border-4 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-black fill-black" size={32} />
              </div>
              <h3 className="font-black text-2xl mb-2 uppercase italic">
                GO PRO
              </h3>
              <p className="text-gray-300 text-sm mb-6 font-bold">
                Unlock System Design & 1-on-1 Mentorship.
              </p>
              <button className="w-full py-3 bg-acid text-black font-black border-2 border-black rounded-xl hover:bg-white transition-colors uppercase tracking-wider">
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