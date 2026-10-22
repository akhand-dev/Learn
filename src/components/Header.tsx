import React from 'react';
import {
  Terminal,
  Timer,
  Sparkles,
  Binary,
  FolderTree,
  Code2,
  BookOpen,
  FolderCode,
  Laptop
} from 'lucide-react';

export type ActiveTab =
  | 'vscode'
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
    { id: 'vscode', label: 'VS Code Editor', icon: Laptop, count: 'IDE' },
    { id: 'overview', label: 'Overview', icon: Code2, count: null },
    { id: 'learned', label: 'What I Learned', icon: BookOpen, count: `${learnedCount}` },
    { id: 'my-projects', label: 'My Projects', icon: FolderCode, count: `${projectsCount}` },
    { id: 'countdown', label: 'Countdown Lab', icon: Timer, count: null },
    { id: 'print-mastery', label: 'print() Mastery', icon: Sparkles, count: null },
    { id: 'operators', label: 'Operators & Math', icon: Binary, count: null },
    { id: 'runner', label: 'Terminal REPL', icon: Terminal, count: null },
    { id: 'files', label: 'Workspace Files', icon: FolderTree, count: `${fileCount}` },
  ] as const;

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Top Bar */}
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo & Brand Wordmark */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 p-[1.5px] shadow-md shadow-sky-950/60">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300 text-lg">
                  Py
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-white tracking-tight">
                  akhand-dev <span className="text-slate-500 font-normal">/</span> <span className="text-sky-400">learned</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Python Learning Journal & Practice Studio
              </p>
            </div>
          </div>

          {/* Right: Unboxed Metadata & Primary Action */}
          <div className="hidden sm:flex items-center space-x-5">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span className="text-sky-300 font-semibold tabular-nums">{learnedCount} Topics</span>
              <span className="text-slate-600">·</span>
              <span className="text-indigo-300 font-semibold tabular-nums">{projectsCount} Projects</span>
            </div>

            <button
              onClick={() => onTabChange('vscode')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition cursor-pointer shadow-sm ${
                activeTab === 'vscode'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-sky-500/25'
                  : 'bg-slate-900 hover:bg-slate-800 text-sky-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <Laptop className="w-4 h-4" />
              <span>Launch VS Code IDE</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation with Generous Breathing Room */}
        <nav className="flex space-x-2 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-800/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as ActiveTab)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-300 font-semibold border border-sky-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.count && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono tabular-nums ${
                      isActive
                        ? 'bg-sky-400/20 text-sky-200'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
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
