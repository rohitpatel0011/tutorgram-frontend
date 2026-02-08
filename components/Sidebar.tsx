/** @format */

import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  GraduationCap,
  Layout,
  Globe,
  Code,
  Layers,
  LogOut,
  Sun,
  Moon,
  Flame,
  Server,
  Cpu,
  Cloud,
  Brain,
  Terminal,
  Code2,
  Coffee,
  BookOpen,
  Calculator,
  Network,
  Database,
  PanelLeftClose,
  CheckCircle2,
  Trophy,
} from "lucide-react";
import { UserProfile, Category, Chapter, Topic } from "../types";
import { CONTENT_DATA } from "../constants";

interface SidebarProps {
  isOpen: boolean;
  activeTopicId: string | null;
  activeChapterId?: string | null;
  activeView: string;
  user: UserProfile;
  theme: "light" | "dark";
  onNavigate: (view: string, topicId?: string, chapterId?: string) => void;
  onToggle: () => void;
  onLogout: () => void;
  onThemeToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  activeTopicId,
  activeChapterId,
  activeView,
  user,
  theme,
  onNavigate,
  onLogout,
  onThemeToggle,
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Group content
  const groupedContent = React.useMemo(() => {
    const groups: Record<string, Category[]> = {};
    CONTENT_DATA.forEach(cat => {
      if (!groups[cat.group]) groups[cat.group] = [];
      groups[cat.group].push(cat);
    });
    return groups;
  }, []);

  const activeCategoryId = React.useMemo(() => {
    // If on dashboard, do not highlight any curriculum category
    if (activeView === "dashboard") return null;

    // 1. Try finding by Active Topic
    if (activeTopicId) {
      for (const cat of CONTENT_DATA) {
        for (const chap of cat.chapters) {
          if (chap.topics.some(t => t.id === activeTopicId)) {
            return cat.id;
          }
        }
      }
    }

    // 2. Try finding by Active Chapter (Fix for Chapter View)
    if (activeChapterId) {
      for (const cat of CONTENT_DATA) {
        if (cat.chapters.some(c => c.id === activeChapterId)) {
          return cat.id;
        }
      }
    }

    return null;
  }, [activeTopicId, activeChapterId, activeView]);

  useEffect(() => {
    if (activeTopicId) {
      let foundChapterId = "";
      let foundCategoryId = "";
      for (const cat of CONTENT_DATA) {
        for (const chap of cat.chapters) {
          if (chap.topics.some(t => t.id === activeTopicId)) {
            foundChapterId = chap.id;
            foundCategoryId = cat.id;
            break;
          }
        }
        if (foundChapterId && foundCategoryId) {
          setExpandedCategory(foundCategoryId);
          setExpandedChapters(prev =>
            prev.includes(foundChapterId) ? prev : [...prev, foundChapterId],
          );
        }
      }
    } else if (activeChapterId && activeView === "chapter") {
      // Expand chapter if navigating to chapter view
      setExpandedChapters(prev =>
        prev.includes(activeChapterId) ? prev : [...prev, activeChapterId],
      );

      // Expand Category too
      let foundCategoryId = "";
      for (const cat of CONTENT_DATA) {
        if (cat.chapters.some(c => c.id === activeChapterId)) {
          foundCategoryId = cat.id;
          break;
        }
      }
      if (foundCategoryId) setExpandedCategory(foundCategoryId);
    }
  }, [activeTopicId, activeChapterId, activeView]);

  const toggleCategory = (id: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setExpandedCategory(id);
      return;
    }
    setExpandedCategory(prev => (prev === id ? null : id));
  };

  // Updated Handler: Navigates to Chapter View AND Expands
  const handleChapterClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Navigate to Chapter View (Module Overview)
    onNavigate("chapter", undefined, id);

    // Ensure it is expanded so user sees topics
    setExpandedChapters(prev => {
      if (!prev.includes(id)) return [...prev, id];
      return prev;
    });
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case "frontend-foundations":
        return <Globe size={20} />;
      case "react-ecosystem":
        return <Code size={20} />;
      case "nodejs-complete":
        return <Server size={20} />;
      case "c-programming":
        return <Terminal size={20} />;
      case "cpp-programming":
        return <Code2 size={20} />;
      case "java-programming":
        return <Coffee size={20} />;
      case "cs-core-subjects":
        return <BookOpen size={20} />;
      case "cs-dsa":
        return <Network size={20} />;
      case "mysql-database":
        return <Database size={20} />;
      case "system-design":
        return <Layers size={20} />;
      case "python-mastery":
        return <Code size={20} />;
      case "eng-hardware":
        return <Cpu size={20} />;
      case "cs-math":
        return <Calculator size={20} />;
      case "cloud-computing":
        return <Cloud size={20} />;
      case "ai-ml":
        return <Brain size={20} />;
      default:
        return <Layers size={20} />;
    }
  };

  const widthClass = isCollapsed ? "md:w-20" : "md:w-80";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 ${isOpen ? "translate-x-0 w-80" : "-translate-x-full"} ${widthClass} bg-white dark:bg-black border-r-4 border-black dark:border-zinc-800 transform transition-all duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col`}>
      {/* Collapse Button - ONLY visible on Large screens (lg:flex), hidden on mobile/tablet */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-4 top-8 bg-white dark:bg-black border-2 border-black dark:border-white w-8 h-8 items-center justify-center rounded-full z-50 hover:bg-acid shadow-[2px_2px_0px_0px_#000]">
        {isCollapsed ? (
          <ChevronRight size={16} className="text-black dark:text-white" />
        ) : (
          <PanelLeftClose size={16} className="text-black dark:text-white" />
        )}
      </button>

      {/* Branding Header - Clickable */}
      <div
        onClick={() => onNavigate("dashboard")}
        className={`h-24 flex items-center ${isCollapsed ? "justify-center px-0" : "px-6"} border-b-4 border-black dark:border-zinc-800 flex-shrink-0 bg-white dark:bg-black transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900 group`}>
        <div className="w-12 h-12 bg-acid border-2 border-black rounded-lg flex items-center justify-center shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] shrink-0 group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
          <GraduationCap className="text-black" size={24} />
        </div>
        <div
          className={`${isCollapsed ? "hidden" : "block"} ml-4 overflow-hidden whitespace-nowrap`}>
          <span className="font-black text-2xl tracking-tighter text-black dark:text-white block leading-none">
            TUTORGRAM
          </span>
          <span className="text-[10px] bg-black dark:bg-white text-white dark:text-black px-1 py-0.5 font-bold tracking-wider inline-block mt-1">
            AI TUTORIAL
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 space-y-1 custom-scrollbar bg-white dark:bg-black px-3">
        <button
          onClick={() => onNavigate("dashboard")}
          className={`w-full flex items-center ${isCollapsed ? "justify-center px-0 py-4" : "px-4 py-4"} text-sm font-bold rounded-xl border-2 transition-all mb-8 group relative
            ${
              activeView === "dashboard"
                ? "bg-acid text-black border-black shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] translate-x-[-2px] translate-y-[-2px]"
                : "bg-white dark:bg-black text-gray-600 dark:text-gray-400 border-transparent hover:border-black dark:hover:border-white hover:bg-gray-50 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white"
            }`}>
          <Layout size={24} className={`${isCollapsed ? "" : "mr-3"}`} />
          {!isCollapsed && <span>DASHBOARD</span>}

          {isCollapsed && (
            <span className="absolute left-16 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              Dashboard
            </span>
          )}
        </button>

        <div
          className={`px-2 pb-4 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {isCollapsed ? (
            <div className="h-0.5 w-full bg-gray-200 dark:bg-zinc-800"></div>
          ) : (
            <span className="text-xs font-black text-black dark:text-zinc-500 uppercase tracking-widest border-b-2 border-acid inline-block whitespace-nowrap">
              My Curriculum
            </span>
          )}
        </div>

        <div className="space-y-6">
          {Object.entries(groupedContent).map(([groupName, categories]) => (
            <div key={groupName}>
              {!isCollapsed && (
                <h3 className="px-2 mb-3 text-[10px] font-black uppercase text-gray-400 dark:text-zinc-600 tracking-wider flex items-center gap-2 truncate">
                  {groupName}
                </h3>
              )}

              <div className="space-y-3">
                {categories.map((category: Category) => {
                  const isCatExpanded = expandedCategory === category.id;
                  const isActiveInCollapsed =
                    isCollapsed && activeCategoryId === category.id;

                  return (
                    <div
                      key={category.id}
                      className={`rounded-xl overflow-hidden ${isCollapsed ? "flex justify-center" : ""}`}>
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className={`flex items-center text-left transition-colors cursor-pointer rounded-lg relative group
                                            ${
                                              isCollapsed
                                                ? `p-3 justify-center ${isActiveInCollapsed ? "bg-black dark:bg-white text-acid dark:text-black border-2 border-acid" : "hover:bg-gray-100 dark:hover:bg-zinc-900"}`
                                                : `w-full justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-900 ${isCatExpanded ? "font-bold text-black dark:text-white" : "text-gray-600 dark:text-zinc-400"}`
                                            }
                                        `}>
                        <div className="flex items-center">
                          <span
                            className={`opacity-100 ${isCollapsed ? "" : "mr-3 p-1.5 bg-black dark:bg-white text-acid dark:text-black rounded-md border border-black dark:border-transparent"}`}>
                            {getCategoryIcon(category.id)}
                          </span>
                          {!isCollapsed && (
                            <span className="text-sm font-bold tracking-tight">
                              {category.title}
                            </span>
                          )}
                        </div>
                        {!isCollapsed &&
                          (isCatExpanded ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          ))}

                        {isCollapsed && (
                          <span className="absolute left-14 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                            {category.title}
                          </span>
                        )}

                        {isActiveInCollapsed && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-acid rounded-full border border-black animate-pulse"></span>
                        )}
                      </button>

                      {!isCollapsed && (
                        <div
                          className={`transition-all duration-300 ease-in-out overflow-hidden ${isCatExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"}`}>
                          <div className="px-3 pb-2 pt-2 space-y-3 pl-4 border-l-2 border-gray-100 dark:border-zinc-800 ml-4 my-2">
                            {category.chapters.map((chapter: Chapter) => {
                              const isChapExpanded = expandedChapters.includes(
                                chapter.id,
                              );

                              const isActiveChapter =
                                (activeChapterId &&
                                  chapter.id === activeChapterId) ||
                                chapter.topics.some(
                                  t => t.id === activeTopicId,
                                );

                              const headerBaseClass =
                                "w-full flex items-center justify-between px-3 py-3 text-xs font-bold transition-colors group cursor-pointer border-b-2 border-transparent";

                              const headerColorClass = isActiveChapter
                                ? "bg-acid text-black border-black"
                                : "bg-white dark:bg-zinc-900 text-black dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800";

                              return (
                                <div
                                  key={chapter.id}
                                  className="bg-white dark:bg-zinc-900 rounded-lg border-2 border-black dark:border-zinc-700 overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-none">
                                  {/* Updated Chapter Header: WHOLE BOX CLICKABLE -> NAVIGATE & EXPAND */}
                                  <div
                                    onClick={e =>
                                      handleChapterClick(chapter.id, e)
                                    }
                                    className={`${headerBaseClass} ${headerColorClass}`}>
                                    <div className="flex items-center truncate flex-1">
                                      <div
                                        className={`w-2 h-2 rounded-full mr-2 flex-shrink-0 border border-black dark:border-zinc-500 ${isChapExpanded ? "bg-black dark:bg-white" : "bg-gray-300 dark:bg-zinc-600"}`}></div>
                                      <span className="truncate uppercase tracking-wide">
                                        {chapter.title}
                                      </span>
                                    </div>

                                    <div className="p-1">
                                      {isChapExpanded ? (
                                        <ChevronDown size={12} />
                                      ) : (
                                        <ChevronRight size={12} />
                                      )}
                                    </div>
                                  </div>

                                  <div
                                    className={`transition-all duration-300 ease-in-out overflow-hidden bg-gray-50 dark:bg-black border-t-2 border-black dark:border-zinc-700 ${isChapExpanded ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"}`}>
                                    <div className="p-2 space-y-1">
                                      {chapter.topics.map((topic: Topic) => {
                                        const score =
                                          user.quizScores?.[topic.id] || 0;
                                        const isMastered = score >= 5;
                                        const isActiveTopic =
                                          activeTopicId === topic.id;

                                        return (
                                          <button
                                            key={topic.id}
                                            onClick={e => {
                                              e.stopPropagation();
                                              onNavigate(
                                                "topic",
                                                topic.id,
                                                chapter.id,
                                              );
                                            }}
                                            className={`w-full text-left px-3 py-2 text-[11px] font-semibold rounded-md transition-all flex items-center justify-between group
                                                                        ${
                                                                          isActiveTopic
                                                                            ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                                                                            : "text-gray-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:border-black dark:hover:border-zinc-500 hover:text-black dark:hover:text-white border border-transparent"
                                                                        }`}>
                                            <span className="truncate pr-2">
                                              {topic.title}
                                            </span>

                                            {isMastered && (
                                              <div
                                                className={`flex-shrink-0 ${isActiveTopic ? "text-acid" : "text-green-600 dark:text-green-400"}`}>
                                                <Trophy
                                                  size={12}
                                                  fill="currentColor"
                                                />
                                              </div>
                                            )}
                                          </button>
                                        );
                                      })}
                                      <button
                                        onClick={e => {
                                          e.stopPropagation();
                                          onNavigate(
                                            "module-quiz",
                                            undefined,
                                            chapter.id,
                                          );
                                        }}
                                        className="w-full text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-black dark:text-zinc-400 hover:bg-acid hover:text-black dark:hover:text-black rounded-md flex items-center mt-2 cursor-pointer border-t border-dashed border-gray-300 dark:border-zinc-800 pt-2">
                                        <GraduationCap
                                          size={12}
                                          className="mr-1.5"
                                        />{" "}
                                        Final Module Exam
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`border-t-4 border-black dark:border-zinc-800 bg-white dark:bg-black transition-all ${isCollapsed ? "p-2" : "p-4"}`}>
        <div
          className={`flex items-center ${isCollapsed ? "justify-center mb-2" : "justify-between mb-4 px-2"}`}>
          {!isCollapsed && (
            <span className="text-[10px] font-black uppercase tracking-widest text-black dark:text-zinc-500">
              Interface
            </span>
          )}
          <button
            onClick={onThemeToggle}
            className="p-1.5 rounded-lg border-2 border-black dark:border-zinc-600 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            title="Toggle Theme">
            {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        </div>

        <div
          className={`flex items-center rounded-xl border-2 border-black dark:border-zinc-700 bg-acid shadow-[3px_3px_0px_0px_#000] dark:shadow-none ${isCollapsed ? "p-1.5 justify-center" : "p-3"}`}>
          <img
            src={user.avatarUrl}
            alt={user.name}
            className={`rounded-lg border-2 border-black bg-white object-cover ${isCollapsed ? "w-8 h-8 mr-0" : "w-10 h-10 mr-3"}`}
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-black truncate">
                {user.name}
              </p>
              <div className="flex items-center text-[10px] text-black font-bold">
                <Flame size={10} className="mr-1 fill-current" /> {user.streak}{" "}
                Day Streak
              </div>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={onLogout}
              className="text-black hover:text-red-600 transition-colors p-2"
              title="Logout">
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
