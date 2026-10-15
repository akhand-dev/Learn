import React, { useState } from 'react';
import {
  Binary,
  Calculator,
  RefreshCw,
  Play,
  RotateCcw,
  Sparkles,
  Package,
  Database,
  Quote
} from 'lucide-react';
import { PYTHON_JOKES } from '../data/scriptsData';

export const OperatorsDataLab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'arithmetic' | 'assignment' | 'ecosystem' | 'dictionaries'>('arithmetic');

  // 1. Arithmetic Inputs
  const [valA, setValA] = useState<number>(10);
  const [valB, setValB] = useState<number>(10);

  // 2. Assignment Step-by-Step Simulation
  // c = 10; p(c) -> c += 10; p(c) -> c -= 10; print(c) -> c *= 10; p(c) -> c /= 10; p(c)
  const [assignmentStep, setAssignmentStep] = useState<number>(0);
  const [customInitC] = useState<number>(10);

  // 3. User Input Demo
  const [userNameInput, setUserNameInput] = useState<string>('Akhand');

  // 4. Pyjokes simulation
  const [currentJoke, setCurrentJoke] = useState<string>(PYTHON_JOKES[0]);

  // 5. Dictionary Explorer
  const [dictMethods, setDictMethods] = useState<Record<string, string>>({
    method1: 'items()',
    method2: 'keys()',
    method3: 'values()',
    method4: 'get()',
  });
  const [newKey, setNewKey] = useState<string>('');
  const [newVal, setNewVal] = useState<string>('');

  // Compute steps for Assignment Tracker
  const computeAssignmentSteps = (init: number) => {
    let current = init;
    const steps = [
      { step: 1, code: `c = ${init}`, action: 'Initialization', value: current, output: current },
      { step: 2, code: 'p(c)', action: 'Call helper function p(c)', value: current, output: current },
      { step: 3, code: 'c += 10', action: 'Addition assignment (c = c + 10)', value: (current += 10), output: null },
      { step: 4, code: 'p(c)', action: 'Print updated c', value: current, output: current },
      { step: 5, code: 'c -= 10', action: 'Subtraction assignment (c = c - 10)', value: (current -= 10), output: null },
      { step: 6, code: 'print(c)', action: 'Standard print(c)', value: current, output: current },
      { step: 7, code: 'c *= 10', action: 'Multiplication assignment (c = c * 10)', value: (current *= 10), output: null },
      { step: 8, code: 'p(c)', action: 'Print updated c', value: current, output: current },
      { step: 9, code: 'c /= 10', action: 'Division assignment (c = c / 10, yields float)', value: (current /= 10), output: null },
      { step: 10, code: 'p(c)', action: 'Print final float', value: current, output: current },
    ];
    return steps;
  };

  const assignmentStepsList = computeAssignmentSteps(customInitC);
  const currentStepData = assignmentStepsList[assignmentStep] || assignmentStepsList[0];

  const handleNextStep = () => {
    if (assignmentStep < assignmentStepsList.length - 1) {
      setAssignmentStep((prev) => prev + 1);
    }
  };

  const handleResetSteps = () => {
    setAssignmentStep(0);
  };

  const getNewJoke = () => {
    const random = PYTHON_JOKES[Math.floor(Math.random() * PYTHON_JOKES.length)];
    setCurrentJoke(random);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono mb-3">
            <Binary className="w-3.5 h-3.5" />
            <span>python/print.py</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Arithmetic, Assignment Operators & Python Ecosystem
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Directly ported from Akhand’s <code className="text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded font-mono">print.py</code>: interactive arithmetic evaluation, step-by-step variable mutation debugger, interactive dictionary inspection, and pip package integrations.
          </p>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'arithmetic', label: '1. Arithmetic Operators', icon: Calculator },
          { id: 'assignment', label: '2. Assignment Mutation Stepper', icon: RefreshCw },
          { id: 'dictionaries', label: '3. Dictionaries & Methods', icon: Database },
          { id: 'ecosystem', label: '4. Pip & Modules (pyjokes, flask)', icon: Package },
        ].map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        {/* 1. ARITHMETIC OPERATORS */}
        {activeSection === 'arithmetic' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Arithmetic Operators (<code className="text-amber-400 font-mono">+, -, *, /, %, **</code>)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust <code className="text-slate-200 font-mono">a</code> and <code className="text-slate-200 font-mono">b</code> to see Python's exact evaluation logic.
                </p>
              </div>

              {/* Editable inputs */}
              <div className="flex items-center space-x-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-mono text-slate-400">a =</span>
                  <input
                    type="number"
                    value={valA}
                    onChange={(e) => setValA(parseFloat(e.target.value) || 0)}
                    className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-white text-center focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-mono text-slate-400">b =</span>
                  <input
                    type="number"
                    value={valB}
                    onChange={(e) => setValB(parseFloat(e.target.value) || 0)}
                    className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-white text-center focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    setValA(10);
                    setValB(10);
                  }}
                  className="px-2 py-1 text-[11px] font-mono text-slate-400 hover:text-white bg-slate-800 rounded-md cursor-pointer"
                >
                  Reset (10, 10)
                </button>
              </div>
            </div>

            {/* Grid of Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  label: 'Addition',
                  code: 'print(a + b)',
                  calc: `${valA} + ${valB}`,
                  result: valA + valB,
                  type: Number.isInteger(valA + valB) ? 'int' : 'float',
                  desc: 'Sum of two operands.',
                },
                {
                  label: 'Subtraction',
                  code: 'print(a - b)',
                  calc: `${valA} - ${valB}`,
                  result: valA - valB,
                  type: Number.isInteger(valA - valB) ? 'int' : 'float',
                  desc: 'Difference of two operands.',
                },
                {
                  label: 'Multiplication',
                  code: 'print(a * b)',
                  calc: `${valA} * ${valB}`,
                  result: valA * valB,
                  type: Number.isInteger(valA * valB) ? 'int' : 'float',
                  desc: 'Product of two operands.',
                },
                {
                  label: 'True Division',
                  code: 'print(a / b)',
                  calc: `${valA} / ${valB}`,
                  result: valB === 0 ? 'ZeroDivisionError' : valA / valB,
                  type: 'float (always in Python 3)',
                  desc: 'Returns a floating point result in Python 3.',
                },
                {
                  label: 'Remainder (Modulo)',
                  code: "print('remainder', a % b)",
                  calc: `${valA} % ${valB}`,
                  result: valB === 0 ? 'ZeroDivisionError' : valA % valB,
                  type: 'int / float',
                  desc: 'Remainder of division of left operand by right.',
                },
                {
                  label: 'Exponentiation',
                  code: "print('expo', a ** b)",
                  calc: `${valA} ** ${valB}`,
                  result: Math.abs(valB) > 20 ? 'Too large to display' : Math.pow(valA, valB),
                  type: 'int / float',
                  desc: 'Left operand raised to the power of right.',
                },
              ].map((op) => (
                <div
                  key={op.label}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">{op.label}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {op.type}
                    </span>
                  </div>

                  <div className="font-mono text-xs text-amber-300 bg-slate-900 p-2 rounded border border-slate-850">
                    {op.code}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-mono text-slate-400">{op.calc} =</span>
                    <span className="text-base font-bold font-mono text-emerald-400">
                      {typeof op.result === 'number' ? op.result : String(op.result)}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-800/80">
                    {op.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Primitive Types Reference */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-semibold text-slate-300 mb-2">
                Python Primitive Data Types (from comment in <code className="text-amber-400 font-mono">print.py</code>: <span className="text-slate-400">--int, float, bool, None</span>)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-sky-400 font-bold">int</div>
                  <div className="text-slate-400 text-[11px]">e.g. 10, -5, 42</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-emerald-400 font-bold">float</div>
                  <div className="text-slate-400 text-[11px]">e.g. 10.0, 48.9487</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-amber-400 font-bold">bool</div>
                  <div className="text-slate-400 text-[11px]">True, False</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-purple-400 font-bold">NoneType</div>
                  <div className="text-slate-400 text-[11px]">None</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. ASSIGNMENT STEPPER */}
        {activeSection === 'assignment' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Assignment Operators Debugger (<code className="text-amber-400 font-mono">+=, -=, *=, /=</code>)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Step through lines 16–30 of <code className="text-slate-200 font-mono">print.py</code> to inspect in-place memory mutation.
                </p>
              </div>

              {/* Stepper controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleResetSteps}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center space-x-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart</span>
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={assignmentStep >= assignmentStepsList.length - 1}
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>Step Next Line</span>
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Steps timeline (7 cols) */}
              <div className="lg:col-span-7 space-y-2">
                {assignmentStepsList.map((item, idx) => {
                  const isCurrent = assignmentStep === idx;
                  const isPast = assignmentStep > idx;
                  return (
                    <div
                      key={item.step}
                      onClick={() => setAssignmentStep(idx)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'bg-amber-500/15 border-amber-500/50 shadow-md shadow-amber-500/10'
                          : isPast
                          ? 'bg-slate-950/40 border-slate-800 text-slate-300'
                          : 'bg-slate-950/20 border-slate-850 opacity-40 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                            isCurrent
                              ? 'bg-amber-500 text-slate-950'
                              : isPast
                              ? 'bg-slate-800 text-slate-400'
                              : 'bg-slate-900 text-slate-600'
                          }`}
                        >
                          {item.step}
                        </span>
                        <div>
                          <div className="font-mono text-xs font-bold text-white">{item.code}</div>
                          <div className="text-[11px] text-slate-400">{item.action}</div>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <div className="text-xs text-amber-300 font-semibold">
                          c = {item.value}
                        </div>
                        {item.output !== null && (
                          <div className="text-[10px] text-emerald-400">prints: {item.output}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* State Inspector Card (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                  <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center justify-between">
                    <span>Variable State Inspector</span>
                    <span className="font-mono text-amber-400">
                      Step {assignmentStep + 1} / {assignmentStepsList.length}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-mono">Variable c:</span>
                      <div className="text-3xl font-extrabold font-mono text-amber-400 mt-1">
                        {currentStepData.value}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 font-mono">Type:</span>
                      <div className="text-sm font-bold font-mono text-sky-400 mt-1">
                        {Number.isInteger(currentStepData.value) ? 'int' : 'float'}
                      </div>
                    </div>
                  </div>

                  {/* Terminal stdout up to current step */}
                  <div>
                    <div className="text-xs text-slate-400 font-mono mb-2">Terminal stdout log:</div>
                    <div className="bg-black/60 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 min-h-[100px]">
                      {assignmentStepsList
                        .slice(0, assignmentStep + 1)
                        .filter((s) => s.output !== null)
                        .map((s, i) => (
                          <div key={i}>{s.output}</div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. DICTIONARIES & METHODS */}
        {activeSection === 'dictionaries' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Dictionaries (<code className="text-amber-400 font-mono">dict</code>)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                From comment in <code className="text-slate-200 font-mono">print.py</code>: <span className="text-slate-300 italic">"dictories - unordered , mutable, indexed key_value. methods = ['method1':'items()','method2':'keys()']"</span>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Dictionary Viewer & Editor (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="text-xs font-semibold text-slate-300">Live Dictionary Key-Value Pairs:</div>
                  <div className="space-y-2">
                    {Object.entries(dictMethods).map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-amber-300">"{k}"</span>
                          <span className="text-slate-500">:</span>
                          <span className="text-emerald-300">"{v}"</span>
                        </div>
                        <button
                          onClick={() => {
                            const updated = { ...dictMethods };
                            delete updated[k];
                            setDictMethods(updated);
                          }}
                          className="text-slate-500 hover:text-rose-400 text-xs cursor-pointer px-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add key value */}
                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                    <input
                      type="text"
                      placeholder="key (e.g. method5)"
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white flex-1 focus:border-amber-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="value (e.g. pop())"
                      value={newVal}
                      onChange={(e) => setNewVal(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white flex-1 focus:border-amber-400 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (newKey.trim()) {
                          setDictMethods({ ...dictMethods, [newKey.trim()]: newVal.trim() || 'default' });
                          setNewKey('');
                          setNewVal('');
                        }
                      }}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg cursor-pointer whitespace-nowrap"
                    >
                      + Add Pair
                    </button>
                  </div>
                </div>
              </div>

              {/* Dict Methods Tester (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
                  <div className="text-xs font-semibold text-slate-300">Dictionary Built-in Methods:</div>

                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <div className="font-mono text-amber-300 font-semibold mb-1">methods.keys()</div>
                      <div className="font-mono text-emerald-400 text-[11px] bg-black/40 p-2 rounded">
                        dict_keys([{Object.keys(dictMethods).map((k) => `'${k}'`).join(', ')}])
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <div className="font-mono text-amber-300 font-semibold mb-1">methods.values()</div>
                      <div className="font-mono text-emerald-400 text-[11px] bg-black/40 p-2 rounded">
                        dict_values([{Object.values(dictMethods).map((v) => `'${v}'`).join(', ')}])
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <div className="font-mono text-amber-300 font-semibold mb-1">methods.items()</div>
                      <div className="font-mono text-emerald-400 text-[11px] bg-black/40 p-2 rounded">
                        dict_items([{Object.entries(dictMethods).map(([k, v]) => `('${k}', '${v}')`).join(', ')}])
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. PIP & MODULES */}
        {activeSection === 'ecosystem' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Modules & The Python Package Index (<code className="text-amber-400 font-mono">pip</code>)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                From notes in <code className="text-slate-200 font-mono">print.py</code>: <span className="text-slate-300 italic">"#module -- code written to be reused. #pip -- python install manager -- pip install flask, pip install pyjokes, pip pyttsx3"</span>
              </p>
            </div>

            {/* Pyjokes live generator */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>pip install pyjokes (Interactive Simulator)</span>
                </div>
                <button
                  onClick={getNewJoke}
                  className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>pyjokes.get_joke()</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-slate-800 flex items-start space-x-3">
                <Quote className="w-5 h-5 text-amber-400/80 shrink-0 mt-0.5" />
                <p className="font-mono text-sm text-amber-200 italic leading-relaxed">
                  "{currentJoke}"
                </p>
              </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  pkg: 'flask',
                  cmd: 'pip install flask',
                  desc: 'Lightweight WSGI web application framework for building web servers and REST APIs in Python.',
                  code: 'from flask import Flask\napp = Flask(__name__)\n\n@app.route("/")\ndef home():\n    return "Hello World!"',
                },
                {
                  pkg: 'pyjokes',
                  cmd: 'pip install pyjokes',
                  desc: 'One line joke generator for programmers, geeks, and developers.',
                  code: 'import pyjokes\njoke = pyjokes.get_joke()\nprint(joke)',
                },
                {
                  pkg: 'pyttsx3',
                  cmd: 'pip install pyttsx3',
                  desc: 'Text-to-speech conversion library that works offline and is compatible with both Python 2 and 3.',
                  code: 'import pyttsx3\nengine = pyttsx3.init()\nengine.say("Hello from Python")\nengine.runAndWait()',
                },
              ].map((m) => (
                <div
                  key={m.pkg}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-white text-sm">{m.pkg}</span>
                      <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
                        pip package
                      </span>
                    </div>
                    <code className="text-xs font-mono text-amber-400 bg-slate-900 px-2 py-1 rounded block">
                      $ {m.cmd}
                    </code>
                    <p className="text-xs text-slate-400">{m.desc}</p>
                  </div>

                  <pre className="text-[11px] font-mono text-slate-300 bg-slate-900/90 p-2.5 rounded-lg border border-slate-850 mt-2 overflow-x-auto whitespace-pre">
                    {m.code}
                  </pre>
                </div>
              ))}
            </div>

            {/* input('enter your name:') simulation */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-slate-300">
                Line 31: <code className="text-amber-400 font-mono">x = input('enter your name:')</code>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Enter your name..."
                  value={userNameInput}
                  onChange={(e) => setUserNameInput(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-amber-400 focus:outline-none w-64"
                />
                <span className="text-xs font-mono text-emerald-400">
                  Variable x stored value: <span className="font-bold">"{userNameInput}"</span> (str)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
