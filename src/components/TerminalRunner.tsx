import React, { useState } from 'react';
import {
  Play,
  Copy,
  Check,
  Terminal,
  FileCode,
  Download,
  Clock
} from 'lucide-react';
import { ORIGINAL_SCRIPTS, ScriptFile } from '../data/scriptsData';

interface TerminalRunnerProps {
  virtualFiles: Record<string, string>;
  onRunScript?: (scriptId: string) => void;
  initialCode?: string;
}

export const TerminalRunner: React.FC<TerminalRunnerProps> = ({ virtualFiles, initialCode }) => {
  const [selectedScriptId, setSelectedScriptId] = useState<string>(initialCode ? 'custom' : 'start1');
  const [activeCode, setActiveCode] = useState<string>(
    initialCode || ORIGINAL_SCRIPTS.find((s) => s.id === 'start1')?.code || ''
  );
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [stdoutLines, setStdoutLines] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  React.useEffect(() => {
    if (initialCode) {
      setSelectedScriptId('custom');
      setActiveCode(initialCode);
    }
  }, [initialCode]);

  const currentScript: ScriptFile =
    ORIGINAL_SCRIPTS.find((s) => s.id === selectedScriptId) || {
      id: 'custom',
      name: 'custom_repl.py',
      path: 'scratchpad/custom_repl.py',
      category: 'python',
      summary: 'Interactive scratchpad for testing snippets and practice code.',
      topics: ['Python REPL', 'Testing Snippets'],
      code: activeCode,
    };

  const handleSelectScript = (script: ScriptFile) => {
    setSelectedScriptId(script.id);
    if (script.id === 'create' && virtualFiles['create.py']) {
      setActiveCode(virtualFiles['create.py']);
    } else {
      setActiveCode(script.code);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunExecution = () => {
    setIsExecuting(true);
    setStdoutLines([`$ python3 ${currentScript.path}`]);

    // Generate faithful execution output based on the script
    if (selectedScriptId === 'start1') {
      const outputs = [
        'hello world',
        'Age: 25 Status: True',
        'my name is akhand pratap singh',
        '2026-10-04',
        'using the sep parameter:\n2\n3\n4',
        'using  2 3 4',
        'using no space234',
        'Home/user/documents',
        'Loading... Done!',
        '[start1.py: wrote to create.py with content "print(\'hello, it is created by start1.py\')"]',
        '0 1 ',
        'Hello Alice, your total is $48.95',
        'helloakhand , i know your age is 87.78',
        'Apple, Banana, Cherry',
        "['Apple', 'Banana', 'Cherry']",
        'Player: ShadowNinja (Level 42)',
        '--- Execution finished (exit code 0) ---',
      ];

      outputs.forEach((line, index) => {
        setTimeout(() => {
          setStdoutLines((prev) => [...prev, line]);
          if (index === outputs.length - 1) {
            setIsExecuting(false);
          }
        }, (index + 1) * 120);
      });
    } else if (selectedScriptId === 'countdown') {
      const outputs = [
        `till what number do you want the countdown: 5`,
        '0...1...2...3...4...5...',
        '--- Execution finished (exit code 0) ---',
      ];

      outputs.forEach((line, index) => {
        setTimeout(() => {
          setStdoutLines((prev) => [...prev, line]);
          if (index === outputs.length - 1) {
            setIsExecuting(false);
          }
        }, (index + 1) * 300);
      });
    } else if (selectedScriptId === 'print') {
      const outputs = [
        'hi',
        '20',
        '0',
        '100',
        '1.0',
        'remainder 0',
        'expo 10000000000',
        '10',
        '20',
        '10',
        '100',
        '10.0',
        "enter your name: 'Akhand'",
        '--- Execution finished (exit code 0) ---',
      ];

      outputs.forEach((line, index) => {
        setTimeout(() => {
          setStdoutLines((prev) => [...prev, line]);
          if (index === outputs.length - 1) {
            setIsExecuting(false);
          }
        }, (index + 1) * 100);
      });
    } else if (selectedScriptId === 'create') {
      const outputs = [
        'hello, it is created by start1.py',
        '--- Execution finished (exit code 0) ---',
      ];
      outputs.forEach((line, index) => {
        setTimeout(() => {
          setStdoutLines((prev) => [...prev, line]);
          if (index === outputs.length - 1) {
            setIsExecuting(false);
          }
        }, (index + 1) * 150);
      });
    } else {
      // Custom / scratchpad code execution
      const outputs: string[] = [];
      const lines = activeCode.split('\n');
      lines.forEach((l) => {
        const trimmed = l.trim();
        if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
          const inner = trimmed.slice(6, -1);
          if ((inner.startsWith('"') && inner.endsWith('"')) || (inner.startsWith("'") && inner.endsWith("'"))) {
            outputs.push(inner.slice(1, -1));
          } else if (inner.startsWith('f"') || inner.startsWith("f'")) {
            outputs.push(inner.slice(2, -1));
          } else {
            outputs.push(`[Output for: ${inner}]`);
          }
        }
      });
      if (outputs.length === 0) {
        outputs.push('Code executed successfully.');
      }
      outputs.push('--- Execution finished (exit code 0) ---');

      outputs.forEach((line, index) => {
        setTimeout(() => {
          setStdoutLines((prev) => [...prev, line]);
          if (index === outputs.length - 1) {
            setIsExecuting(false);
          }
        }, (index + 1) * 150);
      });
    }
  };

  const handleClearTerminal = () => {
    setStdoutLines([]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950/30 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-mono mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>Interactive Terminal & Code Inspector</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Run & Inspect Repository Scripts
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Switch between any of the Python files in the repository (<code className="text-sky-300 font-mono">start1.py</code>, <code className="text-sky-300 font-mono">countdown.py</code>, <code className="text-sky-300 font-mono">print.py</code>, and the generated <code className="text-sky-300 font-mono">create.py</code>), inspect full source code, and run simulated CLI execution.
          </p>
        </div>
      </div>

      {/* Script Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {ORIGINAL_SCRIPTS.map((script) => {
          const isSelected = selectedScriptId === script.id;
          return (
            <button
              key={script.id}
              onClick={() => handleSelectScript(script)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-mono transition cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{script.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded ${
                  isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {script.category}
              </span>
            </button>
          );
        })}
      </div>

      {/* Two Column Layout: Code Editor + Terminal Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Code Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[520px]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-sky-400" />
                <span className="font-mono text-xs font-semibold text-slate-200">
                  {currentScript.path}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  title="Copy code"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([activeCode], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = currentScript.name;
                    a.click();
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  title="Download file"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="flex-1 overflow-auto bg-slate-950/80 p-4 font-mono text-xs text-slate-200 select-text leading-relaxed">
              <pre className="whitespace-pre">{activeCode}</pre>
            </div>

            {/* Footer with Run Button */}
            <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentScript.summary}</span>
              </div>
              <button
                onClick={handleRunExecution}
                disabled={isExecuting}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isExecuting ? 'Running...' : `Run ${currentScript.name}`}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Terminal Stdout (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-black/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
            {/* Terminal Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span className="text-xs font-mono text-slate-400 ml-2">Console Output (stdout)</span>
              </div>
              <button
                onClick={handleClearTerminal}
                className="text-[11px] text-slate-500 hover:text-slate-300 font-mono cursor-pointer"
              >
                clear
              </button>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-4 font-mono text-xs overflow-auto space-y-1.5 select-text">
              {stdoutLines.length === 0 ? (
                <div className="text-slate-600 italic py-8 text-center space-y-2">
                  <Terminal className="w-8 h-8 mx-auto opacity-30" />
                  <p>Click "Run {currentScript.name}" to execute this script in the Python sandbox.</p>
                </div>
              ) : (
                stdoutLines.map((line, idx) => {
                  const isPrompt = line.startsWith('$');
                  const isFinished = line.startsWith('---');
                  const isWritten = line.startsWith('[start1.py: wrote');
                  return (
                    <div
                      key={idx}
                      className={`${
                        isPrompt
                          ? 'text-sky-400 font-bold'
                          : isFinished
                          ? 'text-slate-500 italic pt-2'
                          : isWritten
                          ? 'text-amber-400 italic'
                          : 'text-emerald-400'
                      } whitespace-pre-wrap`}
                    >
                      {line}
                    </div>
                  );
                })
              )}
              {isExecuting && (
                <div className="flex items-center space-x-2 text-sky-400 text-xs">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                  <span>Executing Python bytecode...</span>
                </div>
              )}
            </div>

            {/* Key Topics Badge List */}
            <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5">
                Covered In This Script
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentScript.topics.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
