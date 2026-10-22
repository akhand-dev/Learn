import React, { useState, useEffect, useRef } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode,
  Play,
  Save,
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
  Terminal,
  BookOpen,
  Sparkles,
  Search,
  Layers,
  FilePlus,
  Eye,
  X,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeft,
  PanelBottomClose,
  PanelBottom,
  ChevronRight,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { VirtualFile, FolderType } from '../../types/editor';
import { virtualWorkspace } from '../../services/virtualWorkspace';

interface VSCodeIDEProps {
  initialFileId?: string;
}

export const VSCodeIDE: React.FC<VSCodeIDEProps> = ({ initialFileId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [files, setFiles] = useState<VirtualFile[]>(() => virtualWorkspace.getFiles());
  const [openFileIds, setOpenFileIds] = useState<string[]>(() => {
    const all = virtualWorkspace.getFiles();
    const target = initialFileId || (all.length > 0 ? all[0].id : '');
    return target ? [target] : [];
  });
  const [activeFileId, setActiveFileId] = useState<string>(() => {
    const all = virtualWorkspace.getFiles();
    return initialFileId || (all.length > 0 ? all[0].id : '');
  });

  // Editor content states (id -> edited content)
  const [editorContents, setEditorContents] = useState<Record<string, string>>({});
  const [dirtyFiles, setDirtyFiles] = useState<Record<string, boolean>>({});

  // Layout Controls (Full Screen, Collapsible Sidebar, Collapsible Bottom Panel)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState<boolean>(false);
  const [panelHeight, setPanelHeight] = useState<'compact' | 'normal' | 'expanded'>('normal');

  // Quick Open (Ctrl+P) Modal State
  const [isQuickOpenOpen, setIsQuickOpenOpen] = useState<boolean>(false);
  const [quickOpenQuery, setQuickOpenQuery] = useState<string>('');

  // Explorer Folder Collapse States
  const [foldersOpen, setFoldersOpen] = useState<{ learned: boolean; projects: boolean; root: boolean }>({
    learned: true,
    projects: true,
    root: true,
  });

  // Activity Bar Active Tab: 'explorer' | 'search' | 'revise'
  const [activityTab, setActivityTab] = useState<'explorer' | 'search' | 'revise'>('explorer');

  // Search & Explorer filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [explorerFilter, setExplorerFilter] = useState<string>('');

  // Terminal Execution State
  const [bottomTab, setBottomTab] = useState<'terminal' | 'notes' | 'quiz'>('terminal');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  // New File Modal State
  const [isNewFileModalOpen, setIsNewFileModalOpen] = useState<boolean>(false);
  const [newFileFolder, setNewFileFolder] = useState<FolderType>('learned');
  const [newFileName, setNewFileName] = useState<string>('');
  const [newFileSummary, setNewFileSummary] = useState<string>('');

  // Feedback states
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [quizRevealed, setQuizRevealed] = useState<boolean>(false);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];
  const currentCode =
    activeFile && editorContents[activeFile.id] !== undefined
      ? editorContents[activeFile.id]
      : activeFile?.content || '';

  // Refresh files
  const refreshFiles = () => {
    const fresh = virtualWorkspace.getFiles();
    setFiles(fresh);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S / Cmd+S: Save
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveCurrentFile();
      }
      // F5: Run
      if (e.key === 'F5') {
        e.preventDefault();
        handleRunCurrentFile();
      }
      // Ctrl+B / Cmd+B: Toggle Sidebar
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
      }
      // Ctrl+P / Cmd+P: Quick Open
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsQuickOpenOpen((prev) => !prev);
      }
      // Ctrl+` / Cmd+`: Toggle Terminal
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setIsPanelCollapsed((prev) => !prev);
      }
      // F11: Toggle Fullscreen
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
      // Escape: Close Quick Open or Fullscreen
      if (e.key === 'Escape') {
        if (isQuickOpenOpen) {
          setIsQuickOpenOpen(false);
        } else if (isNewFileModalOpen) {
          setIsNewFileModalOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFileId, currentCode, isQuickOpenOpen, isNewFileModalOpen]);

  // Sync fullscreen state with browser events
  useEffect(() => {
    const handleFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => {
      const next = !prev;
      if (next) {
        try {
          if (containerRef.current?.requestFullscreen) {
            containerRef.current.requestFullscreen().catch(() => {});
          }
        } catch {
          // Graceful fallback to CSS full screen
        }
      } else {
        try {
          if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        } catch {
          // Fallback
        }
      }
      return next;
    });
  };

  // Open file handler
  const handleOpenFile = (file: VirtualFile) => {
    if (!openFileIds.includes(file.id)) {
      setOpenFileIds((prev) => [...prev, file.id]);
    }
    setActiveFileId(file.id);
    if (editorContents[file.id] === undefined) {
      setEditorContents((prev) => ({ ...prev, [file.id]: file.content }));
    }
    setQuizRevealed(false);
  };

  // Close tab handler
  const handleCloseTab = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    const nextOpen = openFileIds.filter((id) => id !== fileId);
    setOpenFileIds(nextOpen);
    if (activeFileId === fileId) {
      setActiveFileId(nextOpen.length > 0 ? nextOpen[nextOpen.length - 1] : '');
    }
  };

  // Editor code change handler
  const handleCodeChange = (val: string) => {
    if (!activeFile) return;
    setEditorContents((prev) => ({ ...prev, [activeFile.id]: val }));
    const isNowDirty = val !== activeFile.content;
    setDirtyFiles((prev) => ({ ...prev, [activeFile.id]: isNowDirty }));
  };

  // Save current file
  const handleSaveCurrentFile = () => {
    if (!activeFile) return;
    const contentToSave = editorContents[activeFile.id] ?? activeFile.content;
    const updated = virtualWorkspace.saveFileContent(activeFile.id, contentToSave);
    if (updated) {
      refreshFiles();
      setDirtyFiles((prev) => ({ ...prev, [activeFile.id]: false }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  // Run current Python file in terminal
  const handleRunCurrentFile = () => {
    if (!activeFile) return;
    setIsExecuting(true);
    setIsPanelCollapsed(false);
    setBottomTab('terminal');
    setTerminalOutput([`$ python3 ${activeFile.path}`]);

    const code = currentCode;
    const lines = code.split('\n');
    const outputs: string[] = [];

    // Realistic Python simulator by topic/file
    if (activeFile.name.includes('oop') || activeFile.name.includes('classes')) {
      outputs.push('Policy: Standard policy: 40 hours/week with flexible hours.');
      outputs.push('Akhand | Role: Software Engineer | Company: TechCorp Solutions | Salary: $85000');
      outputs.push('Sara | Role: DevOps Engineer | Company: TechCorp Solutions | Salary: $90000');
      outputs.push("Akhand's new salary: $93500");
      outputs.push('emp1 company (instance override): TechCorp AI Labs');
      outputs.push('emp2 company (retains class default): TechCorp Solutions');
      outputs.push('Total employees created: 2');
    } else if (activeFile.name.includes('file_io')) {
      outputs.push('--- File Content ---');
      outputs.push('Line 1');
      outputs.push('Line 2');
      outputs.push('Line 3 (Appended)');
    } else if (activeFile.name.includes('functions') || activeFile.name.includes('recursion')) {
      outputs.push('Hello, Akhand!');
      outputs.push('Hello, User!');
      outputs.push('Factorial of 5: 120');
    } else if (activeFile.name.includes('loops')) {
      outputs.push('While count: 0');
      outputs.push('While count: 1');
      outputs.push('While count: 2');
      outputs.push('For loop with range: 0');
      outputs.push('For loop with range: 2');
      outputs.push('For loop with range: 4');
      outputs.push('Item: 0');
      outputs.push('Item: 2');
      outputs.push('Item: 3');
    } else if (activeFile.name.includes('dictionaries_and_sets') || activeFile.name.includes('17_')) {
      outputs.push("Dict: {'name': 'Akhand', 'age': 25, 'city': 'Delhi'}, Name: Akhand, Missing: N/A");
      outputs.push('Set: {1, 2, 3, 4}');
      outputs.push('Union: {1, 2, 3, 4, 5}, Intersection: {3}');
    } else if (activeFile.name.includes('lists_and_tuples') || activeFile.name.includes('16_')) {
      outputs.push('List: [0, 1, 2, 3, 4], Sum: 10');
      outputs.push('Tuple: (10, 20, 30), Count of 10: 1');
      outputs.push('Unpacked: a=10, b=20, c=30');
    } else if (activeFile.name.includes('strings') || activeFile.name.includes('15_')) {
      outputs.push('First: P, Last: g');
      outputs.push('Slice (0-6): Python');
      outputs.push('Skip Slicing (every 2nd): PtoPormig');
      outputs.push('Reverse: gnimmargorPnohtyP');
      outputs.push('Length: 17');
      outputs.push("Find 'Gram': -1");
      outputs.push('Replace: JavaProgramming');
      outputs.push('Line1\nLine2');
      outputs.push('Tab\tTabbed');
    } else if (activeFile.name.includes('variables') || activeFile.name.includes('14_')) {
      outputs.push('Double is: 20');
      outputs.push("<class 'int'>");
    } else if (activeFile.name.includes('comments') || activeFile.name.includes('13_')) {
      outputs.push('This is a');
      outputs.push('multi-line string.');
      outputs.push('It will print exactly as formatted,');
      outputs.push('including newlines!');
    } else if (activeFile.name.includes('countdown')) {
      outputs.push('till what number do you want the countdown: 5');
      outputs.push('Starting countdown:');
      outputs.push('0...1...2...3...4...5...');
      outputs.push('Countdown finished successfully!');
    } else if (activeFile.name.includes('sep_parameter')) {
      outputs.push('2026-10-16');
      outputs.push('using the sep parameter:\n2\n3\n4');
      outputs.push('using no space234');
      outputs.push('Home/user/documents/python');
    } else if (activeFile.name.includes('end_parameter')) {
      outputs.push('Loading... Processing... Done!');
      outputs.push('Step 1 -> Step 2 -> Step 3 -> Step 4 -> Step 5 -> Complete!');
    } else if (activeFile.name.includes('file_redirection')) {
      outputs.push('Wrote code successfully to create.py using print(..., file=py)!');
      outputs.push('Notice: System initialized successfully.');
    } else if (activeFile.name.includes('buffer_flush')) {
      outputs.push('Streaming live progress: 0 1 2 3 4 ');
      outputs.push('Streaming complete!');
    } else if (activeFile.name.includes('fstrings')) {
      outputs.push('Hello Alice, your total is $48.95');
      outputs.push('hello akhand, your age score is 87.78 and next year it is 88.78');
    } else if (activeFile.name.includes('unpacking')) {
      outputs.push('Apple, Banana, Cherry');
    } else if (activeFile.name.includes('str_dunder')) {
      outputs.push('Player: ShadowNinja (Level 42)');
    } else if (activeFile.name.includes('arithmetic')) {
      outputs.push('Addition (+): 20');
      outputs.push('Subtraction (-): 0');
      outputs.push('Multiplication (*): 100');
      outputs.push('True Division (/): 1.0');
      outputs.push('Remainder (%): 0');
      outputs.push('Exponentiation (**): 10000000000');
    } else if (activeFile.name.includes('mutation') || activeFile.name.includes('assignment')) {
      outputs.push('Current value: 10');
      outputs.push('Current value: 20');
      outputs.push('10');
      outputs.push('Current value: 100');
      outputs.push('Current value: 10.0');
    } else if (activeFile.name.includes('dictionaries')) {
      outputs.push("Type: <class 'dict'>");
      outputs.push("Keys: dict_keys(['method1', 'method2', 'method3'])");
      outputs.push("Items: dict_items([('method1', 'items()'), ('method2', 'keys()'), ('method3', 'values()')])");
      outputs.push("Key 'method1' maps to method 'items()'");
      outputs.push("Key 'method2' maps to method 'keys()'");
      outputs.push("Key 'method3' maps to method 'values()'");
    } else if (activeFile.name.includes('calculator')) {
      outputs.push('=== PYTHON CALCULATOR PROJECT ===');
      outputs.push('15 + 4 = 19');
      outputs.push('15 - 4 = 11');
      outputs.push('15 * 4 = 60');
      outputs.push('15 / 4 = 3.75');
      outputs.push('15 % 4 = 3');
      outputs.push('15 ** 4 = 50625');
    } else {
      // General interpreter simulator: parses print(...) lines
      lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
          const inner = trimmed.slice(6, -1);
          if ((inner.startsWith('"') && inner.endsWith('"')) || (inner.startsWith("'") && inner.endsWith("'"))) {
            outputs.push(inner.slice(1, -1));
          } else if (inner.startsWith('f"') || inner.startsWith("f'")) {
            outputs.push(inner.slice(2, -1));
          } else {
            outputs.push(`[${inner}]`);
          }
        }
      });
      if (outputs.length === 0) {
        outputs.push('Program executed successfully with no output.');
      }
    }
    outputs.push('--- Process finished with exit code 0 ---');

    outputs.forEach((out, idx) => {
      setTimeout(() => {
        setTerminalOutput((prev) => [...prev, out]);
        if (idx === outputs.length - 1) {
          setIsExecuting(false);
          virtualWorkspace.recordRevision(activeFile.id);
          refreshFiles();
        }
      }, (idx + 1) * 120);
    });
  };

  // Create new file submit
  const handleCreateFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const created = virtualWorkspace.createFile(newFileFolder, newFileName.trim(), undefined, newFileSummary);
    refreshFiles();
    handleOpenFile(created);
    setIsNewFileModalOpen(false);
    setNewFileName('');
    setNewFileSummary('');
  };

  // Delete file
  const handleDeleteFile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this Python file from the workspace?')) {
      virtualWorkspace.deleteFile(id);
      refreshFiles();
      setOpenFileIds((prev) => prev.filter((openId) => openId !== id));
      if (activeFileId === id) {
        const remaining = files.filter((f) => f.id !== id);
        setActiveFileId(remaining.length > 0 ? remaining[0].id : '');
      }
    }
  };

  // Tab Key indentation support in textarea
  const handleKeyDownInTextarea = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;

      const updated = val.substring(0, start) + '    ' + val.substring(end);
      handleCodeChange(updated);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  // Filtered files for search & explorer
  const learnedFiles = files
    .filter((f) => f.folder === 'learned')
    .filter((f) => (explorerFilter ? f.name.toLowerCase().includes(explorerFilter.toLowerCase()) : true));
  const projectFiles = files
    .filter((f) => f.folder === 'projects')
    .filter((f) => (explorerFilter ? f.name.toLowerCase().includes(explorerFilter.toLowerCase()) : true));
  const rootFiles = files
    .filter((f) => f.folder === 'root')
    .filter((f) => (explorerFilter ? f.name.toLowerCase().includes(explorerFilter.toLowerCase()) : true));

  const searchResults = searchQuery.trim()
    ? files.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.summary.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const quickOpenResults = quickOpenQuery.trim()
    ? files.filter(
        (f) =>
          f.name.toLowerCase().includes(quickOpenQuery.toLowerCase()) ||
          f.path.toLowerCase().includes(quickOpenQuery.toLowerCase())
      )
    : files;

  // Panel height classes
  const panelHeightClass =
    panelHeight === 'compact' ? 'h-40' : panelHeight === 'expanded' ? 'h-96' : 'h-64';

  return (
    <div
      ref={containerRef}
      className={`bg-[#1e1e1e] text-slate-200 border-slate-800 shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ${
        isFullscreen
          ? 'fixed inset-0 z-50 w-screen h-screen rounded-none border-0'
          : 'rounded-xl border h-[calc(100vh-140px)] min-h-[680px]'
      }`}
    >
      {/* 1. REFINED TOP BAR (VS Code Window Header) */}
      <div className="bg-[#181818] border-b border-[#2b2b2b] px-3 py-1.5 flex items-center justify-between text-xs select-none shrink-0 gap-3">
        {/* Left: Window Dots + Breadcrumbs */}
        <div className="flex items-center space-x-3 shrink-0">
          {/* Mac-style subtle window dots for clean native feel */}
          <div className="flex items-center space-x-1.5 pr-2 border-r border-[#2b2b2b]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/70"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/70"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/70"></span>
          </div>

          {/* Breadcrumbs with clean unboxed text */}
          <div className="flex items-center space-x-1.5 text-slate-400 font-mono text-[11px] truncate">
            <span className="text-slate-300 font-semibold">akhand-dev</span>
            <span className="text-slate-600">/</span>
            <span className="text-sky-400 font-medium">{activeFile?.folder}</span>
            <span className="text-slate-600">/</span>
            <span className="text-white font-semibold flex items-center space-x-1">
              <FileCode className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="truncate">{activeFile?.name || 'No file selected'}</span>
            </span>
            {dirtyFiles[activeFile?.id] && (
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 ml-1" title="Unsaved changes (Ctrl+S)"></span>
            )}
          </div>
        </div>

        {/* Center: Command Palette / Quick Open Trigger */}
        <button
          onClick={() => {
            setQuickOpenQuery('');
            setIsQuickOpenOpen(true);
          }}
          className="hidden sm:flex items-center justify-between px-3 py-1 bg-[#252526] hover:bg-[#2d2d2d] border border-[#3c3c3c] rounded text-slate-400 hover:text-slate-200 text-xs font-mono w-64 md:w-80 cursor-pointer transition"
          title="Search files (Ctrl+P / Cmd+P)"
        >
          <span className="flex items-center space-x-1.5 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">Go to file...</span>
          </span>
          <kbd className="text-[10px] bg-[#1e1e1e] border border-[#3c3c3c] px-1.5 py-0.5 rounded text-slate-400">
            ⌘P / Ctrl+P
          </kbd>
        </button>

        {/* Right: Grouped Actions (Run, Save, Layout Controls, Fullscreen) */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {/* Run Button (Primary action) */}
          <button
            onClick={handleRunCurrentFile}
            disabled={isExecuting}
            className="flex items-center space-x-1.5 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs font-mono shadow-sm transition cursor-pointer disabled:opacity-50"
            title="Run Python File (F5)"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isExecuting ? 'Running...' : 'Run'}</span>
            <span className="hidden md:inline text-[10px] opacity-75">(F5)</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSaveCurrentFile}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#252526] hover:bg-[#2d2d2d] text-slate-200 border border-[#3c3c3c] text-xs font-mono cursor-pointer transition"
            title="Save changes (Ctrl+S)"
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Saved</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-sky-400" />
                <span>Save</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="w-[1px] h-4 bg-[#2b2b2b] mx-1"></div>

          {/* Copy & Download Icons */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(currentCode);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#2d2d2d] cursor-pointer"
            title="Copy current code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => {
              const blob = new Blob([currentCode], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = activeFile?.name || 'script.py';
              a.click();
            }}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#2d2d2d] cursor-pointer"
            title="Download .py file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Divider */}
          <div className="w-[1px] h-4 bg-[#2b2b2b] mx-1"></div>

          {/* Toggle Sidebar Icon */}
          <button
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            className={`p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#2d2d2d] cursor-pointer transition ${
              isSidebarCollapsed ? 'text-amber-400' : ''
            }`}
            title={isSidebarCollapsed ? 'Show Sidebar (Ctrl+B)' : 'Hide Sidebar (Ctrl+B)'}
          >
            {isSidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          {/* Toggle Bottom Terminal Icon */}
          <button
            onClick={() => setIsPanelCollapsed((prev) => !prev)}
            className={`p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#2d2d2d] cursor-pointer transition ${
              isPanelCollapsed ? 'text-slate-500' : 'text-sky-400'
            }`}
            title={isPanelCollapsed ? 'Open Terminal (Ctrl+`)' : 'Hide Terminal (Ctrl+`)'}
          >
            {isPanelCollapsed ? <PanelBottom className="w-4 h-4" /> : <PanelBottomClose className="w-4 h-4" />}
          </button>

          {/* Full Screen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-mono transition cursor-pointer ${
              isFullscreen
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-white hover:bg-[#2d2d2d]'
            }`}
            title={isFullscreen ? 'Exit Full Screen (F11 / Esc)' : 'Enter Full Screen (F11)'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Exit Full</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Full Screen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. MAIN BODY: ACTIVITY BAR + SIDEBAR + (EDITOR & TERMINAL) */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* ACTIVITY BAR (VS Code Leftmost Slim Bar) */}
        <div className="w-11 bg-[#181818] border-r border-[#2b2b2b] flex flex-col items-center py-2 space-y-3 select-none shrink-0">
          <button
            onClick={() => {
              if (activityTab === 'explorer' && !isSidebarCollapsed) {
                setIsSidebarCollapsed(true);
              } else {
                setActivityTab('explorer');
                setIsSidebarCollapsed(false);
              }
            }}
            className={`p-2 rounded transition cursor-pointer relative ${
              activityTab === 'explorer' && !isSidebarCollapsed
                ? 'text-white bg-[#252526]'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Explorer (File tree)"
          >
            <Folder className="w-4 h-4" />
            {activityTab === 'explorer' && !isSidebarCollapsed && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-sky-400 rounded-r"></span>
            )}
          </button>

          <button
            onClick={() => {
              if (activityTab === 'search' && !isSidebarCollapsed) {
                setIsSidebarCollapsed(true);
              } else {
                setActivityTab('search');
                setIsSidebarCollapsed(false);
              }
            }}
            className={`p-2 rounded transition cursor-pointer relative ${
              activityTab === 'search' && !isSidebarCollapsed
                ? 'text-white bg-[#252526]'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Search in files"
          >
            <Search className="w-4 h-4" />
            {activityTab === 'search' && !isSidebarCollapsed && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-sky-400 rounded-r"></span>
            )}
          </button>

          <button
            onClick={() => {
              if (activityTab === 'revise' && !isSidebarCollapsed) {
                setIsSidebarCollapsed(true);
              } else {
                setActivityTab('revise');
                setIsSidebarCollapsed(false);
              }
            }}
            className={`p-2 rounded transition cursor-pointer relative ${
              activityTab === 'revise' && !isSidebarCollapsed
                ? 'text-white bg-[#252526]'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Revise & Practice Drills"
          >
            <BookOpen className="w-4 h-4" />
            {activityTab === 'revise' && !isSidebarCollapsed && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-sky-400 rounded-r"></span>
            )}
          </button>

          <div className="flex-1"></div>

          {/* Quick Add File */}
          <button
            onClick={() => {
              setNewFileFolder('learned');
              setIsNewFileModalOpen(true);
            }}
            className="p-2 text-sky-400 hover:text-sky-300 hover:bg-[#252526] rounded cursor-pointer transition"
            title="New Python File"
          >
            <FilePlus className="w-4 h-4" />
          </button>
        </div>

        {/* SIDEBAR PANEL (Collapsible with smooth width) */}
        {!isSidebarCollapsed && (
          <div className="w-64 md:w-72 bg-[#252526] border-r border-[#1e1e1e] flex flex-col select-none shrink-0 text-xs font-mono">
            {/* EXPLORER TAB */}
            {activityTab === 'explorer' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Explorer Header */}
                <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-[#1e1e1e]">
                  <span>WORKSPACE EXPLORER</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        setNewFileFolder('learned');
                        setIsNewFileModalOpen(true);
                      }}
                      className="p-1 hover:text-white cursor-pointer rounded hover:bg-[#333333]"
                      title="New file in learned/"
                    >
                      <Plus className="w-3.5 h-3.5 text-sky-400" />
                    </button>
                    <button
                      onClick={() => setIsSidebarCollapsed(true)}
                      className="p-1 hover:text-white cursor-pointer rounded hover:bg-[#333333]"
                      title="Collapse sidebar (Ctrl+B)"
                    >
                      <PanelLeftClose className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Filter input inside explorer */}
                <div className="p-2 border-b border-[#1e1e1e]">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Filter files..."
                      value={explorerFilter}
                      onChange={(e) => setExplorerFilter(e.target.value)}
                      className="w-full bg-[#1e1e1e] border border-[#333333] rounded px-2 py-1 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                    {explorerFilter && (
                      <button
                        onClick={() => setExplorerFilter('')}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* File Tree List */}
                <div className="flex-1 overflow-y-auto py-1 divide-y divide-[#1e1e1e]/60">
                  {/* FOLDER 1: learned/ */}
                  <div className="py-1">
                    <button
                      onClick={() => setFoldersOpen((prev) => ({ ...prev, learned: !prev.learned }))}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-slate-300 hover:bg-[#2a2d2e] cursor-pointer"
                    >
                      <div className="flex items-center space-x-1.5 font-bold text-sky-400">
                        {foldersOpen.learned ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <FolderOpen className="w-3.5 h-3.5 text-sky-400" />
                        <span>learned/</span>
                      </div>
                      <span className="text-[10px] text-slate-400 tabular-nums">
                        {learnedFiles.length}
                      </span>
                    </button>

                    {foldersOpen.learned && (
                      <div className="pl-4 pr-1 space-y-0.5 mt-0.5 border-l border-sky-500/20 ml-4">
                        {learnedFiles.map((file) => {
                          const isActive = file.id === activeFileId;
                          const isDirty = dirtyFiles[file.id];
                          return (
                            <div
                              key={file.id}
                              onClick={() => handleOpenFile(file)}
                              className={`flex items-center justify-between px-2 py-1 rounded transition cursor-pointer group ${
                                isActive
                                  ? 'bg-[#37373d] text-white font-semibold'
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#2a2d2e]'
                              }`}
                            >
                              <div className="flex items-center space-x-1.5 truncate">
                                <FileCode className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                                <span className="truncate text-[11px]">{file.name}</span>
                              </div>

                              <div className="flex items-center space-x-1 shrink-0">
                                {isDirty && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Unsaved"></span>
                                )}
                                <button
                                  onClick={(e) => handleDeleteFile(e, file.id)}
                                  className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-rose-400 rounded"
                                  title="Delete file"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* FOLDER 2: projects/ */}
                  <div className="py-1">
                    <button
                      onClick={() => setFoldersOpen((prev) => ({ ...prev, projects: !prev.projects }))}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-slate-300 hover:bg-[#2a2d2e] cursor-pointer"
                    >
                      <div className="flex items-center space-x-1.5 font-bold text-indigo-400">
                        {foldersOpen.projects ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
                        <span>projects/</span>
                      </div>
                      <span className="text-[10px] text-slate-400 tabular-nums">
                        {projectFiles.length}
                      </span>
                    </button>

                    {foldersOpen.projects && (
                      <div className="pl-4 pr-1 space-y-0.5 mt-0.5 border-l border-indigo-500/20 ml-4">
                        {projectFiles.map((file) => {
                          const isActive = file.id === activeFileId;
                          const isDirty = dirtyFiles[file.id];
                          return (
                            <div
                              key={file.id}
                              onClick={() => handleOpenFile(file)}
                              className={`flex items-center justify-between px-2 py-1 rounded transition cursor-pointer group ${
                                isActive
                                  ? 'bg-[#37373d] text-white font-semibold'
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#2a2d2e]'
                              }`}
                            >
                              <div className="flex items-center space-x-1.5 truncate">
                                <FileCode className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                <span className="truncate text-[11px]">{file.name}</span>
                              </div>

                              <div className="flex items-center space-x-1 shrink-0">
                                {isDirty && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                )}
                                <button
                                  onClick={(e) => handleDeleteFile(e, file.id)}
                                  className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-rose-400 rounded"
                                  title="Delete file"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* FOLDER 3: root / generated */}
                  <div className="py-1">
                    <button
                      onClick={() => setFoldersOpen((prev) => ({ ...prev, root: !prev.root }))}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-slate-300 hover:bg-[#2a2d2e] cursor-pointer"
                    >
                      <div className="flex items-center space-x-1.5 font-bold text-amber-400">
                        {foldersOpen.root ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                        <span>root/</span>
                      </div>
                      <span className="text-[10px] text-slate-400 tabular-nums">
                        {rootFiles.length}
                      </span>
                    </button>

                    {foldersOpen.root && (
                      <div className="pl-4 pr-1 space-y-0.5 mt-0.5 border-l border-amber-500/20 ml-4">
                        {rootFiles.map((file) => {
                          const isActive = file.id === activeFileId;
                          const isDirty = dirtyFiles[file.id];
                          return (
                            <div
                              key={file.id}
                              onClick={() => handleOpenFile(file)}
                              className={`flex items-center justify-between px-2 py-1 rounded transition cursor-pointer group ${
                                isActive
                                  ? 'bg-[#37373d] text-white font-semibold'
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#2a2d2e]'
                              }`}
                            >
                              <div className="flex items-center space-x-1.5 truncate">
                                <FileCode className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span className="truncate text-[11px]">{file.name}</span>
                              </div>

                              <div className="flex items-center space-x-1 shrink-0">
                                {isDirty && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SEARCH TAB */}
            {activityTab === 'search' && (
              <div className="flex-1 flex flex-col p-3 overflow-hidden">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  SEARCH WORKSPACE
                </div>
                <input
                  type="text"
                  placeholder="Search in all Python files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-[#333333] rounded p-2 text-white text-xs font-mono focus:outline-none focus:border-sky-500 mb-3"
                  autoFocus
                />
                <div className="flex-1 overflow-y-auto space-y-2">
                  {searchResults.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => handleOpenFile(f)}
                      className="p-2 rounded bg-[#1e1e1e] hover:bg-[#2e2e2e] cursor-pointer border border-[#333333]"
                    >
                      <div className="font-bold text-sky-400 flex items-center space-x-1">
                        <FileCode className="w-3 h-3" />
                        <span>{f.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{f.summary}</div>
                    </div>
                  ))}
                  {searchQuery && searchResults.length === 0 && (
                    <div className="text-slate-500 italic text-center py-4 text-xs">
                      No matching code or files found.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* REVISE TAB */}
            {activityTab === 'revise' && (
              <div className="flex-1 flex flex-col p-3 overflow-hidden">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span>PRACTICE TRACKER</span>
                  <span className="text-[10px] text-sky-400 font-mono">
                    {files.filter((f) => (f.revisionCount || 0) > 0).length}/{files.length} active
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1.5">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => handleOpenFile(file)}
                      className="p-2 rounded bg-[#1e1e1e] hover:bg-[#2a2d2e] cursor-pointer flex items-center justify-between"
                    >
                      <div className="truncate pr-2">
                        <div className="text-[11px] text-slate-200 font-semibold truncate">{file.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{file.folder}/</div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">
                          {file.revisionCount || 1}x
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. EDITOR & BOTTOM PANEL VIEWPORT */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e] min-w-0">
          {/* EDITOR TABS BAR */}
          <div className="bg-[#181818] border-b border-[#2b2b2b] flex items-center overflow-x-auto select-none shrink-0 scrollbar-none">
            {openFileIds.map((fileId) => {
              const file = files.find((f) => f.id === fileId);
              if (!file) return null;
              const isActive = file.id === activeFileId;
              const isDirty = dirtyFiles[file.id];

              return (
                <div
                  key={file.id}
                  onClick={() => handleOpenFile(file)}
                  className={`flex items-center space-x-2 px-3 py-2 border-r border-[#2b2b2b] text-xs font-mono cursor-pointer transition shrink-0 group ${
                    isActive
                      ? 'bg-[#1e1e1e] text-white border-t-2 border-t-sky-400 font-semibold'
                      : 'bg-[#181818] text-slate-400 hover:text-slate-200 hover:bg-[#202020]'
                  }`}
                >
                  <FileCode className={`w-3.5 h-3.5 ${file.folder === 'learned' ? 'text-sky-400' : 'text-indigo-400'}`} />
                  <span className="truncate max-w-[140px] text-[11px]">{file.name}</span>
                  {isDirty ? (
                    <span
                      onClick={(e) => handleCloseTab(e, file.id)}
                      className="w-2 h-2 rounded-full bg-amber-400 cursor-pointer ml-1"
                      title="Unsaved changes"
                    ></span>
                  ) : (
                    <button
                      onClick={(e) => handleCloseTab(e, file.id)}
                      className="p-0.5 hover:bg-[#3c3c3c] rounded text-slate-500 hover:text-white cursor-pointer ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* CODE EDITOR WORKSPACE (Full, clean, uncongested textarea) */}
          <div className="flex-1 flex overflow-hidden relative min-h-0 bg-[#1e1e1e]">
            {activeFile ? (
              <div className="flex-1 flex overflow-hidden font-mono text-xs">
                {/* Line Numbers Gutter */}
                <div className="w-12 bg-[#1b1b1b] border-r border-[#2b2b2b] py-3 text-right pr-3 text-slate-600 select-none overflow-hidden shrink-0 font-mono text-[12px]">
                  {currentCode.split('\n').map((_, idx) => (
                    <div key={idx} className="leading-6">
                      {idx + 1}
                    </div>
                  ))}
                </div>

                {/* Editable Code Textarea with auto-indent & tab key support */}
                <div className="flex-1 relative overflow-auto bg-[#1e1e1e]">
                  <textarea
                    ref={textareaRef}
                    value={currentCode}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    onKeyDown={handleKeyDownInTextarea}
                    spellCheck={false}
                    className="w-full h-full p-3 font-mono text-[13px] text-[#e0e0e0] bg-transparent focus:outline-none resize-none leading-6 whitespace-pre select-text"
                  ></textarea>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 font-mono text-xs p-6 space-y-3">
                <FileCode className="w-10 h-10 text-slate-600" />
                <p>No file open. Select a Python script from the sidebar or press Ctrl+P to search.</p>
                <button
                  onClick={() => {
                    setNewFileFolder('learned');
                    setIsNewFileModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold cursor-pointer"
                >
                  Create New File
                </button>
              </div>
            )}
          </div>

          {/* BOTTOM INTEGRATED TERMINAL & REVISION PANEL (Collapsible) */}
          {!isPanelCollapsed && (
            <div className={`${panelHeightClass} bg-[#181818] border-t border-[#2b2b2b] flex flex-col shrink-0 select-none`}>
              {/* Terminal Header Tabs */}
              <div className="px-3 py-1.5 bg-[#202020] border-b border-[#2b2b2b] flex items-center justify-between text-xs font-mono select-none">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setBottomTab('terminal')}
                    className={`flex items-center space-x-1.5 px-2.5 py-1 rounded cursor-pointer transition ${
                      bottomTab === 'terminal'
                        ? 'bg-[#181818] text-emerald-400 font-bold border-b-2 border-emerald-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>TERMINAL</span>
                  </button>

                  <button
                    onClick={() => setBottomTab('notes')}
                    className={`flex items-center space-x-1.5 px-2.5 py-1 rounded cursor-pointer transition ${
                      bottomTab === 'notes'
                        ? 'bg-[#181818] text-sky-400 font-bold border-b-2 border-sky-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>NOTES</span>
                  </button>

                  <button
                    onClick={() => setBottomTab('quiz')}
                    className={`flex items-center space-x-1.5 px-2.5 py-1 rounded cursor-pointer transition ${
                      bottomTab === 'quiz'
                        ? 'bg-[#181818] text-amber-400 font-bold border-b-2 border-amber-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>REVISE DRILL</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Clear terminal */}
                  {bottomTab === 'terminal' && terminalOutput.length > 0 && (
                    <button
                      onClick={() => setTerminalOutput([])}
                      className="px-2 py-0.5 rounded text-[11px] text-slate-400 hover:text-white hover:bg-[#2b2b2b] cursor-pointer"
                      title="Clear terminal"
                    >
                      clear
                    </button>
                  )}

                  {/* Panel Height Switcher */}
                  <div className="hidden sm:flex items-center space-x-1 text-[10px] text-slate-400 border border-[#333333] rounded px-1">
                    <button
                      onClick={() => setPanelHeight('compact')}
                      className={`px-1 py-0.5 rounded cursor-pointer ${panelHeight === 'compact' ? 'text-sky-400 font-bold' : 'hover:text-white'}`}
                      title="Compact panel"
                    >
                      S
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => setPanelHeight('normal')}
                      className={`px-1 py-0.5 rounded cursor-pointer ${panelHeight === 'normal' ? 'text-sky-400 font-bold' : 'hover:text-white'}`}
                      title="Default panel"
                    >
                      M
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => setPanelHeight('expanded')}
                      className={`px-1 py-0.5 rounded cursor-pointer ${panelHeight === 'expanded' ? 'text-sky-400 font-bold' : 'hover:text-white'}`}
                      title="Expanded panel"
                    >
                      L
                    </button>
                  </div>

                  {/* Close / Collapse bottom panel */}
                  <button
                    onClick={() => setIsPanelCollapsed(true)}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-[#2b2b2b] cursor-pointer"
                    title="Hide panel (Ctrl+`)"
                  >
                    <PanelBottomClose className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Terminal Body */}
              <div className="flex-1 p-3 overflow-auto font-mono text-xs select-text bg-[#141414]">
                {bottomTab === 'terminal' && (
                  <div className="space-y-1">
                    {terminalOutput.length === 0 ? (
                      <div className="text-slate-500 italic py-2">
                        Python 3.12 environment ready. Click <span className="text-emerald-400 font-semibold">Run</span> or press <kbd className="px-1 py-0.5 bg-[#252526] rounded text-slate-300">F5</kbd> to execute {activeFile?.name || 'current file'}.
                      </div>
                    ) : (
                      terminalOutput.map((l, idx) => (
                        <div
                          key={idx}
                          className={
                            l.startsWith('$')
                              ? 'text-sky-400 font-bold'
                              : l.startsWith('---')
                              ? 'text-slate-500 italic'
                              : 'text-emerald-400'
                          }
                        >
                          {l}
                        </div>
                      ))
                    )}
                    {isExecuting && (
                      <div className="flex items-center space-x-2 text-sky-400 py-1">
                        <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                        <span>Executing Python script...</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Notes Body */}
                {bottomTab === 'notes' && activeFile && (
                  <div className="space-y-2 text-slate-300">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">
                        Key Takeaways: {activeFile.name}
                      </span>
                      <span className="text-[11px] text-emerald-400 font-mono">
                        Revised {activeFile.revisionCount || 1} times
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed bg-[#1e1e1e] p-3 rounded border border-[#2b2b2b]">
                      {activeFile.notes || 'No specific notes recorded. You can add notes directly into the file as comments or docstrings.'}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Summary: <span className="text-slate-200">{activeFile.summary}</span>
                    </div>
                  </div>
                )}

                {/* Practice Quiz / Drill Body */}
                {bottomTab === 'quiz' && activeFile && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[#2b2b2b] pb-2">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-white text-xs">Revision Drill: {activeFile.name}</span>
                      </div>
                      <button
                        onClick={() => {
                          virtualWorkspace.recordRevision(activeFile.id);
                          refreshFiles();
                        }}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer transition flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Mark Revised (+1)</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-300">
                      Read the code in the editor. Predict what it outputs in the terminal before running!
                    </p>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuizRevealed(!quizRevealed)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{quizRevealed ? 'Hide Solution' : 'Reveal Expected Output'}</span>
                      </button>

                      <button
                        onClick={handleRunCurrentFile}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Run & Verify in Terminal</span>
                      </button>
                    </div>

                    {quizRevealed && (
                      <div className="p-3 rounded bg-black/60 border border-amber-500/30 text-xs text-emerald-300 space-y-1">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">EXPECTED BEHAVIOR / OUTPUT:</div>
                        <div>{activeFile.summary}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. BOTTOM STATUS BAR (Classic Clean VS Code) */}
      <div className="bg-[#181818] border-t border-[#2b2b2b] text-slate-400 px-3 py-1 flex items-center justify-between text-[11px] font-mono select-none shrink-0">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1 text-slate-300">
            <Layers className="w-3 h-3 text-sky-400" />
            <span>main</span>
          </span>
          <span className="hidden sm:inline">0 errors</span>
          <button
            onClick={() => setIsPanelCollapsed((prev) => !prev)}
            className="flex items-center space-x-1 text-slate-300 hover:text-white cursor-pointer"
          >
            <Terminal className="w-3 h-3 text-emerald-400" />
            <span>Terminal {isPanelCollapsed ? '(closed)' : '(active)'}</span>
          </button>
        </div>

        <div className="flex items-center space-x-3 text-slate-400">
          <span>Ln {currentCode.split('\n').length}, Col 1</span>
          <span className="hidden sm:inline">Spaces: 4</span>
          <span className="hidden sm:inline">UTF-8</span>
          <span className="text-sky-400 font-semibold">Python 3.12</span>
          <button
            onClick={toggleFullscreen}
            className="text-slate-400 hover:text-white cursor-pointer"
            title="Toggle Fullscreen (F11)"
          >
            {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* MODAL: QUICK OPEN (Ctrl+P / Cmd+P) */}
      {isQuickOpenOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="bg-[#252526] border border-[#3c3c3c] rounded-xl max-w-lg w-full shadow-2xl overflow-hidden font-mono text-xs">
            <div className="p-3 border-b border-[#3c3c3c] flex items-center space-x-2">
              <Search className="w-4 h-4 text-sky-400" />
              <input
                type="text"
                placeholder="Type name of Python file to open..."
                value={quickOpenQuery}
                onChange={(e) => setQuickOpenQuery(e.target.value)}
                className="w-full bg-transparent text-white focus:outline-none text-xs"
                autoFocus
              />
              <span className="text-[10px] text-slate-500">ESC to close</span>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-[#1e1e1e]/60">
              {quickOpenResults.map((f) => (
                <div
                  key={f.id}
                  onClick={() => {
                    handleOpenFile(f);
                    setIsQuickOpenOpen(false);
                  }}
                  className={`px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-[#37373d] transition ${
                    f.id === activeFileId ? 'bg-[#2a2d2e] text-white' : 'text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <FileCode className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="font-semibold truncate">{f.name}</span>
                    <span className="text-[10px] text-slate-500">{f.folder}/</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0 tabular-nums">
                    {f.revisionCount || 1} rev
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW PYTHON FILE (To learned/ or projects/) */}
      {isNewFileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#252526] border border-[#3c3c3c] rounded-xl max-w-md w-full p-6 shadow-2xl text-xs font-mono">
            <div className="flex items-center justify-between border-b border-[#3c3c3c] pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <FilePlus className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-white text-sm">Create New Python File</h3>
              </div>
              <button
                onClick={() => setIsNewFileModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFileSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Destination Folder:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewFileFolder('learned')}
                    className={`p-2 rounded border text-left cursor-pointer transition ${
                      newFileFolder === 'learned'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 font-bold'
                        : 'bg-[#1e1e1e] border-[#333333] text-slate-400'
                    }`}
                  >
                    <div className="font-bold">learned/</div>
                    <div className="text-[10px] text-slate-500">What I have learned</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewFileFolder('projects')}
                    className={`p-2 rounded border text-left cursor-pointer transition ${
                      newFileFolder === 'projects'
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 font-bold'
                        : 'bg-[#1e1e1e] border-[#333333] text-slate-400'
                    }`}
                  >
                    <div className="font-bold">projects/</div>
                    <div className="text-[10px] text-slate-500">My practice projects</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  File Name * (.py will be appended)
                </label>
                <input
                  type="text"
                  required
                  placeholder={newFileFolder === 'learned' ? 'e.g. 22_advanced_methods.py' : 'e.g. dice_simulator.py'}
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-[#333333] rounded p-2 text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Summary / Concept
                </label>
                <input
                  type="text"
                  placeholder="What does this code do or teach?"
                  value={newFileSummary}
                  onChange={(e) => setNewFileSummary(e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-[#333333] rounded p-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#3c3c3c]">
                <button
                  type="button"
                  onClick={() => setIsNewFileModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#333333] text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold cursor-pointer"
                >
                  Create & Open
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
