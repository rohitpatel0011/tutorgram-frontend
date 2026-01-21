
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, GraduationCap, Layout, Globe, Code, Layers, LogOut, Sun, Moon, Flame, Server, Cpu, Cloud, Brain, Terminal, Code2, Coffee, BookOpen, Calculator, Network, Database, Waypoints } from 'lucide-react';
import { UserProfile, Category } from '../types';
import { CONTENT_DATA } from '../constants';

interface SidebarProps {
  isOpen: boolean;
  activeTopicId: string | null;
  activeView: string;
  user: UserProfile;
  theme: 'light' | 'dark';
  onNavigate: (view: string, topicId?: string, chapterId?: string) => void;
  onToggle: () => void;
  onLogout: () => void;
  onThemeToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen, activeTopicId, activeView, user, theme, onNavigate, onLogout, onThemeToggle
}) => {
  // Accordion State: Single string instead of array for Categories
     const [expandedCategory, setExpandedCategory] = useState<string | null>(
       null,
     );
     const [expandedChapters, setExpandedChapters] = useState<string[]>([]);


  // Group the content
  const groupedContent = React.useMemo(() => {
    const groups: Record<string, Category[]> = {};
    CONTENT_DATA.forEach(cat => {
      if (!groups[cat.group]) groups[cat.group] = [];
      groups[cat.group].push(cat);
    });
    return groups;
  }, []);

  useEffect(() => {
    if (activeTopicId) {
        let foundChapterId = '';
        let foundCategoryId = '';
        for (const cat of CONTENT_DATA) {
            for (const chap of cat.chapters) {
                if (chap.topics.some(t => t.id === activeTopicId)) {
                    foundChapterId = chap.id;
                    foundCategoryId = cat.id;
                    break;
                }
            }
            if (foundChapterId && foundCategoryId) {
                // Set the active category as the ONLY expanded one
                setExpandedCategory(foundCategoryId);
                setExpandedChapters(prev => prev.includes(foundChapterId) ? prev : [...prev, foundChapterId]);
            }
        }
    }
  }, [activeTopicId]);

  const toggleCategory = (id: string) => {
    // If clicking the already open category, close it (null).
    // Otherwise, open the new one (which automatically closes others because it's a single value).
    setExpandedCategory(prev => prev === id ? null : id);
  };

  const toggleChapter = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setExpandedChapters(prev =>
        prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
      );
  };

  const getCategoryIcon = (id: string) => {
      switch (id) {
          case 'frontend-foundations': return <Globe size={18} />;
          case 'react-ecosystem': return <Code size={18} />;
          case 'nodejs-complete': return <Server size={18} />; // Node uses Server icon
          case 'c-programming': return <Terminal size={18} />;
          case 'cpp-programming': return <Code2 size={18} />;
          case 'java-programming': return <Coffee size={18} />;
          case 'cs-core-subjects': return <BookOpen size={18} />;
          case 'cs-dsa': return <Network size={18} />;
          case 'mysql-database': return <Database size={18} />;
          case 'system-design': return <Layers size={18} />;
          case 'python-mastery': return <Code size={18} />;
          case 'eng-hardware': return <Cpu size={18} />;
          case 'cs-math': return <Calculator size={18} />;
          case 'cloud-computing': return <Cloud size={18} />;
          case 'ai-ml': return <Brain size={18} />;
          default: return <Layers size={18} />;
      }
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-80 bg-white dark:bg-black border-r-4 border-black dark:border-zinc-800 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 flex flex-col`}>
      {/* Header */}
      <div className="h-24 flex items-center px-6 border-b-4 border-black dark:border-zinc-800 flex-shrink-0 bg-white dark:bg-black">
        <div className="w-12 h-12 bg-acid border-2 border-black rounded-lg flex items-center justify-center mr-4 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]">
          {/* <GraduationCap /> */}
          <Waypoints className="text-black" size={24} />
        </div>
        <div>
          <span className="font-black text-2xl tracking-tighter text-black dark:text-white block leading-none">
            TUTORGRAM
          </span>
          <span className="text-[10px] bg-black dark:bg-white text-white dark:text-black px-1 py-0.5 font-bold tracking-wider inline-block mt-1">
           AI-LEARNING PLATFORM
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar bg-white dark:bg-black">
        <button
          onClick={() => onNavigate("dashboard")}
          className={`w-full flex items-center px-4 py-4 text-sm font-bold rounded-xl border-2 transition-all mb-8
            ${
              activeView === "dashboard"
                ? "bg-acid text-black border-black shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] translate-x-[-2px] translate-y-[-2px]"
                : "bg-white dark:bg-black text-gray-600 dark:text-gray-400 border-transparent hover:border-black dark:hover:border-white hover:bg-gray-50 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white"
            }`}>
          <Layout size={20} className="mr-3" />
          DASHBOARD
        </button>

        <div className="px-2 pb-4 flex items-center justify-between">
          <span className="text-xs font-black text-black dark:text-zinc-500 uppercase tracking-widest border-b-2 border-acid inline-block">
            My Curriculum
          </span>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedContent).map(([groupName, categories]) => (
            <div key={groupName}>
              {/* Parent Category Header */}
              <h3 className="px-2 mb-3 text-[10px] font-black uppercase text-gray-400 dark:text-zinc-600 tracking-wider flex items-center gap-2">
                {groupName}
              </h3>

              {/* Courses inside this Parent Group */}
              <div className="space-y-3">
                {categories.map(category => {
                  const isCatExpanded = expandedCategory === category.id;
                  return (
                    <div
                      key={category.id}
                      className="rounded-xl overflow-hidden">
                      {/* Category Header (e.g., Node.js, C++) */}
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 ${isCatExpanded ? "font-bold text-black dark:text-white" : "text-gray-600 dark:text-zinc-400"}`}>
                        <div className="flex items-center">
                          <span className="mr-3 opacity-100 p-1.5 bg-black dark:bg-white text-acid dark:text-black rounded-md border border-black dark:border-transparent">
                            {getCategoryIcon(category.id)}
                          </span>
                          <span className="text-sm font-bold tracking-tight">
                            {category.title}
                          </span>
                        </div>
                        {isCatExpanded ? (
                          <ChevronDown size={14} />
                        ) : (
                          <ChevronRight size={14} />
                        )}
                      </button>

                      {/* Category Body (Chapters) */}
                      <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${isCatExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"}`}>
                        <div className="px-3 pb-2 pt-2 space-y-3 pl-4 border-l-2 border-gray-100 dark:border-zinc-800 ml-4 my-2">
                          {category.chapters.map(chapter => {
                            const isChapExpanded = expandedChapters.includes(
                              chapter.id,
                            );
                            return (
                              <div
                                key={chapter.id}
                                className="bg-white dark:bg-zinc-900 rounded-lg border-2 border-black dark:border-zinc-700 overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-none">
                                {/* Chapter (Module) Header */}
                                <button
                                  onClick={e => toggleChapter(chapter.id, e)}
                                  className={`w-full flex items-center justify-between px-3 py-3 text-xs font-bold transition-colors group cursor-pointer ${activeView === "chapter" && !activeTopicId ? "bg-acid text-black" : "text-black dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800"}`}>
                                  <div className="flex items-center truncate">
                                    <div
                                      className={`w-2 h-2 rounded-full mr-2 flex-shrink-0 border border-black dark:border-zinc-500 ${isChapExpanded ? "bg-acid" : "bg-gray-300 dark:bg-zinc-600"}`}></div>
                                    <span className="truncate uppercase tracking-wide">
                                      {chapter.title}
                                    </span>
                                  </div>
                                  {isChapExpanded ? (
                                    <ChevronDown size={12} />
                                  ) : (
                                    <ChevronRight size={12} />
                                  )}
                                </button>

                                {/* Topics List */}
                                <div
                                  className={`transition-all duration-300 ease-in-out overflow-hidden bg-gray-50 dark:bg-black border-t-2 border-black dark:border-zinc-700 ${isChapExpanded ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"}`}>
                                  <div className="p-2 space-y-1">
                                    {chapter.topics.map(topic => (
                                      <button
                                        key={topic.id}
                                        onClick={() =>
                                          onNavigate(
                                            "topic",
                                            topic.id,
                                            chapter.id,
                                          )
                                        }
                                        className={`w-full text-left px-3 py-2 text-[11px] font-semibold rounded-md transition-all block truncate cursor-pointer border border-transparent
                                                                    ${
                                                                      activeTopicId ===
                                                                      topic.id
                                                                        ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                                                                        : "text-gray-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:border-black dark:hover:border-zinc-500 hover:text-black dark:hover:text-white"
                                                                    }`}>
                                        {topic.title}
                                      </button>
                                    ))}
                                    {/* Quick Quiz Link for Chapter */}
                                    <button
                                      onClick={() =>
                                        onNavigate(
                                          "module-quiz",
                                          undefined,
                                          chapter.id,
                                        )
                                      }
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
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t-4 border-black dark:border-zinc-800 bg-white dark:bg-black">
        <div className="flex items-center justify-between mb-4 px-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-black dark:text-zinc-500">
            Interface
          </span>
          <button
            onClick={onThemeToggle}
            className="p-1.5 rounded-lg border-2 border-black dark:border-zinc-600 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
            {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        </div>
        <div className="flex items-center p-3 rounded-xl border-2 border-black dark:border-zinc-700 bg-acid shadow-[3px_3px_0px_0px_#000] dark:shadow-none">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-10 h-10 rounded-lg border-2 border-black mr-3 bg-white object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-black truncate">{user.name}</p>
            <div className="flex items-center text-[10px] text-black font-bold">
              <Flame size={10} className="mr-1 fill-current" /> {user.streak}{" "}
              Day Streak
            </div>
          </div>
          <button
            onClick={onLogout}
            className="text-black hover:text-red-600 transition-colors p-2">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
