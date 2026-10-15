import React from 'react';
import {
  Timer,
  Sparkles,
  Binary,
  Terminal,
  ArrowRight,
  Code2,
  FileCode,
  BookOpen,
  FolderCode,
  CheckCircle2
} from 'lucide-react';
import { ActiveTab } from './Header';
import { ORIGINAL_SCRIPTS } from '../data/scriptsData';

interface OverviewProps {
  onNavigate: (tab: ActiveTab) => void;
  onRunScript: (scriptId: string) => void;
  learnedCount: number;
  projectsCount: number;
}

export const Overview: React.FC<OverviewProps> = ({
  onNavigate,
  onRunScript,
  learnedCount,
  projectsCount,
}) => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 p-8 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>akhand-dev / learned — Practice & Projects Studio</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Track What You Learn & Store Your Python Projects
          </h2>

          <p className="text-base text-slate-300 leading-relaxed">
            Record every concept you master, save your custom practice scripts, run them in an authentic simulated Python terminal, and watch your Python skill set grow.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('learned')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>See What I Have Learned ({learnedCount})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('my-projects')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition cursor-pointer"
            >
              <FolderCode className="w-4 h-4 text-indigo-400" />
              <span>My Projects ({projectsCount})</span>
            </button>

            <button
              onClick={() => onNavigate('countdown')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-sm font-medium transition cursor-pointer"
            >
              <Timer className="w-4 h-4 text-amber-400" />
              <span>Countdown Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Highlights: What I Learned & Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: What I Learned */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition shadow-lg space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-mono font-bold">
                {learnedCount} Topics Logged
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">What I Have Learned</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                A structured knowledge base for your Python journey. From basic print parameters and in-place variable mutation to list unpacking, F-strings, and OOP <code className="text-sky-300 font-mono">__str__</code> methods.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Includes code snippets & output</span>
            </span>
            <button
              onClick={() => onNavigate('learned')}
              className="flex items-center space-x-1 text-xs font-bold text-sky-400 hover:text-sky-300 cursor-pointer"
            >
              <span>Open Journal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: My Projects Storage */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition shadow-lg space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FolderCode className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold">
                {projectsCount} Stored Projects
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Store & Practice Projects</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Keep all your practice scripts organized in one spot. Edit code in the built-in editor, test executions in the terminal console, download scripts, and add ready-made templates.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center space-x-1">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full in-browser code runner</span>
            </span>
            <button
              onClick={() => onNavigate('my-projects')}
              className="flex items-center space-x-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              <span>Open Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Exploration Labs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Interactive Concept Labs
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lab 1: Countdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-sky-400 font-bold uppercase">
                  projects/countdown.py
                </span>
                <Timer className="w-4 h-4 text-sky-400" />
              </div>
              <h4 className="text-base font-bold text-white">Real-Time Countdown Loop</h4>
              <p className="text-xs text-slate-400">
                Interactive loop runner demonstrating <code className="text-sky-300 font-mono">flush=True</code> and <code className="text-sky-300 font-mono">end='...'</code> without line breaks.
              </p>
            </div>
            <button
              onClick={() => onNavigate('countdown')}
              className="mt-4 pt-3 border-t border-slate-800/80 text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center justify-between cursor-pointer"
            >
              <span>Run Countdown Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Lab 2: Print Mastery */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">
                  python/start1.py
                </span>
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
              <h4 className="text-base font-bold text-white">print() Function Mastery</h4>
              <p className="text-xs text-slate-400">
                Playground for <code className="text-indigo-300 font-mono">sep</code>, <code className="text-indigo-300 font-mono">end</code>, <code className="text-indigo-300 font-mono">file=py</code> redirection, F-strings, and OOP <code className="text-indigo-300 font-mono">__str__</code>.
              </p>
            </div>
            <button
              onClick={() => onNavigate('print-mastery')}
              className="mt-4 pt-3 border-t border-slate-800/80 text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center justify-between cursor-pointer"
            >
              <span>Explore Print Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Lab 3: Operators & Dictionaries */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                  python/print.py
                </span>
                <Binary className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-base font-bold text-white">Operators & Dictionaries</h4>
              <p className="text-xs text-slate-400">
                Live arithmetic calculation, step-by-step assignment mutation stepper, dictionary methods, and pip ecosystem.
              </p>
            </div>
            <button
              onClick={() => onNavigate('operators')}
              className="mt-4 pt-3 border-t border-slate-800/80 text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center justify-between cursor-pointer"
            >
              <span>Open Operators Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Script Inventory */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white">Repository Script Inventory</h3>
          </div>
          <button
            onClick={() => onNavigate('files')}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center space-x-1 cursor-pointer"
          >
            <span>View Full File Tree</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {ORIGINAL_SCRIPTS.map((script) => (
            <div
              key={script.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center space-x-3">
                <FileCode className="w-4 h-4 text-sky-400 shrink-0" />
                <div>
                  <div className="font-mono font-bold text-white">{script.path}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{script.summary}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => onRunScript(script.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center space-x-1.5 cursor-pointer transition"
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Run Script</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
