/** @format */

import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  Layout,
  LogOut,
  Sun,
  Moon,
  Flame,
  PanelLeftClose,
  CheckCircle2,
  Trophy,
} from "lucide-react";
// Import Brand Icons
import {
  SiC,
  SiCplusplus,
  SiPython,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiMysql,
  SiOpenai,
} from "react-icons/si";
import {
  FaJava,
  FaMicrochip,
  FaServer,
  FaProjectDiagram,
  FaCalculator,
  FaLaptopCode,
  FaAws,
  FaSlackHash,
} from "react-icons/fa";

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

  // Auto-expand logic based on active content
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
    } else if (activeChapterId) {
      setExpandedChapters(prev =>
        prev.includes(activeChapterId) ? prev : [...prev, activeChapterId],
      );
      let foundCategoryId = "";
      for (const cat of CONTENT_DATA) {
        if (cat.chapters.some(c => c.id === activeChapterId)) {
          foundCategoryId = cat.id;
          break;
        }
      }
      if (foundCategoryId) setExpandedCategory(foundCategoryId);
    }
  }, [activeTopicId, activeChapterId]);

  const toggleCategory = (id: string) => {
    if (isCollapsed) {
      const category = CONTENT_DATA.find(c => c.id === id);
      if (category && category.chapters.length > 0) {
        // In collapsed mode, clicking icon goes to first chapter
        onNavigate("chapter", undefined, category.chapters[0].id);
      }
    } else {
      setExpandedCategory(prev => (prev === id ? null : id));
    }
  };

  const toggleChapterExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedChapters(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id],
    );
  };

  const handleChapterNameClick = (id: string) => {
    // 1. Navigate to Chapter View
    onNavigate("chapter", undefined, id);
    // 2. Ensure it's expanded
    setExpandedChapters(prev => (prev.includes(id) ? prev : [...prev, id]));
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case "c-programming":
        return <SiC size={18} />;
      case "cpp-programming":
        return <SiCplusplus size={18} />;
      case "java-programming":
        return <FaJava size={20} />;
      case "python-mastery":
        return <SiPython size={18} />;

      case "frontend-foundations":
        return <SiJavascript size={18} />;
      case "react-ecosystem":
        return <SiReact size={18} />;
      case "nodejs-complete":
        return <SiNodedotjs size={18} />;

      case "mysql-database":
        return <SiMysql size={20} />;

      case "cs-core-subjects":
        return <FaLaptopCode size={18} />;
      case "cs-dsa":
        return <FaProjectDiagram size={18} />;
      case "system-design":
        return <FaServer size={18} />;
      case "cs-math":
        return <FaCalculator size={18} />;

      case "cloud-computing":
        return <FaAws size={20} />;
      case "ai-ml":
        return <SiOpenai size={18} />;
      case "eng-hardware":
        return <FaMicrochip size={18} />;

      default:
        return <FaLaptopCode size={18} />;
    }
  };

  const widthClass = isCollapsed ? "md:w-20" : "md:w-80";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 ${isOpen ? "translate-x-0 w-80" : "-translate-x-full"} ${widthClass} bg-white dark:bg-black border-r-4 border-black dark:border-zinc-800 transform transition-all duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col`}>
      {/* Collapse Button - VISIBLE ON TABLET (MD) AND UP */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden md:flex absolute -right-4 top-8 bg-white dark:bg-black border-2 border-black dark:border-white w-8 h-8 items-center justify-center rounded-full z-50 hover:bg-acid shadow-[2px_2px_0px_0px_#000]">
        {isCollapsed ? (
          <ChevronRight size={16} className="text-black dark:text-white" />
        ) : (
          <PanelLeftClose size={16} className="text-black dark:text-white" />
        )}
      </button>

      {/* Brand Header */}
      <div
        onClick={() => onNavigate("dashboard")}
        className={`h-24 flex items-center ${isCollapsed ? "justify-center px-0" : "px-6"} border-b-4 border-black dark:border-zinc-800 flex-shrink-0 bg-white dark:bg-black transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900 group`}>
        <div className="w-12 h-12 bg-acid border-2 border-black rounded-lg flex items-center justify-center shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] shrink-0 group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
          <FaSlackHash className="text-black" size={24} />
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

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto py-6 space-y-1 custom-scrollbar bg-white dark:bg-black px-3">
        {/* Dashboard Link */}
        <button
          onClick={() => onNavigate("dashboard")}
          className={`w-full flex items-center ${isCollapsed ? "justify-center px-0 py-4" : "px-4 py-3"} text-sm font-bold rounded-xl border-2 transition-all mb-8 group relative
            ${
              activeView === "dashboard"
                ? "bg-acid text-black border-black shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] translate-x-[-2px] translate-y-[-2px]"
                : "bg-white dark:bg-black text-gray-600 dark:text-gray-400 border-transparent hover:border-black dark:hover:border-white hover:bg-gray-50 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white"
            }`}>
          <Layout size={24} className={`${isCollapsed ? "" : "mr-3"}`} />
          {!isCollapsed && <span>DASHBOARD</span>}
        </button>

        {/* Divider */}
        <div
          className={`px-2 pb-4 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {isCollapsed ? (
            <div className="h-0.5 w-full bg-gray-200 dark:bg-zinc-800"></div>
          ) : (
            <span className="text-xs font-black text-black dark:text-zinc-500 uppercase tracking-widest border-b-2 border-acid inline-block whitespace-nowrap">
              Curriculum
            </span>
          )}
        </div>

        {/* Tree Structure */}
        <div className="space-y-6">
          {Object.entries(groupedContent).map(([groupName, categories]) => (
            <div key={groupName}>
              {!isCollapsed && (
                <h3 className="px-2 mb-2 text-[10px] font-black uppercase text-gray-400 dark:text-zinc-600 tracking-wider flex items-center gap-2 truncate pl-2">
                  {groupName}
                </h3>
              )}

              <div className="space-y-1">
                {categories.map((category: Category) => {
                  const isCatExpanded = expandedCategory === category.id;
                  const isActiveInCollapsed =
                    isCollapsed &&
                    activeChapterId &&
                    category.chapters.some(c => c.id === activeChapterId);
                  const isActiveCategory =
                    activeChapterId &&
                    category.chapters.some(c => c.id === activeChapterId);

                  return (
                    <div
                      key={category.id}
                      className={`${isCollapsed ? "flex justify-center mb-2" : "mb-1"}`}>
                      {/* Category Header */}
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className={`flex items-center text-left transition-colors cursor-pointer relative group rounded-lg
                                            ${
                                              isCollapsed
                                                ? `p-3 justify-center ${isActiveInCollapsed ? "bg-black dark:bg-white text-acid dark:text-black border-2 border-acid" : "hover:bg-gray-100 dark:hover:bg-zinc-900 border-2 border-transparent"}`
                                                : `w-full justify-between px-2 py-2 ${isActiveCategory ? "text-black dark:text-white font-black" : "text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white"}`
                                            }
                                        `}>
                        <div className="flex items-center">
                          <span
                            className={`flex-shrink-0 transition-all ${isCollapsed ? "" : "mr-3"}`}>
                            {getCategoryIcon(category.id)}
                          </span>
                          {!isCollapsed && (
                            <span className="text-sm tracking-tight">
                              {category.title}
                            </span>
                          )}
                        </div>

                        {!isCollapsed && (
                          <div className="flex items-center">
                            {isCatExpanded ? (
                              <ChevronDown size={14} />
                            ) : (
                              <ChevronRight size={14} />
                            )}
                          </div>
                        )}
                      </button>

                      {/* Chapters Tree */}
                      {!isCollapsed && isCatExpanded && (
                        <div className="ml-5 border-l-2 border-gray-200 dark:border-zinc-800 pl-2 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                          {category.chapters.map((chapter: Chapter) => {
                            const isChapExpanded = expandedChapters.includes(
                              chapter.id,
                            );
                            const isActiveChapter =
                              activeChapterId === chapter.id ||
                              chapter.topics.some(t => t.id === activeTopicId);

                            return (
                              <div key={chapter.id}>
                                {/* Chapter Row */}
                                <div
                                  className={`flex items-center rounded-md transition-colors
                                                                ${
                                                                  isActiveChapter
                                                                    ? "bg-gray-100 dark:bg-zinc-800"
                                                                    : "hover:bg-gray-50 dark:hover:bg-zinc-900"
                                                                }
                                                            `}>
                                  {/* Arrow Toggle */}
                                  <button
                                    onClick={e =>
                                      toggleChapterExpand(chapter.id, e)
                                    }
                                    className="p-1.5 text-gray-500 hover:text-black dark:hover:text-white">
                                    {isChapExpanded ? (
                                      <ChevronDown size={12} />
                                    ) : (
                                      <ChevronRight size={12} />
                                    )}
                                  </button>

                                  {/* Chapter Name (Navigates to Chapter View) */}
                                  <button
                                    onClick={() =>
                                      handleChapterNameClick(chapter.id)
                                    }
                                    className={`flex-1 text-left py-1.5 pr-2 text-xs font-bold truncate ${isActiveChapter ? "text-black dark:text-white" : "text-gray-500 dark:text-zinc-500"}`}>
                                    {chapter.title}
                                  </button>
                                </div>

                                {/* Topics Tree */}
                                {isChapExpanded && (
                                  <div className="ml-2 pl-3 border-l-2 border-gray-100 dark:border-zinc-800 mt-1 mb-2 space-y-0.5">
                                    {chapter.topics.map((topic: Topic) => {
                                      const score =
                                        user.quizScores?.[topic.id] || 0;
                                      const isMastered = score >= 5;
                                      const isActiveTopic =
                                        activeTopicId === topic.id;

                                      return (
                                        <button
                                          key={topic.id}
                                          onClick={() =>
                                            onNavigate(
                                              "topic",
                                              topic.id,
                                              chapter.id,
                                            )
                                          }
                                          className={`w-full text-left py-1.5 px-2 text-[11px] font-medium rounded-md transition-all flex items-center justify-between group
                                                                                ${
                                                                                  isActiveTopic
                                                                                    ? "bg-acid text-black font-bold shadow-sm"
                                                                                    : "text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
                                                                                }
                                                                            `}>
                                          <span className="truncate">
                                            {topic.title}
                                          </span>
                                          {isMastered && (
                                            <CheckCircle2
                                              size={10}
                                              className="text-black dark:text-white"
                                            />
                                          )}
                                        </button>
                                      );
                                    })}

                                    {/* Final Exam Link */}
                                    <button
                                      onClick={() =>
                                        onNavigate(
                                          "module-quiz",
                                          undefined,
                                          chapter.id,
                                        )
                                      }
                                      className="w-full text-left py-1.5 px-2 text-[10px] font-bold text-acid-dark dark:text-acid hover:underline flex items-center gap-2 mt-1">
                                      <Trophy size={10} /> Final Exam
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
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

      {/* Footer */}
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
