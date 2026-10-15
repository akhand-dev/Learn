import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, CheckCircle2, Terminal, Info, Code, Sparkles } from 'lucide-react';

export const CountdownLab: React.FC = () => {
  const [targetNumber, setTargetNumber] = useState<number>(5);
  const [inputValue, setInputValue] = useState<string>('5');
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [outputStream, setOutputStream] = useState<string[]>([]);
  const [activeCodeLine, setActiveCodeLine] = useState<number | null>(null);

  const timerRef = useRef<number | null>(null);

  const startCountdown = (startFrom: number = 0) => {
    const target = Math.max(1, parseInt(inputValue, 10) || 5);
    setTargetNumber(target);
    setIsRunning(true);
    setIsCompleted(false);

    if (startFrom === 0) {
      setOutputStream([]);
      setCurrentStep(0);
      setActiveCodeLine(3); // for t in range...
    }
  };

  const pauseCountdown = () => {
    setIsRunning(false);
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setActiveCodeLine(null);
  };

  const resetCountdown = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setCurrentStep(-1);
    setOutputStream([]);
    setActiveCodeLine(null);
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    if (currentStep > targetNumber) {
      setIsRunning(false);
      setIsCompleted(true);
      setActiveCodeLine(null);
      return;
    }

    // Simulate Python loop iteration:
    // Line 4: print(t, end='...', flush=True)
    setActiveCodeLine(4);
    setOutputStream((prev) => [...prev, `${currentStep}...`]);

    // Line 5: time.sleep(1 / speedMultiplier)
    const delay = 1000 / speedMultiplier;
    timerRef.current = window.setTimeout(() => {
      setActiveCodeLine(5);
      setCurrentStep((prev) => prev + 1);
    }, delay);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [isRunning, currentStep, targetNumber, speedMultiplier]);

  const progressPercent =
    targetNumber > 0 && currentStep >= 0
      ? Math.min(100, Math.round(((Math.min(currentStep, targetNumber) + 1) / (targetNumber + 1)) * 100))
      : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Terminal className="w-48 h-48 text-sky-400" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-mono mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            <span>projects/countdown.py</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Interactive Countdown & Live Stream Visualizer
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            This project explores Python’s <code className="text-sky-300 bg-sky-950/60 px-1.5 py-0.5 rounded font-mono">time.sleep()</code>, loop sequences with <code className="text-sky-300 bg-sky-950/60 px-1.5 py-0.5 rounded font-mono">range(x + 1)</code>, and overriding <code className="text-sky-300 bg-sky-950/60 px-1.5 py-0.5 rounded font-mono">end='...'</code> with <code className="text-sky-300 bg-sky-950/60 px-1.5 py-0.5 rounded font-mono">flush=True</code> to stream real-time command-line updates without newlines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Controls and Status (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Display Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Target Number (x)
                </span>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-3xl font-extrabold text-white font-mono">
                    {targetNumber}
                  </span>
                  <span className="text-xs text-slate-400">steps (0 to {targetNumber})</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Current Step (t)
                </span>
                <div className="text-3xl font-extrabold text-sky-400 font-mono mt-1">
                  {currentStep >= 0 ? Math.min(currentStep, targetNumber) : '—'}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>Progress: {progressPercent}%</span>
                <span>
                  {currentStep >= 0 ? `${Math.min(currentStep, targetNumber)} / ${targetNumber}` : 'Idle'}
                </span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500 rounded-full transition-all duration-300 ease-out shadow-sm shadow-sky-500/50"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Input & Presets */}
            <div className="space-y-3 mb-6 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <label className="block text-xs font-medium text-slate-300">
                <span className="text-amber-400 font-mono">input:</span> "till what number do you want the countdown"
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="1"
                  max="100"
                  disabled={isRunning}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val > 0) setTargetNumber(val);
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm w-32 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:opacity-50"
                />

                <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                  {[3, 5, 10, 15, 20].map((preset) => (
                    <button
                      key={preset}
                      disabled={isRunning}
                      onClick={() => {
                        setInputValue(preset.toString());
                        setTargetNumber(preset);
                        if (isCompleted || currentStep > 0) resetCountdown();
                      }}
                      className={`px-2.5 py-1 text-xs font-mono rounded-md border transition cursor-pointer ${
                        targetNumber === preset
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-bold'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      } disabled:opacity-50`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center space-x-2">
                {!isRunning ? (
                  <button
                    onClick={() => {
                      if (currentStep > targetNumber || isCompleted) {
                        startCountdown(0);
                      } else if (currentStep >= 0) {
                        setIsRunning(true);
                      } else {
                        startCountdown(0);
                      }
                    }}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{currentStep >= 0 && !isCompleted ? 'Resume' : 'Run Countdown'}</span>
                  </button>
                ) : (
                  <button
                    onClick={pauseCountdown}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold text-sm transition-all cursor-pointer"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </button>
                )}

                <button
                  onClick={resetCountdown}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-300 border border-slate-700 text-sm font-medium transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Speed Control */}
              <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <FastForward className="w-3.5 h-3.5 text-slate-400 ml-2" />
                <span className="text-[11px] text-slate-400 font-mono mr-1">Speed:</span>
                {[1, 2, 4, 10].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSpeedMultiplier(spd)}
                    className={`px-2 py-1 text-xs font-mono rounded-lg transition cursor-pointer ${
                      speedMultiplier === spd
                        ? 'bg-sky-500 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Stdout Terminal Display */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span className="text-xs font-mono text-slate-400 ml-2">stdout (streamed via flush=True)</span>
              </div>
              <div className="flex items-center space-x-2">
                {isRunning && (
                  <span className="flex items-center space-x-1.5 text-xs text-sky-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
                    <span>Flushing...</span>
                  </span>
                )}
                {isCompleted && (
                  <span className="flex items-center space-x-1 text-xs text-emerald-400 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Finished</span>
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 font-mono text-sm min-h-[120px] bg-black/50 select-text leading-relaxed">
              <div className="text-slate-500 mb-2 text-xs">
                $ python projects/countdown.py
                <br />
                till what number do you want the countdown: <span className="text-amber-300">{targetNumber}</span>
              </div>

              {outputStream.length === 0 ? (
                <div className="text-slate-600 italic py-4">
                  Output will stream here in real time without newline breaks...
                </div>
              ) : (
                <div className="text-emerald-400 font-semibold break-all">
                  {outputStream.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-block animate-fadeIn transition-colors hover:text-white"
                    >
                      {item}
                    </span>
                  ))}
                  {isRunning && (
                    <span className="inline-block w-2.5 h-4 bg-sky-400 align-middle ml-1 animate-pulse"></span>
                  )}
                </div>
              )}

              {isCompleted && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Countdown complete! Total {targetNumber + 1} iterations printed.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Code Inspector & Educational Deep-Dive (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Code Viewer with active line highlight */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-mono font-semibold text-slate-300">
                  projects/countdown.py
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                Python 3
              </span>
            </div>

            <div className="p-4 font-mono text-xs overflow-x-auto bg-slate-950/70">
              {[
                { line: 1, text: "import time" },
                { line: 2, text: "x = int(input('till what number do you want the countdown'))" },
                { line: 3, text: "for t in range(x + 1):" },
                { line: 4, text: "    print(t,end='...', flush= True)" },
                { line: 5, text: "    time.sleep(1)" },
              ].map((item) => {
                const isActive = activeCodeLine === item.line;
                return (
                  <div
                    key={item.line}
                    className={`flex items-center py-1 px-2 rounded transition-colors ${
                      isActive
                        ? 'bg-sky-500/20 text-sky-200 border-l-2 border-sky-400 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="w-6 text-slate-600 select-none text-[11px]">{item.line}</span>
                    <pre className="flex-1 whitespace-pre">{item.text}</pre>
                    {isActive && (
                      <span className="text-[10px] font-sans px-1.5 py-0.2 rounded bg-sky-500 text-slate-950 font-bold ml-2">
                        active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Concept Highlights */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center space-x-2 text-sky-400 text-sm font-semibold">
              <Info className="w-4 h-4" />
              <span>Key Python Concepts Applied</span>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="font-semibold text-white font-mono">end='...'</span>
                <p className="text-slate-400">
                  By default, <code className="text-sky-300 font-mono">print()</code> appends a newline character (<code className="text-sky-300 font-mono">\n</code>). Passing <code className="text-sky-300 font-mono">end='...'</code> prevents the cursor from dropping to a new line, keeping all counts on one continuous stream.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="font-semibold text-white font-mono">flush=True</span>
                <p className="text-slate-400">
                  Python buffers I/O operations for efficiency. Without <code className="text-sky-300 font-mono">flush=True</code>, the terminal might withhold outputs until the loop terminates. <code className="text-sky-300 font-mono">flush=True</code> forces immediate screen rendering after every iteration.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="font-semibold text-white font-mono">range(x + 1)</span>
                <p className="text-slate-400">
                  Python ranges are zero-indexed and exclusive of the stop value. To count up to and including the number <code className="text-sky-300 font-mono">x</code>, <code className="text-sky-300 font-mono">range(x + 1)</code> generates numbers from <code className="text-sky-300 font-mono">0</code> to <code className="text-sky-300 font-mono">x</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
