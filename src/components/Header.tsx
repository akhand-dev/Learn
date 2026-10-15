import React from 'react';
import {
  Terminal,
  Timer,
  Sparkles,
  Binary,
  FolderTree,
  Code2,
  BookOpen,
  FolderCode
} from 'lucide-react';

export type ActiveTab =
  | 'overview'
  | 'learned'
  | 'my-projects'
  | 'countdown'
  | 'print-mastery'
  | 'operators'
  | 'runner'
  | 'files';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  fileCount: number;
  learnedCount: number;
  projectsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  fileCount,
  learnedCount,
  projectsCount,
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Code2, count: null },
    { id: 'learned', label: 'What I Learned', icon: BookOpen, count: `${learnedCount} topics` },
    { id: 'my-projects', label: 'My Projects', icon: FolderCode, count: `${projectsCount} proj` },
    { id: 'countdown', label: 'Countdown', icon: Timer, count: 'projects/' },
    { id: 'print-mastery', label: 'Print() Mastery', icon: Sparkles, count: 'start1.py' },
    { id: 'operators', label: 'Operators', icon: Binary, count: 'print.py' },
    { id: 'runner', label: 'Terminal REPL', icon: Terminal, count: 'CLI' },
    { id: 'files', label: 'Files', icon: FolderTree, count: `${fileCount}` },
  ] as const;

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Project Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-sky-500 to-indigo-600 p-[1.5px] shadow-lg shadow-sky-950/50">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-sky-400 text-lg">
                  Py
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold text-white tracking-tight">
                  akhand-dev / <span className="text-sky-400">learned</span>
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">
                  Python Practice & Journal
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Track, practice Python & store your projects
              </p>
            </div>
          </div>

          {/* Quick Badges */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => onTabChange('learned')}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-xs text-sky-300 font-mono transition cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>{learnedCount} Learned Topics</span>
            </button>
            <button
              onClick={() => onTabChange('my-projects')}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-xs text-indigo-300 font-mono transition cursor-pointer"
            >
              <FolderCode className="w-3.5 h-3.5 text-indigo-400" />
              <span>{projectsCount} Projects</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as ActiveTab)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-sm shadow-sky-500/10 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.count && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive
                        ? 'bg-sky-400/20 text-sky-200'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
