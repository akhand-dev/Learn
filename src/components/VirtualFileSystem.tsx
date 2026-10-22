import React, { useState } from 'react';
import {
  FolderTree,
  Folder,
  FileCode,
  FileText,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Play
} from 'lucide-react';
import { ORIGINAL_SCRIPTS } from '../data/scriptsData';

interface VirtualFileSystemProps {
  virtualFiles: Record<string, string>;
  onSelectScriptToRun: (scriptId: string) => void;
}

export const VirtualFileSystem: React.FC<VirtualFileSystemProps> = ({
  virtualFiles,
  onSelectScriptToRun,
}) => {
  const [selectedPath, setSelectedPath] = useState<string>('python/start1.py');
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    projects: true,
    python: true,
  });
  const [copied, setCopied] = useState<boolean>(false);

  const toggleFolder = (folder: string) => {
    setOpenFolders((prev) => ({ ...prev, [folder]: !prev[folder] }));
  };

  const getFileContent = (path: string): string => {
    if (path === 'create.py' && virtualFiles['create.py']) {
      return virtualFiles['create.py'];
    }
    const script = ORIGINAL_SCRIPTS.find((s) => s.path === path);
    if (script) return script.code;

    if (path === '.gitattributes') {
      return '* text=auto eol=lf\n';
    }
    return '# File content not found';
  };

  const currentContent = getFileContent(selectedPath);
  const currentScript = ORIGINAL_SCRIPTS.find((s) => s.path === selectedPath);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-10 relative overflow-hidden shadow-xl">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 text-xs font-mono text-sky-400 mb-3">
            <FolderTree className="w-4 h-4" />
            <span>Repository Filesystem</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Original Repository Tree & File Browser
          </h2>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Browse the exact repository structure imported from <code className="text-sky-300 font-mono">akhand-dev/learned</code>. All original files, folders, and outputs are preserved and inspectable.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tree Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                akhand-dev / learned
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                Git Root
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-xs sm:text-sm">
              {/* .gitattributes */}
              <button
                onClick={() => setSelectedPath('.gitattributes')}
                className={`w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl transition cursor-pointer text-left ${
                  selectedPath === '.gitattributes'
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>.gitattributes</span>
              </button>

              {/* create.py */}
              <button
                onClick={() => setSelectedPath('create.py')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition cursor-pointer text-left ${
                  selectedPath === 'create.py'
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <FileCode className="w-4 h-4 text-amber-400" />
                  <span>create.py</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded">
                  gen
                </span>
              </button>

              {/* projects folder */}
              <div>
                <button
                  onClick={() => toggleFolder('projects')}
                  className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 transition cursor-pointer text-left font-semibold"
                >
                  {openFolders.projects ? (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  )}
                  <Folder className="w-4 h-4 text-sky-400 fill-sky-400/20" />
                  <span className="text-white">projects/</span>
                </button>

                {openFolders.projects && (
                  <div className="pl-6 space-y-1 mt-1 border-l border-slate-800 ml-4">
                    <button
                      onClick={() => setSelectedPath('projects/countdown.py')}
                      className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg transition cursor-pointer text-left ${
                        selectedPath === 'projects/countdown.py'
                          ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      }`}
                    >
                      <FileCode className="w-4 h-4 text-sky-400" />
                      <span>countdown.py</span>
                    </button>
                  </div>
                )}
              </div>

              {/* python folder */}
              <div>
                <button
                  onClick={() => toggleFolder('python')}
                  className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 transition cursor-pointer text-left font-semibold"
                >
                  {openFolders.python ? (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  )}
                  <Folder className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
                  <span className="text-white">python/</span>
                </button>

                {openFolders.python && (
                  <div className="pl-6 space-y-1 mt-1 border-l border-slate-800 ml-4">
                    <button
                      onClick={() => setSelectedPath('python/print.py')}
                      className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg transition cursor-pointer text-left ${
                        selectedPath === 'python/print.py'
                          ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      }`}
                    >
                      <FileCode className="w-4 h-4 text-indigo-400" />
                      <span>print.py</span>
                    </button>

                    <button
                      onClick={() => setSelectedPath('python/start1.py')}
                      className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg transition cursor-pointer text-left ${
                        selectedPath === 'python/start1.py'
                          ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      }`}
                    >
                      <FileCode className="w-4 h-4 text-indigo-400" />
                      <span>start1.py</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* File Preview Content (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[580px]">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <FileCode className="w-4 h-4 text-sky-400" />
                <span className="font-mono text-xs sm:text-sm font-semibold text-white">
                  /{selectedPath}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                {currentScript && (
                  <button
                    onClick={() => onSelectScriptToRun(currentScript.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer shadow-md shadow-sky-500/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Open in REPL</span>
                  </button>
                )}

                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  title="Copy"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                </button>
              </div>
            </div>

            {/* Code with Line Numbers */}
            <div className="flex-1 overflow-auto bg-slate-950/80 p-6 font-mono text-xs sm:text-sm select-text leading-relaxed">
              <div className="table w-full">
                {currentContent.split('\n').map((line, idx) => (
                  <div key={idx} className="table-row hover:bg-slate-800/30">
                    <span className="table-cell pr-5 text-right text-slate-600 select-none w-12 text-xs">
                      {idx + 1}
                    </span>
                    <span className="table-cell text-slate-200 whitespace-pre">{line}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Status */}
            <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>{currentContent.split('\n').length} lines • {currentContent.length} bytes</span>
              <span>UTF-8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
