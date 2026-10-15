import React, { useState } from 'react';
import {
  FolderCode,
  Plus,
  Play,
  Trash2,
  Copy,
  Check,
  Download,
  Terminal,
  X,
  FileCode,
  Sparkles,
  Save
} from 'lucide-react';
import { UserProject } from '../types/learning';
import { learningStorage } from '../services/learningStorage';
import { PROJECT_TEMPLATES } from '../data/initialLearnedData';

interface MyProjectsLabProps {
  onOpenInRunner?: (code: string) => void;
}

export const MyProjectsLab: React.FC<MyProjectsLabProps> = ({ onOpenInRunner: _onOpenInRunner }) => {
  const [projects, setProjects] = useState<UserProject[]>(() => learningStorage.getProjects());
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    const list = learningStorage.getProjects();
    return list.length > 0 ? list[0].id : '';
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalFileName, setModalFileName] = useState<string>('projects/new_project.py');
  const [modalCategory, setModalCategory] = useState<string>('CLI Utilities');
  const [modalDescription, setModalDescription] = useState<string>('');
  const [modalCode, setModalCode] = useState<string>('print("Hello from my new Python project!")\n');
  const [modalStatus, setModalStatus] = useState<'planning' | 'in-progress' | 'completed'>('in-progress');

  // Active Project Code Editor State
  const [activeCode, setActiveCode] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  React.useEffect(() => {
    if (activeProject) {
      setActiveCode(activeProject.code);
      setTerminalOutput([]);
    }
  }, [activeProject?.id]);

  const reloadProjects = () => {
    const fresh = learningStorage.getProjects();
    setProjects(fresh);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim()) return;

    const newProj = learningStorage.addProject({
      title: modalTitle.trim(),
      fileName: modalFileName.trim(),
      category: modalCategory.trim(),
      description: modalDescription.trim(),
      code: modalCode,
      status: modalStatus,
    });

    setIsModalOpen(false);
    reloadProjects();
    setSelectedProjectId(newProj.id);
  };

  const handleAddTemplate = (template: typeof PROJECT_TEMPLATES[0]) => {
    const newProj = learningStorage.addProject({
      title: template.title,
      fileName: template.fileName,
      category: template.category,
      description: template.description,
      code: template.code,
      status: 'completed',
    });
    reloadProjects();
    setSelectedProjectId(newProj.id);
  };

  const handleSaveChanges = () => {
    if (!activeProject) return;
    const updated = {
      ...activeProject,
      code: activeCode,
    };
    learningStorage.updateProject(updated);
    reloadProjects();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      learningStorage.deleteProject(id);
      const remaining = learningStorage.getProjects();
      setProjects(remaining);
      if (remaining.length > 0) {
        setSelectedProjectId(remaining[0].id);
      }
    }
  };

  const handleToggleStatus = () => {
    if (!activeProject) return;
    const nextStatus: Record<UserProject['status'], UserProject['status']> = {
      planning: 'in-progress',
      'in-progress': 'completed',
      completed: 'planning',
    };
    const updated: UserProject = {
      ...activeProject,
      status: nextStatus[activeProject.status],
    };
    learningStorage.updateProject(updated);
    reloadProjects();
  };

  const handleRunActiveProject = () => {
    if (!activeProject) return;
    setIsExecuting(true);
    setTerminalOutput([`$ python3 ${activeProject.fileName}`]);

    // Simulated execution parsing
    const lines = activeCode.split('\n');
    const outputs: string[] = [];

    // Check specific known projects or simulate basic print/loop logic
    if (activeProject.fileName.includes('countdown')) {
      outputs.push('till what number do you want the countdown: 5');
      outputs.push('0...1...2...3...4...5...');
      outputs.push('Countdown completed!');
    } else if (activeProject.fileName.includes('calculator')) {
      outputs.push('15 + 4 = 19');
      outputs.push('15 - 4 = 11');
      outputs.push('15 * 4 = 60');
      outputs.push('15 / 4 = 3.75');
      outputs.push('15 % 4 = 3');
      outputs.push('15 ** 4 = 50625');
    } else {
      // Parse print statements
      lines.forEach((l) => {
        const trimmed = l.trim();
        if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
          const inner = trimmed.slice(6, -1);
          // Simple string literals
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
        outputs.push('Project executed successfully (no stdout produced).');
      }
    }
    outputs.push('--- Process finished with exit code 0 ---');

    outputs.forEach((out, i) => {
      setTimeout(() => {
        setTerminalOutput((prev) => [...prev, out]);
        if (i === outputs.length - 1) {
          setIsExecuting(false);
        }
      }, (i + 1) * 200);
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono mb-3">
            <FolderCode className="w-3.5 h-3.5" />
            <span>Project Storage & Practice Workspace</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Python Practice Projects
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Store, code, practice, and test all your Python projects in one central hub. From CLI tools like <code className="text-indigo-300 font-mono">countdown.py</code> to calculators and games, keep all your learning scripts saved and runnable.
          </p>
        </div>
      </div>

      {/* Starter Templates Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Practice Project Templates (Click to add to your projects):</span>
          </span>
          <button
            onClick={() => {
              setModalTitle('');
              setModalFileName('projects/');
              setModalCategory('CLI Utilities');
              setModalDescription('');
              setModalCode('print("Hello world")\n');
              setModalStatus('in-progress');
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-1 px-3 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Store New Project</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {PROJECT_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.title}
              onClick={() => handleAddTemplate(tmpl)}
              className="p-2.5 rounded-lg bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>{tmpl.title}</span>
                  <span className="text-[10px] text-sky-400 font-mono">{tmpl.category}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{tmpl.description}</p>
              </div>
              <div className="text-[10px] text-amber-300 font-mono mt-2 flex items-center space-x-1">
                <FileCode className="w-3 h-3" />
                <span>{tmpl.fileName}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Project List (Sidebar) & Code Editor + Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Projects Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Stored Projects ({projects.length})
              </span>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            </div>

            <div className="space-y-2">
              {projects.map((proj) => {
                const isSelected = proj.id === activeProject?.id;
                const isDone = proj.status === 'completed';

                return (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-500/50 shadow-md shadow-sky-500/10'
                        : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                          <FileCode className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span className="truncate">{proj.title}</span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          {proj.fileName}
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold shrink-0 ${
                          isDone
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {proj.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-1">{proj.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Project Code & Execution Studio (8 cols) */}
        {activeProject && (
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              {/* Project Header */}
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white">{activeProject.title}</h3>
                    <button
                      onClick={handleToggleStatus}
                      className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                      title="Click to toggle status"
                    >
                      {activeProject.status}
                    </button>
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-0.5 flex items-center space-x-2">
                    <span>{activeProject.fileName}</span>
                    <span>•</span>
                    <span>{activeProject.category}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSaveChanges}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition cursor-pointer"
                    title="Save code changes"
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Saved!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Code</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleRunActiveProject}
                    disabled={isExecuting}
                    className="flex items-center space-x-1.5 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-emerald-500/20 transition cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isExecuting ? 'Running...' : 'Run Project'}</span>
                  </button>

                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                    title="Copy code"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => {
                      const blob = new Blob([activeCode], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = activeProject.fileName.split('/').pop() || 'script.py';
                      a.click();
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                    title="Download .py file"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteProject(activeProject.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Editable Python Code Area */}
              <div className="relative">
                <textarea
                  rows={12}
                  value={activeCode}
                  onChange={(e) => setActiveCode(e.target.value)}
                  className="w-full bg-slate-950 p-4 font-mono text-xs text-sky-200 focus:outline-none focus:ring-1 focus:ring-sky-500/50 leading-relaxed resize-y select-text whitespace-pre border-b border-slate-800"
                  spellCheck={false}
                ></textarea>
              </div>

              {/* Embedded Execution Terminal */}
              <div className="bg-black/85 p-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span className="flex items-center space-x-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Project Execution Console (stdout):</span>
                  </span>
                  {terminalOutput.length > 0 && (
                    <button
                      onClick={() => setTerminalOutput([])}
                      className="text-[11px] text-slate-500 hover:text-slate-300"
                    >
                      clear
                    </button>
                  )}
                </div>

                <div className="font-mono text-xs text-emerald-400 min-h-[90px] max-h-[160px] overflow-auto select-text space-y-1">
                  {terminalOutput.length === 0 ? (
                    <div className="text-slate-600 italic py-4">
                      Click "Run Project" above to execute this script in the Python runtime.
                    </div>
                  ) : (
                    terminalOutput.map((l, i) => (
                      <div
                        key={i}
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
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add New Project */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-4">
              <FolderCode className="w-5 h-5 text-sky-400" />
              <h3 className="text-lg font-bold text-white">Store New Python Project</h3>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weather CLI App, Dice Roller, Web Scraper..."
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    File Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="projects/my_script.py"
                    value={modalFileName}
                    onChange={(e) => setModalFileName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. CLI Utilities, Games, Data"
                    value={modalCategory}
                    onChange={(e) => setModalCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Description / Goal
                </label>
                <input
                  type="text"
                  placeholder="What does this project do?"
                  value={modalDescription}
                  onChange={(e) => setModalDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Python Code
                </label>
                <textarea
                  rows={5}
                  value={modalCode}
                  onChange={(e) => setModalCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sky-200 font-mono text-xs focus:border-sky-500 focus:outline-none whitespace-pre"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold cursor-pointer shadow-lg shadow-sky-500/20"
                >
                  Store Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
