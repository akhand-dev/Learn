import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  FileCode,
  Layers,
  FileText,
  User,
  ArrowRight,
  BookOpen,
  Check
} from 'lucide-react';

interface PrintMasteryLabProps {
  onFileWriteTriggered?: (filename: string, content: string) => void;
  virtualFiles: Record<string, string>;
}

export const PrintMasteryLab: React.FC<PrintMasteryLabProps> = ({
  onFileWriteTriggered,
  virtualFiles,
}) => {
  const [activeSection, setActiveSection] = useState<
    'sep' | 'end' | 'file' | 'flush' | 'fstrings' | 'unpack' | 'str' | 'anatomy'
  >('sep');

  // Interactive State for 'sep'
  const [sepItems, setSepItems] = useState<string[]>(['2026', '10', '04']);
  const [selectedSep, setSelectedSep] = useState<string>('-');
  const [customSep, setCustomSep] = useState<string>('');

  // Interactive State for 'end'
  const [endParam1, setEndParam1] = useState<string>('... ');
  const [endParam2, setEndParam2] = useState<string>('\\n');

  // Interactive State for 'file'
  const [writtenSuccess, setWrittenSuccess] = useState<boolean>(false);
  const fileContentToWrite = "print('hello, it is created by start1.py')";

  // Interactive State for 'flush'
  const [flushSimulationRunning, setFlushSimulationRunning] = useState<boolean>(false);
  const [flushOutput, setFlushOutput] = useState<string>('');
  const [bufferedOutput, setBufferedOutput] = useState<string>('');

  // Interactive State for 'fstrings'
  const [fName, setFName] = useState<string>('Alice');
  const [fPrice, setFPrice] = useState<number>(48.9487);
  const [fDecimalPlaces, setFDecimalPlaces] = useState<number>(2);

  // Interactive State for 'unpack'
  const [unpackFruits] = useState<string[]>(['Apple', 'Banana', 'Cherry']);
  const [useUnpackAsterisk, setUseUnpackAsterisk] = useState<boolean>(true);
  const [unpackSep, setUnpackSep] = useState<string>(', ');

  // Interactive State for '__str__'
  const [playerUsername, setPlayerUsername] = useState<string>('ShadowNinja');
  const [playerLevel, setPlayerLevel] = useState<number>(42);
  const [hasStrMethod, setHasStrMethod] = useState<boolean>(true);

  // Handle Sep computation
  const effectiveSep = customSep !== '' ? customSep : selectedSep;
  const computedSepOutput = sepItems.join(
    effectiveSep === '\\n' ? '\n' : effectiveSep
  );

  // Trigger file write
  const handleWriteFile = () => {
    if (onFileWriteTriggered) {
      onFileWriteTriggered('create.py', fileContentToWrite);
    }
    setWrittenSuccess(true);
    setTimeout(() => setWrittenSuccess(false), 3000);
  };

  // Run Flush vs Buffered comparison
  const runFlushDemo = () => {
    setFlushSimulationRunning(true);
    setFlushOutput('');
    setBufferedOutput('(Waiting for loop to finish buffer...)');

    // Flushed: prints 0 immediately, then 1 after 500ms
    setFlushOutput('0 ');
    setTimeout(() => {
      setFlushOutput('0 1 ');
      setFlushSimulationRunning(false);
      // Buffered dumps all at once at the end
      setBufferedOutput('0 1 (All displayed at once after buffer flushed)');
    }, 700);
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-10 relative overflow-hidden shadow-xl">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400 mb-3">
            <Sparkles className="w-4 h-4" />
            <span>python/start1.py</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Python Print() Deep-Dive & Mechanics Lab
          </h2>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Every feature from Akhand’s <code className="text-indigo-300 font-mono">start1.py</code> made fully interactive. Discover how Python controls argument separation, newlines, buffer flushing, file streams, F-string interpolation, unpacking operators, and OOP object string representation.
          </p>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'sep', label: '1. Sep (Separator)', icon: Sliders },
          { id: 'end', label: '2. End Parameter', icon: ArrowRight },
          { id: 'file', label: '3. File Redirection', icon: FileCode },
          { id: 'flush', label: '4. Buffer & Flush', icon: Layers },
          { id: 'fstrings', label: '5. F-Strings (Python 3.6+)', icon: Sparkles },
          { id: 'unpack', label: '6. Unpack Operator (*)', icon: FileText },
          { id: 'str', label: '7. __str__ in Classes', icon: User },
          { id: 'anatomy', label: '8. Complete Signature', icon: BookOpen },
        ].map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-10 shadow-xl">
        {/* 1. SEP PARAMETER */}
        {activeSection === 'sep' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>The <code className="text-sky-400 font-mono">sep</code> Parameter</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                By default, <code className="text-slate-200 font-mono">print()</code> places a space between multiple items. You can override it with any character string, newline (<code className="text-slate-200 font-mono">\n</code>), path delimiter (<code className="text-slate-200 font-mono">/</code>), or empty string (<code className="text-slate-200 font-mono">""</code>).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Controls */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Input Objects to Print:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sepItems.map((item, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const updated = [...sepItems];
                          updated[idx] = e.target.value;
                          setSepItems(updated);
                        }}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white w-24 focus:border-sky-500 focus:outline-none"
                      />
                    ))}
                    <button
                      onClick={() => setSepItems([...sepItems, `item${sepItems.length + 1}`])}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700 cursor-pointer"
                    >
                      + Add
                    </button>
                    {sepItems.length > 2 && (
                      <button
                        onClick={() => setSepItems(sepItems.slice(0, -1))}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded-lg border border-slate-700 cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Examples from start1.py:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Hyphen date ("-")', val: '-', items: ['2026', '10', '04'] },
                      { label: 'Path slash ("/")', val: '/', items: ['Home', 'user', 'documents'] },
                      { label: 'Newline ("\\n")', val: '\\n', items: ['x=2', 'y=3', 'z=4'] },
                      { label: 'No space ("")', val: '', items: ['akhand', 'pratap', 'singh'] },
                      { label: 'Default Space (" ")', val: ' ', items: ['Age:', '25', 'Status:', 'True'] },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => {
                          setSelectedSep(opt.val);
                          setCustomSep('');
                          setSepItems(opt.items);
                        }}
                        className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                          selectedSep === opt.val && customSep === ''
                            ? 'bg-sky-500/15 border-sky-500/40 text-sky-200'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="font-semibold text-white">{opt.label}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                          sep='{opt.val}'
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Or Enter Custom Separator:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. | or 🚀 or ::"
                    value={customSep}
                    onChange={(e) => setCustomSep(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Live Output */}
              <div className="space-y-4">
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4">
                  <div className="text-xs text-slate-500 font-mono mb-1">Python Code:</div>
                  <pre className="text-xs text-amber-300 font-mono overflow-x-auto whitespace-pre-wrap">
                    print({sepItems.map((i) => `"${i}"`).join(', ')}, sep="{effectiveSep}")
                  </pre>
                </div>

                <div className="bg-black/70 rounded-xl border border-slate-800 p-4 min-h-[140px]">
                  <div className="text-xs text-slate-500 font-mono mb-2 flex items-center justify-between">
                    <span>Terminal stdout:</span>
                    <span className="text-[10px] text-slate-500">separator: "{effectiveSep}"</span>
                  </div>
                  <pre className="text-sm font-mono text-emerald-400 whitespace-pre-wrap">
                    {computedSepOutput}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. END PARAMETER */}
        {activeSection === 'end' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>The <code className="text-sky-400 font-mono">end</code> Parameter</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                By default, <code className="text-slate-200 font-mono">print()</code> appends <code className="text-slate-200 font-mono">\n</code> at the end. Overriding <code className="text-slate-200 font-mono">end</code> keeps subsequent outputs on the same line.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Statement 1: <code className="text-sky-400 font-mono">print("Loading", end=...)</code>
                  </label>
                  <div className="flex gap-2">
                    {['... ', ' -> ', ' [WAIT] ', '\\n'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setEndParam1(val)}
                        className={`px-3 py-1.5 text-xs font-mono rounded-lg border cursor-pointer transition ${
                          endParam1 === val
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-bold'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        "{val}"
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Statement 2: <code className="text-sky-400 font-mono">print("Done!", end=...)</code>
                  </label>
                  <div className="flex gap-2">
                    {['\\n', ' (Finished)\\n', ' 🎉\\n'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setEndParam2(val)}
                        className={`px-3 py-1.5 text-xs font-mono rounded-lg border cursor-pointer transition ${
                          endParam2 === val
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-bold'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        "{val}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Output Preview */}
              <div className="space-y-4">
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4">
                  <div className="text-xs text-slate-500 font-mono mb-1">Python Code:</div>
                  <pre className="text-xs text-amber-300 font-mono whitespace-pre-wrap">
                    {`print("Loading", end="${endParam1}")
print("Done!"${endParam2 !== '\\n' ? `, end="${endParam2}"` : ''})`}
                  </pre>
                </div>

                <div className="bg-black/70 rounded-xl border border-slate-800 p-4 min-h-[120px]">
                  <div className="text-xs text-slate-500 font-mono mb-2">Terminal stdout:</div>
                  <pre className="text-sm font-mono text-emerald-400 whitespace-pre-wrap">
                    {endParam1 === '\\n' ? `Loading\nDone!` : `Loading${endParam1}Done!`}
                  </pre>
                  <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
                    {endParam1 === '\\n'
                      ? 'Because end="\\n", the two print statements appear on separate lines.'
                      : 'Because end is overridden, the second print prints directly adjacent to the first!'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. FILE REDIRECTION */}
        {activeSection === 'file' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>The <code className="text-sky-400 font-mono">file</code> Parameter (Output Redirection)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                By default, <code className="text-slate-200 font-mono">print()</code> sends text to <code className="text-sky-300 font-mono">sys.stdout</code> (the terminal). By passing a file handle, you can write directly to files like <code className="text-sky-300 font-mono">create.py</code>!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="text-xs font-semibold text-slate-300">
                    Akhand's original code in <code className="text-sky-400 font-mono">start1.py</code>:
                  </div>
                  <pre className="text-xs font-mono text-amber-300 bg-slate-900 p-3 rounded-lg border border-slate-800 whitespace-pre">
{`# Writing output directly to a file
with open('create.py', 'w') as py:
    print("print('hello, it is created by start1.py')", file=py)`}
                  </pre>

                  <button
                    onClick={handleWriteFile}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-sky-500/20 transition cursor-pointer"
                  >
                    {writtenSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>File Written Successfully!</span>
                      </>
                    ) : (
                      <>
                        <FileCode className="w-4 h-4" />
                        <span>Execute: Write to 'create.py' via print(..., file=py)</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-800/40 text-xs text-sky-300 space-y-1">
                  <div className="font-semibold">How it works under the hood:</div>
                  <p className="text-slate-300">
                    Python calls <code className="text-white font-mono">file.write(str)</code> internally. When the <code className="text-white font-mono">with</code> block exits, Python automatically flushes and closes the file handle safely.
                  </p>
                </div>
              </div>

              {/* Resulting File Inspector */}
              <div className="space-y-4">
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-slate-400 font-semibold flex items-center space-x-1.5">
                      <FileText className="w-3.5 h-3.5 text-sky-400" />
                      <span>virtual /create.py</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Generated File
                    </span>
                  </div>
                  <pre className="text-xs font-mono text-emerald-300 bg-black/60 p-3 rounded-lg border border-slate-800 whitespace-pre">
                    {virtualFiles['create.py'] || fileContentToWrite}
                  </pre>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4">
                  <div className="text-xs text-slate-400 font-mono mb-1">
                    Running the generated file ($ python create.py):
                  </div>
                  <div className="text-sm font-mono text-amber-300 bg-black/60 p-3 rounded-lg border border-slate-800">
                    hello, it is created by start1.py
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. BUFFER & FLUSH */}
        {activeSection === 'flush' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>The <code className="text-sky-400 font-mono">flush</code> Parameter (Buffer Control)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Python usually "buffers" text output for performance reasons, meaning it waits until it has a full chunk before rendering. Setting <code className="text-sky-300 font-mono">flush=True</code> clears the buffer immediately.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="text-xs font-semibold text-slate-300">
                    Code from <code className="text-sky-400 font-mono">start1.py</code>:
                  </div>
                  <pre className="text-xs font-mono text-amber-300 bg-slate-900 p-3 rounded-lg border border-slate-800 whitespace-pre">
{`import time

for i in range(2):
    print(i, end=" ", flush=True) # Forces immediate display
    time.sleep(0.5)`}
                  </pre>

                  <button
                    onClick={runFlushDemo}
                    disabled={flushSimulationRunning}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition cursor-pointer disabled:opacity-50"
                  >
                    <Layers className="w-4 h-4" />
                    <span>{flushSimulationRunning ? 'Running Buffer Stream...' : 'Compare Flush vs Buffered'}</span>
                  </button>
                </div>
              </div>

              {/* Side by side comparison */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30">
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-2">
                    <span className="font-bold">With flush=True (Immediate)</span>
                    {flushSimulationRunning && <span className="animate-pulse">Active Stream</span>}
                  </div>
                  <div className="font-mono text-sm text-emerald-300 min-h-[30px] flex items-center">
                    {flushOutput || <span className="text-slate-600 italic">Click above to run stream</span>}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30">
                  <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-2">
                    <span className="font-bold">Default flush=False (Buffered)</span>
                    <span className="text-[10px] text-slate-500">Waits for buffer</span>
                  </div>
                  <div className="font-mono text-xs text-amber-200/90 min-h-[30px] flex items-center">
                    {bufferedOutput || <span className="text-slate-600 italic">Click above to run stream</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. F-STRINGS */}
        {activeSection === 'fstrings' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>F-Strings (Python 3.6+ Formatted String Literals)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Modern Python uses <code className="text-sky-300 font-mono">f"..."</code> strings to evaluate variables and format decimal numbers directly inside curly braces <code className="text-sky-300 font-mono">{"{}"}</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Variable <code className="text-sky-400 font-mono">name</code>:
                    </label>
                    <input
                      type="text"
                      value={fName}
                      onChange={(e) => setFName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Variable <code className="text-sky-400 font-mono">price</code> (float):
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={fPrice}
                      onChange={(e) => setFPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Float Precision Specifier (<code className="text-sky-400 font-mono">:.{fDecimalPlaces}f</code>):
                    </label>
                    <div className="flex gap-2">
                      {[0, 1, 2, 3, 4].map((dp) => (
                        <button
                          key={dp}
                          onClick={() => setFDecimalPlaces(dp)}
                          className={`px-3 py-1 text-xs font-mono rounded-lg border cursor-pointer ${
                            fDecimalPlaces === dp
                              ? 'bg-sky-500 text-slate-950 font-bold border-sky-400'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                          }`}
                        >
                          .{dp}f
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Output */}
              <div className="space-y-4">
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4">
                  <div className="text-xs text-slate-500 font-mono mb-1">Python F-String Code:</div>
                  <pre className="text-xs font-mono text-amber-300 bg-slate-900 p-3 rounded-lg border border-slate-800 whitespace-pre-wrap">
{`name = "${fName}"
price = ${fPrice}

print(f"Hello {name}, your total is \${price:.${fDecimalPlaces}f}")`}
                  </pre>
                </div>

                <div className="bg-black/70 rounded-xl border border-slate-800 p-4 min-h-[100px]">
                  <div className="text-xs text-slate-500 font-mono mb-2">Evaluated Output:</div>
                  <div className="text-base font-mono text-emerald-400 font-bold">
                    Hello {fName}, your total is ${fPrice.toFixed(fDecimalPlaces)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. UNPACK OPERATOR (*) */}
        {activeSection === 'unpack' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>The Unpack Operator (<code className="text-sky-400 font-mono">*</code>) on Lists</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                In Python, <code className="text-sky-300 font-mono">print(fruits, sep='-')</code> does NOT separate items because the entire list is passed as a single argument. You must unpack it with <code className="text-sky-300 font-mono">*fruits</code>!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Fruit List Items:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {unpackFruits.map((fruit, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-slate-900 text-sky-300 font-mono text-xs rounded-lg border border-slate-700"
                      >
                        {fruit}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="text-xs font-semibold text-slate-300 block mb-2">
                      Separator:
                    </label>
                    <div className="flex gap-2">
                      {[', ', ' - ', ' | ', ' 🍉 '].map((s) => (
                        <button
                          key={s}
                          onClick={() => setUnpackSep(s)}
                          className={`px-3 py-1 text-xs font-mono rounded-lg border cursor-pointer ${
                            unpackSep === s
                              ? 'bg-sky-500 text-slate-950 font-bold'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                          }`}
                        >
                          "{s}"
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-300">Toggle Unpack Asterisk (*):</span>
                    <button
                      onClick={() => setUseUnpackAsterisk(!useUnpackAsterisk)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                        useUnpackAsterisk
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {useUnpackAsterisk ? '*fruits (Unpacked)' : 'fruits (Raw List)'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Output Comparison */}
              <div className="space-y-4">
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4">
                  <div className="text-xs text-slate-500 font-mono mb-1">Code Executed:</div>
                  <pre className="text-xs font-mono text-amber-300 bg-slate-900 p-3 rounded-lg border border-slate-800 whitespace-pre-wrap">
                    {useUnpackAsterisk
                      ? `print(*fruits, sep="${unpackSep}")`
                      : `print(fruits, sep="${unpackSep}") # will not separate individual items!`}
                  </pre>
                </div>

                <div className="bg-black/70 rounded-xl border border-slate-800 p-4 min-h-[110px]">
                  <div className="text-xs text-slate-500 font-mono mb-2">Terminal stdout:</div>
                  <pre className="text-sm font-mono text-emerald-400">
                    {useUnpackAsterisk
                      ? unpackFruits.join(unpackSep)
                      : JSON.stringify(unpackFruits).replace(/"/g, "'")}
                  </pre>
                  <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
                    {useUnpackAsterisk
                      ? '✓ Elements unpacked into individual arguments, so sep takes effect between them!'
                      : '✗ The list is passed as a single object, so sep has nothing to separate!'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. __STR__ IN CLASSES */}
        {activeSection === 'str' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Customizing How Objects Print (<code className="text-sky-400 font-mono">__str__</code>)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                When you pass a custom object (like a class instance) to <code className="text-slate-200 font-mono">print()</code>, Python displays a generic memory address unless you implement the <code className="text-sky-300 font-mono">__str__</code> dunder method.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Player Username:
                    </label>
                    <input
                      type="text"
                      value={playerUsername}
                      onChange={(e) => setPlayerUsername(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Player Level:
                    </label>
                    <input
                      type="number"
                      value={playerLevel}
                      onChange={(e) => setPlayerLevel(parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-300">Include <code className="text-sky-400 font-mono">def __str__(self):</code>:</span>
                    <button
                      onClick={() => setHasStrMethod(!hasStrMethod)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                        hasStrMethod
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {hasStrMethod ? 'With __str__' : 'Without __str__'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Output Preview */}
              <div className="space-y-4">
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4">
                  <div className="text-xs text-slate-500 font-mono mb-1">Class Definition:</div>
                  <pre className="text-xs font-mono text-amber-300 bg-slate-900 p-3 rounded-lg border border-slate-800 whitespace-pre">
{`class Player:
    def __init__(self, username, level):
        self.username = username
        self.level = level
${hasStrMethod ? `        
    def __str__(self):
        return f"Player: {self.username} (Level {self.level})"` : '    # No __str__ method defined'}

p = Player("${playerUsername}", ${playerLevel})
print(p)`}
                  </pre>
                </div>

                <div className="bg-black/70 rounded-xl border border-slate-800 p-4 min-h-[90px]">
                  <div className="text-xs text-slate-500 font-mono mb-2">Terminal stdout:</div>
                  <div className="text-sm font-mono text-emerald-400 font-bold">
                    {hasStrMethod
                      ? `Player: ${playerUsername} (Level ${playerLevel})`
                      : `<__main__.Player object at 0x7f8b1a4c9e50>`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8. COMPLETE ANATOMY */}
        {activeSection === 'anatomy' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Anatomy of Python's <code className="text-sky-400 font-mono">print()</code> Function</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                The full Python specification from the bottom of <code className="text-slate-200 font-mono">start1.py</code>:
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <pre className="text-sm sm:text-base font-mono text-sky-300 text-center py-2 overflow-x-auto whitespace-pre">
                print(*objects, sep=' ', end='\n', file=sys.stdout, flush=False)
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  param: '*objects',
                  type: 'Positional Variable Args',
                  default: 'Required/Optional',
                  desc: 'Zero or more values to be printed. Any type is automatically converted to string via __str__.',
                },
                {
                  param: "sep=' '",
                  type: 'Keyword String',
                  default: 'Single space (" ")',
                  desc: 'String inserted between multiple objects passed into *objects.',
                },
                {
                  param: "end='\\n'",
                  type: 'Keyword String',
                  default: 'Newline ("\\n")',
                  desc: 'String appended after the last value. Set to empty or spaces for continuous progress logs.',
                },
                {
                  param: 'file=sys.stdout',
                  type: 'File Stream Object',
                  default: 'sys.stdout (Terminal)',
                  desc: 'Stream to which output is written (e.g. open file handles or sys.stderr for error logs).',
                },
                {
                  param: 'flush=False',
                  type: 'Boolean',
                  default: 'False (Buffered)',
                  desc: 'Whether to forcibly flush the stream buffer immediately to screen or disk.',
                },
              ].map((item) => (
                <div
                  key={item.param}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5"
                >
                  <div className="font-mono text-xs font-bold text-amber-300">{item.param}</div>
                  <div className="text-[11px] text-slate-400">{item.type}</div>
                  <div className="text-[10px] text-sky-400/80 font-mono">Default: {item.default}</div>
                  <p className="text-xs text-slate-300 pt-1 border-t border-slate-800/60">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
