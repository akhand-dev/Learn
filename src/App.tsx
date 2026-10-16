import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { Overview } from './components/Overview';
import { VSCodeIDE } from './components/VSCodeIDE/VSCodeIDE';
import { LearnedJournal } from './components/LearnedJournal';
import { MyProjectsLab } from './components/MyProjectsLab';
import { CountdownLab } from './components/CountdownLab';
import { PrintMasteryLab } from './components/PrintMasteryLab';
import { OperatorsDataLab } from './components/OperatorsDataLab';
import { TerminalRunner } from './components/TerminalRunner';
import { VirtualFileSystem } from './components/VirtualFileSystem';
import { ORIGINAL_SCRIPTS } from './data/scriptsData';
import { learningStorage } from './services/learningStorage';
import { virtualWorkspace } from './services/virtualWorkspace';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('vscode');
  const [replInitialCode, setReplInitialCode] = useState<string>('');
  const [selectedFileForIDE, setSelectedFileForIDE] = useState<string>('learned-print-basics');

  // Counts for topics and projects
  const [learnedCount, setLearnedCount] = useState<number>(() => learningStorage.getTopics().length);
  const [projectsCount, setProjectsCount] = useState<number>(() => learningStorage.getProjects().length);

  // Virtual file system state: records updates like when start1.py writes create.py
  const [virtualFiles, setVirtualFiles] = useState<Record<string, string>>({
    'create.py': "print('hello, it is created by start1.py')\n",
  });

  const refreshCounts = () => {
    setLearnedCount(learningStorage.getTopics().length);
    setProjectsCount(learningStorage.getProjects().length);
  };

  useEffect(() => {
    refreshCounts();
  }, [activeTab]);

  const handleFileWrite = (filename: string, content: string) => {
    setVirtualFiles((prev) => ({
      ...prev,
      [filename]: content,
    }));
  };

  const handleSelectScriptToRun = (_scriptId: string) => {
    setActiveTab('runner');
  };

  const handleOpenSnippetInREPL = (code: string) => {
    setReplInitialCode(code);
    setActiveTab('runner');
  };

  const handleOpenFileInIDE = (targetIdOrName: string) => {
    const allFiles = virtualWorkspace.getFiles();
    // Try matching by id, name, or path
    const match = allFiles.find(
      (f) =>
        f.id === targetIdOrName ||
        f.name === targetIdOrName ||
        f.path === targetIdOrName ||
        f.path.includes(targetIdOrName) ||
        targetIdOrName.includes(f.name)
    );
    if (match) {
      setSelectedFileForIDE(match.id);
    }
    setActiveTab('vscode');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        fileCount={ORIGINAL_SCRIPTS.length}
        learnedCount={learnedCount}
        projectsCount={projectsCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'vscode' && (
          <VSCodeIDE initialFileId={selectedFileForIDE} />
        )}

        {activeTab === 'overview' && (
          <Overview
            onNavigate={setActiveTab}
            onRunScript={handleSelectScriptToRun}
            learnedCount={learnedCount}
            projectsCount={projectsCount}
          />
        )}

        {activeTab === 'learned' && (
          <LearnedJournal
            onOpenInRunner={handleOpenSnippetInREPL}
            onOpenInIDE={handleOpenFileInIDE}
          />
        )}

        {activeTab === 'my-projects' && (
          <MyProjectsLab
            onOpenInRunner={handleOpenSnippetInREPL}
            onOpenInIDE={handleOpenFileInIDE}
          />
        )}

        {activeTab === 'countdown' && <CountdownLab />}

        {activeTab === 'print-mastery' && (
          <PrintMasteryLab
            onFileWriteTriggered={handleFileWrite}
            virtualFiles={virtualFiles}
          />
        )}

        {activeTab === 'operators' && <OperatorsDataLab />}

        {activeTab === 'runner' && (
          <TerminalRunner
            virtualFiles={virtualFiles}
            initialCode={replInitialCode}
          />
        )}

        {activeTab === 'files' && (
          <VirtualFileSystem
            virtualFiles={virtualFiles}
            onSelectScriptToRun={handleSelectScriptToRun}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-400">akhand-dev / learned</span>
            <span>•</span>
            <span>VS Code Python Environment: <code className="text-sky-400">learned/</code> and <code className="text-indigo-400">projects/</code></span>
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <span>Ctrl+S to Save</span>
            <span>•</span>
            <span>F5 to Run</span>
            <span>•</span>
            <span>Python 3.12</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
