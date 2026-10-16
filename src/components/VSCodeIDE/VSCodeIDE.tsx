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
  X
} from 'lucide-react';
import { VirtualFile, FolderType } from '../../types/editor';
import { virtualWorkspace } from '../../services/virtualWorkspace';

interface VSCodeIDEProps {
  initialFileId?: string;
}

export const VSCodeIDE: React.FC<VSCodeIDEProps> = ({ initialFileId }) => {
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

  // Explorer Folder Collapse States
  const [foldersOpen, setFoldersOpen] = useState<{ learned: boolean; projects: boolean; root: boolean }>({
    learned: true,
    projects: true,
    root: true,
  });

  // Activity Bar Active Tab: 'explorer' | 'search' | 'revise'
  const [activityTab, setActivityTab] = useState<'explorer' | 'search' | 'revise'>('explorer');

  // Search in workspace
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Terminal Execution State
  const [bottomTab, setBottomTab] = useState<'terminal' | 'notes' | 'quiz'>('terminal');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  // New File Modal State
  const [isNewFileModalOpen, setIsNewFileModalOpen] = useState<boolean>(false);
  const [newFileFolder, setNewFileFolder] = useState<FolderType>('learned');
  const [newFileName, setNewFileName] = useState<string>('');
  const [newFileSummary, setNewFileSummary] = useState<string>('');

  // Save feedback state
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Practice Quiz / Drill state for current file
  const [quizRevealed, setQuizRevealed] = useState<boolean>(false);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];
  const currentCode =
    activeFile && editorContents[activeFile.id] !== undefined
      ? editorContents[activeFile.id]
      : activeFile?.content || '';

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Refresh files
  const refreshFiles = () => {
    const fresh = virtualWorkspace.getFiles();
    setFiles(fresh);
  };

  // Keyboard shortcut listener for Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveCurrentFile();
      }
      if (e.key === 'F5') {
        e.preventDefault();
        handleRunCurrentFile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFileId, currentCode]);

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
    setBottomTab('terminal');
    setTerminalOutput([`$ python3 ${activeFile.path}`]);

    const code = currentCode;
    const lines = code.split('\n');
    const outputs: string[] = [];

    // Realistic Python simulation
    if (activeFile.name.includes('countdown')) {
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
    } else if (activeFile.name.includes('str_dunder') || activeFile.name.includes('classes')) {
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
          // Auto record a practice revision
          virtualWorkspace.recordRevision(activeFile.id);
          refreshFiles();
        }
      }, (idx + 1) * 160);
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

  // Filtered files for search
  const learnedFiles = files.filter((f) => f.folder === 'learned');
  const projectFiles = files.filter((f) => f.folder === 'projects');
  const rootFiles = files.filter((f) => f.folder === 'root');

  const searchResults = searchQuery.trim()
    ? files.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.summary.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="bg-[#1e1e1e] text-slate-200 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[780px]">
      {/* 1. TOP VS CODE MENU & BREADCRUMBS BAR */}
      <div className="bg-[#181818] border-b border-[#2b2b2b] px-4 py-2 flex items-center justify-between text-xs select-none">
        {/* Left: Breadcrumbs & File Info */}
        <div className="flex items-center space-x-2 text-slate-400 font-mono text-[11px]">
          <span className="text-sky-400 font-bold">akhand-dev/learned</span>
          <span>&gt;</span>
          <span className="text-amber-400">{activeFile?.folder}/</span>
          <span>&gt;</span>
          <span className="text-white font-semibold flex items-center space-x-1">
            <FileCode className="w-3.5 h-3.5 text-sky-400" />
            <span>{activeFile?.name || 'No file selected'}</span>
          </span>
          {dirtyFiles[activeFile?.id] && (
            <span className="w-2 h-2 rounded-full bg-amber-400" title="Unsaved changes (Ctrl+S)"></span>
          )}
        </div>

        {/* Right: Action Buttons (Run, Save, Revise) */}
        <div className="flex items-center space-x-2">
          {/* Practice & Revise Badge */}
          {activeFile && (
            <button
              onClick={() => setBottomTab('quiz')}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#252526] hover:bg-[#2d2d2d] text-indigo-300 border border-indigo-500/30 text-xs font-mono cursor-pointer transition"
              title="Practice & Revise this code"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Practice / Revise ({activeFile.revisionCount || 1}x)</span>
            </button>
          )}

          {/* Save Button */}
          <button
            onClick={handleSaveCurrentFile}
            className="flex items-center space-x-1.5 px-3 py-1 rounded bg-[#252526] hover:bg-[#2d2d2d] text-slate-200 border border-slate-700 text-xs font-mono cursor-pointer transition"
            title="Save changes (Ctrl+S)"
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-sky-400" />
                <span>Save (Ctrl+S)</span>
              </>
            )}
          </button>

          {/* Run Python File (Play Button) */}
          <button
            onClick={handleRunCurrentFile}
            disabled={isExecuting}
            className="flex items-center space-x-1.5 px-3.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono shadow transition cursor-pointer disabled:opacity-50"
            title="Run Python File (F5)"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isExecuting ? 'Running...' : 'Run (F5)'}</span>
          </button>

          {/* Copy Code */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(currentCode);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#2d2d2d] cursor-pointer"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Download .py */}
          <button
            onClick={() => {
              const blob = new Blob([currentCode], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = activeFile?.name || 'script.py';
              a.click();
            }}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#2d2d2d] cursor-pointer"
            title="Download .py file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. MAIN BODY: ACTIVITY BAR + SIDEBAR + EDITOR & TERMINAL */}
      <div className="flex-1 flex overflow-hidden">
        {/* ACTIVITY BAR (VS Code Leftmost Bar) */}
        <div className="w-12 bg-[#333333] border-r border-[#252526] flex flex-col items-center py-3 space-y-4 select-none shrink-0">
          <button
            onClick={() => setActivityTab('explorer')}
            className={`p-2 rounded-lg transition cursor-pointer ${
              activityTab === 'explorer'
                ? 'text-white bg-[#1e1e1e] border-l-2 border-sky-400'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Explorer (learned/ and projects/)"
          >
            <Folder className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActivityTab('revise')}
            className={`p-2 rounded-lg transition cursor-pointer ${
              activityTab === 'revise'
                ? 'text-white bg-[#1e1e1e] border-l-2 border-sky-400'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Revise & Practice Hub"
          >
            <BookOpen className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActivityTab('search')}
            className={`p-2 rounded-lg transition cursor-pointer ${
              activityTab === 'search'
                ? 'text-white bg-[#1e1e1e] border-l-2 border-sky-400'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Search Workspace"
          >
            <Search className="w-5 h-5" />
          </button>

          <div className="flex-1"></div>

          <button
            onClick={() => {
              setNewFileFolder('learned');
              setIsNewFileModalOpen(true);
            }}
            className="p-2 text-sky-400 hover:text-sky-300 cursor-pointer"
            title="New Python File"
          >
            <FilePlus className="w-5 h-5" />
          </button>
        </div>

        {/* SIDEBAR PANEL (Explorer / Search / Revise) */}
        <div className="w-64 bg-[#252526] border-r border-[#1e1e1e] flex flex-col select-none shrink-0 text-xs font-mono">
          {/* EXPLORER TAB */}
          {activityTab === 'explorer' && (
            <div className="flex-1 flex flex-col overflow-y-auto">
              {/* Header */}
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-[#1e1e1e]">
                <span>EXPLORER</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      setNewFileFolder('learned');
                      setIsNewFileModalOpen(true);
                    }}
                    className="p-1 hover:text-white cursor-pointer"
                    title="Add file to learned/"
                  >
                    <Plus className="w-3.5 h-3.5 text-sky-400" />
                  </button>
                  <button
                    onClick={() => {
                      setNewFileFolder('projects');
                      setIsNewFileModalOpen(true);
                    }}
                    className="p-1 hover:text-white cursor-pointer"
                    title="Add file to projects/"
                  >
                    <FilePlus className="w-3.5 h-3.5 text-indigo-400" />
                  </button>
                </div>
              </div>

              {/* FOLDER 1: learned/ */}
              <div className="py-1">
                <button
                  onClick={() => setFoldersOpen((prev) => ({ ...prev, learned: !prev.learned }))}
                  className="w-full flex items-center justify-between px-3 py-1 text-slate-300 hover:bg-[#2a2d2e] cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5 font-bold text-sky-400">
                    {foldersOpen.learned ? (
                      <FolderOpen className="w-4 h-4 fill-sky-400/20" />
                    ) : (
                      <Folder className="w-4 h-4 fill-sky-400/20" />
                    )}
                    <span>learned/</span>
                  </div>
                  <span className="text-[10px] bg-[#1e1e1e] text-slate-400 px-1.5 py-0.2 rounded">
                    {learnedFiles.length} files
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
                            <span className="truncate">{file.name}</span>
                          </div>

                          <div className="flex items-center space-x-1 shrink-0">
                            {isDirty && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            )}
                            <button
                              onClick={(e) => handleDeleteFile(e, file.id)}
                              className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-rose-400"
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
                  className="w-full flex items-center justify-between px-3 py-1 text-slate-300 hover:bg-[#2a2d2e] cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5 font-bold text-indigo-400">
                    {foldersOpen.projects ? (
                      <FolderOpen className="w-4 h-4 fill-indigo-400/20" />
                    ) : (
                      <Folder className="w-4 h-4 fill-indigo-400/20" />
                    )}
                    <span>projects/</span>
                  </div>
                  <span className="text-[10px] bg-[#1e1e1e] text-slate-400 px-1.5 py-0.2 rounded">
                    {projectFiles.length} files
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
                            <span className="truncate">{file.name}</span>
                          </div>

                          <div className="flex items-center space-x-1 shrink-0">
                            {isDirty && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            )}
                            <button
                              onClick={(e) => handleDeleteFile(e, file.id)}
                              className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-rose-400"
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

              {/* ROOT FILES */}
              {rootFiles.length > 0 && (
                <div className="py-1">
                  <div className="px-3 py-1 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                    ROOT SCRIPTS
                  </div>
                  <div className="pl-4 pr-1 space-y-0.5">
                    {rootFiles.map((file) => (
                      <div
                        key={file.id}
                        onClick={() => handleOpenFile(file)}
                        className={`flex items-center justify-between px-2 py-1 rounded transition cursor-pointer ${
                          file.id === activeFileId
                            ? 'bg-[#37373d] text-white font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-[#2a2d2e]'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 truncate">
                          <FileCode className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{file.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SEARCH TAB */}
          {activityTab === 'search' && (
            <div className="flex-1 p-3 flex flex-col space-y-3 overflow-y-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                SEARCH WORKSPACE
              </span>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search in files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1 overflow-y-auto flex-1">
                {searchResults.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => handleOpenFile(f)}
                    className="w-full text-left p-2 rounded bg-[#1e1e1e] hover:bg-[#2a2d2e] cursor-pointer"
                  >
                    <div className="font-bold text-sky-400 text-xs">{f.path}</div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{f.summary}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* REVISE & PRACTICE TAB */}
          {activityTab === 'revise' && (
            <div className="flex-1 p-3 flex flex-col space-y-3 overflow-y-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>REVISION DRILL</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </span>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Click any learned file to practice, inspect code, and test your memory:
              </p>

              <div className="space-y-1.5 overflow-y-auto flex-1">
                {files.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => {
                      handleOpenFile(file);
                      setBottomTab('quiz');
                    }}
                    className={`w-full text-left p-2 rounded border transition cursor-pointer flex items-center justify-between ${
                      file.id === activeFileId
                        ? 'bg-[#37373d] border-sky-500/50 text-white'
                        : 'bg-[#1e1e1e] border-[#2b2b2b] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="font-semibold text-xs truncate">{file.name}</div>
                      <div className="text-[10px] text-slate-500">{file.folder}/</div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#2b2b2b] text-amber-300">
                      {file.revisionCount || 1}x
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* EDITOR AREA + BOTTOM TERMINAL */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e]">
          {/* TAB BAR */}
          <div className="bg-[#252526] border-b border-[#1e1e1e] flex items-center overflow-x-auto scrollbar-none select-none">
            {openFileIds.map((id) => {
              const file = files.find((f) => f.id === id);
              if (!file) return null;
              const isActive = file.id === activeFileId;
              const isDirty = dirtyFiles[file.id];

              return (
                <div
                  key={file.id}
                  onClick={() => setActiveFileId(file.id)}
                  className={`flex items-center space-x-2 px-3 py-2 border-r border-[#1e1e1e] text-xs font-mono transition cursor-pointer ${
                    isActive
                      ? 'bg-[#1e1e1e] text-white border-t-2 border-t-sky-400'
                      : 'bg-[#2d2d2d] text-slate-400 hover:bg-[#252526] hover:text-slate-200'
                  }`}
                >
                  <FileCode
                    className={`w-3.5 h-3.5 ${
                      file.folder === 'learned'
                        ? 'text-sky-400'
                        : file.folder === 'projects'
                        ? 'text-indigo-400'
                        : 'text-amber-400'
                    }`}
                  />
                  <span>{file.name}</span>

                  {isDirty ? (
                    <span
                      className="w-2 h-2 rounded-full bg-amber-400 ml-1"
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

          {/* CODE EDITOR WORKSPACE */}
          <div className="flex-1 flex overflow-hidden relative">
            {activeFile ? (
              <div className="flex-1 flex overflow-hidden font-mono text-xs">
                {/* Line Numbers Gutter */}
                <div className="w-12 bg-[#1e1e1e] border-r border-[#2b2b2b] py-3 text-right pr-3 text-slate-600 select-none overflow-hidden shrink-0">
                  {currentCode.split('\n').map((_, idx) => (
                    <div key={idx} className="leading-relaxed">
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
                    className="w-full h-full p-3 font-mono text-xs text-[#d4d4d4] bg-transparent focus:outline-none resize-none leading-relaxed whitespace-pre select-text"
                  ></textarea>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 font-mono text-xs">
                Select a Python file from learned/ or projects/ to edit
              </div>
            )}
          </div>

          {/* BOTTOM INTEGRATED TERMINAL & REVISION PANEL */}
          <div className="h-56 bg-[#181818] border-t border-[#2b2b2b] flex flex-col">
            {/* Terminal Header Tabs */}
            <div className="px-4 py-1.5 bg-[#252526] border-b border-[#2b2b2b] flex items-center justify-between text-xs font-mono select-none">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setBottomTab('terminal')}
                  className={`flex items-center space-x-1.5 px-2 py-1 rounded cursor-pointer ${
                    bottomTab === 'terminal'
                      ? 'bg-[#181818] text-emerald-400 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>TERMINAL (stdout)</span>
                </button>

                <button
                  onClick={() => setBottomTab('notes')}
                  className={`flex items-center space-x-1.5 px-2 py-1 rounded cursor-pointer ${
                    bottomTab === 'notes'
                      ? 'bg-[#181818] text-sky-400 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>LEARNED NOTES & TAKEAWAYS</span>
                </button>

                <button
                  onClick={() => setBottomTab('quiz')}
                  className={`flex items-center space-x-1.5 px-2 py-1 rounded cursor-pointer ${
                    bottomTab === 'quiz'
                      ? 'bg-[#181818] text-amber-400 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>PRACTICE & REVISE TEST</span>
                </button>
              </div>

              {bottomTab === 'terminal' && terminalOutput.length > 0 && (
                <button
                  onClick={() => setTerminalOutput([])}
                  className="text-[11px] text-slate-500 hover:text-white cursor-pointer"
                >
                  clear
                </button>
              )}
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-3 overflow-auto font-mono text-xs select-text">
              {bottomTab === 'terminal' && (
                <div className="space-y-1">
                  {terminalOutput.length === 0 ? (
                    <div className="text-slate-500 italic py-4">
                      Terminal ready. Click "Run (F5)" to execute {activeFile?.name || 'file'} in Python 3.12 runtime.
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
                    <div className="flex items-center space-x-2 text-sky-400">
                      <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                      <span>Executing Python script...</span>
                    </div>
                  )}
                </div>
              )}

              {/* Notes Body */}
              {bottomTab === 'notes' && activeFile && (
                <div className="space-y-2 text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">
                      Key Takeaways for {activeFile.name}:
                    </span>
                    <span className="text-[11px] text-amber-300 bg-[#252526] px-2 py-0.5 rounded">
                      Revised {activeFile.revisionCount || 1} times
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-[#252526] p-3 rounded border border-[#333333]">
                    {activeFile.notes || 'No specific notes recorded. You can add notes directly into the file as comments or docstrings.'}
                  </p>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 pt-1">
                    <span>Summary:</span>
                    <span className="text-slate-200">{activeFile.summary}</span>
                  </div>
                </div>
              )}

              {/* Practice Quiz / Drill Body */}
              {bottomTab === 'quiz' && activeFile && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#2b2b2b] pb-2">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-white">Active Revision Drill: {activeFile.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        virtualWorkspace.recordRevision(activeFile.id);
                        refreshFiles();
                      }}
                      className="px-2 py-1 rounded bg-[#252526] hover:bg-[#333333] text-emerald-400 text-[11px] font-bold cursor-pointer"
                    >
                      ✓ Mark Revised (+1)
                    </button>
                  </div>

                  <p className="text-xs text-slate-300">
                    Challenge: Read the code above in the editor. Predict what it outputs before running!
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
                      <span>Run & Test Now</span>
                    </button>
                  </div>

                  {quizRevealed && (
                    <div className="p-3 rounded bg-black/60 border border-amber-500/30 text-xs text-emerald-300 space-y-1">
                      <div className="text-[10px] text-slate-400 font-bold">EXPECTED BEHAVIOR:</div>
                      <div>{activeFile.summary}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM STATUS BAR (VS Code Style) */}
      <div className="bg-[#007acc] text-white px-3 py-1 flex items-center justify-between text-[11px] font-mono select-none">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <Layers className="w-3 h-3" />
            <span>main</span>
          </span>
          <span>0 errors, 0 warnings</span>
          <span>Python 3.12 (venv)</span>
        </div>

        <div className="flex items-center space-x-4">
          <span>Ln {currentCode.split('\n').length}, Col 1</span>
          <span>Spaces: 4</span>
          <span>UTF-8</span>
          <span className="font-bold">Python</span>
        </div>
      </div>

      {/* MODAL: ADD NEW PYTHON FILE (To learned/ or projects/) */}
      {isNewFileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#252526] border border-[#3c3c3c] rounded-2xl max-w-md w-full p-6 shadow-2xl text-xs font-mono">
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
                  placeholder={newFileFolder === 'learned' ? 'e.g. 13_list_comprehensions.py' : 'e.g. dice_simulator.py'}
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded p-2 text-white font-mono focus:outline-none focus:border-sky-500"
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
                  className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded p-2 text-white focus:outline-none focus:border-sky-500"
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
