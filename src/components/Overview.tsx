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
  CheckCircle2,
  Laptop
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
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Hero Section: Clean, Airy & Spacious */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-800 p-8 sm:p-12 lg:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/3 w-[26rem] h-[26rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Unboxed breadcrumb metadata */}
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span className="text-sky-400 font-semibold">akhand-dev</span>
            <span>/</span>
            <span>learned</span>
            <span>·</span>
            <span className="text-slate-300">Python Practice Studio</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Learn, Practice, and Master Python in Your Own Workspace
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            A comprehensive, interactive workbench for recording Python concepts, saving custom scripts, running code in a simulated Python 3.12 terminal, and tracking mastery.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('vscode')}
              className="flex items-center space-x-2.5 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/25 transition cursor-pointer"
            >
              <Laptop className="w-4 h-4" />
              <span>Launch VS Code IDE</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('learned')}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>What I Learned ({learnedCount})</span>
            </button>

            <button
              onClick={() => onNavigate('my-projects')}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition cursor-pointer"
            >
              <FolderCode className="w-4 h-4 text-indigo-400" />
              <span>Projects ({projectsCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Primary Highlights: What I Learned & Projects Storage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: What I Learned */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between hover:border-slate-700 transition shadow-xl space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-semibold text-sky-400 tabular-nums">
                {learnedCount} Concepts Documented
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Structured Python Knowledge Base</h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Log every discovery across Chapters 1 to 10: Modules, Variables, Data Types, Strings, Lists, Tuples, Dictionaries, Sets, Loops, Functions, Recursion, File I/O, and OOP classes.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center space-x-1.5 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Includes code snippets & expected output</span>
            </span>
            <button
              onClick={() => onNavigate('learned')}
              className="flex items-center space-x-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 cursor-pointer transition"
            >
              <span>Explore Journal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: My Projects Storage */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between hover:border-slate-700 transition shadow-xl space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FolderCode className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-semibold text-indigo-400 tabular-nums">
                {projectsCount} Stored Projects
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Practice & Custom Projects</h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Write and test custom utilities in <code className="text-indigo-300 font-mono">projects/</code>. Build countdown loops, math calculators, password generators, and CLI tools with simulated execution.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center space-x-1.5 font-mono">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Full terminal simulation runner</span>
            </span>
            <button
              onClick={() => onNavigate('my-projects')}
              className="flex items-center space-x-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer transition"
            >
              <span>View Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Interactive Concept Labs */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Interactive Concept Labs
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Lab 1: Countdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 hover:border-slate-700 transition flex flex-col justify-between shadow-lg space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-sky-400 font-semibold">
                  projects/countdown.py
                </span>
                <Timer className="w-4 h-4 text-sky-400" />
              </div>
              <h4 className="text-base font-bold text-white">Real-Time Countdown Loop</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Visual loop runner demonstrating <code className="text-sky-300 font-mono">flush=True</code> and <code className="text-sky-300 font-mono">end='...'</code> without line breaks.
              </p>
            </div>
            <button
              onClick={() => onNavigate('countdown')}
              className="mt-4 pt-4 border-t border-slate-800/80 text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center justify-between cursor-pointer transition"
            >
              <span>Run Countdown Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Lab 2: Print Mastery */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 hover:border-slate-700 transition flex flex-col justify-between shadow-lg space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-indigo-400 font-semibold">
                  python/start1.py
                </span>
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
              <h4 className="text-base font-bold text-white">print() Function Mastery</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Playground for <code className="text-indigo-300 font-mono">sep</code>, <code className="text-indigo-300 font-mono">end</code>, <code className="text-indigo-300 font-mono">file=py</code> redirection, and F-string formatting.
              </p>
            </div>
            <button
              onClick={() => onNavigate('print-mastery')}
              className="mt-4 pt-4 border-t border-slate-800/80 text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center justify-between cursor-pointer transition"
            >
              <span>Explore Print Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Lab 3: Operators & Dictionaries */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 hover:border-slate-700 transition flex flex-col justify-between shadow-lg space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-amber-400 font-semibold">
                  python/print.py
                </span>
                <Binary className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-base font-bold text-white">Operators & Mutations</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Live arithmetic calculation, step-by-step assignment mutation stepper, dictionary views, and pip packages.
              </p>
            </div>
            <button
              onClick={() => onNavigate('operators')}
              className="mt-4 pt-4 border-t border-slate-800/80 text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center justify-between cursor-pointer transition"
            >
              <span>Open Operators Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Script Inventory */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
          <div className="flex items-center space-x-2.5">
            <Code2 className="w-4 h-4 text-sky-400" />
            <h3 className="text-base font-bold text-white">Repository Script Inventory</h3>
          </div>
          <button
            onClick={() => onNavigate('files')}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center space-x-1.5 cursor-pointer transition"
          >
            <span>View Full File Tree</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {ORIGINAL_SCRIPTS.map((script) => (
            <div
              key={script.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center space-x-3.5">
                <FileCode className="w-4 h-4 text-sky-400 shrink-0" />
                <div>
                  <div className="font-mono font-bold text-white text-sm">{script.path}</div>
                  <div className="text-slate-400 text-xs mt-1 leading-relaxed">{script.summary}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => onRunScript(script.id)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center space-x-2 cursor-pointer transition"
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
