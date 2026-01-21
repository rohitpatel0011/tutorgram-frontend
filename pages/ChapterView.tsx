import React from 'react';
import { Award, CheckSquare, ChevronRight, Play, Trophy, Sparkles } from 'lucide-react';

interface Props {
  activeChapter: any;
  completedTopics: string[];
  onNavigate: (view: string, topicId?: string, chapterId?: string) => void;
}

const ChapterView: React.FC<Props> = ({ activeChapter, completedTopics, onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-6 pb-40">
       <div className="bg-white dark:bg-black rounded-2xl shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#fff] border-4 border-black dark:border-zinc-700 p-10 text-center relative overflow-hidden mb-12">
           <div className="w-24 h-24 bg-acid border-4 border-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_#000] transform -rotate-3">
               <Award size={48} className="text-black" />
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-6 uppercase tracking-tighter">{activeChapter.title}</h1>
           <p className="text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto text-lg font-bold leading-relaxed">
               Master this module by exploring the topics below. Complete the AI quiz at the end to earn XP.
           </p>
           
           <div className="flex justify-center gap-4">
               <button 
                   onClick={() => onNavigate('topic', activeChapter.topics[0].id, activeChapter.id)}
                   className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-black rounded-xl hover:scale-105 transition-all shadow-[6px_6px_0px_0px_#888] uppercase tracking-wider flex items-center gap-2"
               >
                   <Play size={20} fill="currentColor" /> Start Module
               </button>
           </div>
       </div>

       <h2 className="text-2xl font-black text-black dark:text-white mb-6 uppercase tracking-tight">Module Topics</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
           {activeChapter.topics.map((t: any, idx: number) => (
                   <div 
                   key={t.id}
                   onClick={() => onNavigate('topic', t.id, activeChapter.id)}
                   className="bg-white dark:bg-zinc-900 p-6 rounded-xl border-2 border-black dark:border-zinc-600 hover:bg-acid dark:hover:bg-acid hover:border-black shadow-[4px_4px_0px_0px_#000] cursor-pointer transition-all group flex items-center"
                   >
                       <span className={`w-12 h-12 rounded-lg border-2 border-black flex items-center justify-center text-lg font-black mr-4 transition-colors ${completedTopics.includes(t.id) ? 'bg-green-400 text-black' : 'bg-white text-black group-hover:bg-black group-hover:text-white'}`}>
                           {completedTopics.includes(t.id) ? <CheckSquare size={20} /> : idx + 1}
                       </span>
                       <span className="font-bold text-xl text-black dark:text-white group-hover:text-black">{t.title}</span>
                       <ChevronRight className="ml-auto text-black dark:text-white group-hover:text-black" size={24} />
                   </div>
           ))}
       </div>

       {/* Module Quiz Card */}
       <div className="relative">
           <div className="absolute inset-0 bg-acid transform translate-x-2 translate-y-2 rounded-2xl border-4 border-black"></div>
           <div className="relative bg-black text-white p-8 md:p-12 rounded-2xl border-4 border-black flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-6">
                   <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-black text-black shrink-0">
                       <Trophy size={40} />
                   </div>
                   <div>
                       <div className="flex items-center gap-2 mb-2">
                           <span className="bg-acid text-black px-3 py-1 text-xs font-black uppercase rounded-full">Final Exam</span>
                           <span className="text-acid font-bold text-xs flex items-center gap-1"><Sparkles size={12} /> 100 XP REWARD</span>
                       </div>
                       <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Ready to Graduate?</h2>
                       <p className="text-gray-400 font-medium">Take the comprehensive 10-question module quiz. <br/>Score 8/10 or higher to earn your XP badge.</p>
                   </div>
               </div>
               
               <button 
                   onClick={() => onNavigate('module-quiz', undefined, activeChapter.id)}
                   className="px-10 py-4 bg-acid text-black font-black text-lg rounded-xl border-2 border-black hover:scale-105 hover:shadow-[0px_0px_20px_rgba(171,250,0,0.5)] transition-all uppercase tracking-widest shrink-0"
               >
                   Start Quiz
               </button>
           </div>
       </div>
    </div>
  );
};

export default ChapterView;