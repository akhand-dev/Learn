import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { Overview } from './components/Overview';
import { LearnedJournal } from './components/LearnedJournal';
import { MyProjectsLab } from './components/MyProjectsLab';
import { CountdownLab } from './components/CountdownLab';
import { PrintMasteryLab } from './components/PrintMasteryLab';
import { OperatorsDataLab } from './components/OperatorsDataLab';
import { TerminalRunner } from './components/TerminalRunner';
import { VirtualFileSystem } from './components/VirtualFileSystem';
import { ORIGINAL_SCRIPTS } from './data/scriptsData';
import { learningStorage } from './services/learningStorage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [replInitialCode, setReplInitialCode] = useState<string>('');

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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <Overview
            onNavigate={setActiveTab}
            onRunScript={handleSelectScriptToRun}
            learnedCount={learnedCount}
            projectsCount={projectsCount}
          />
        )}

        {activeTab === 'learned' && (
          <LearnedJournal onOpenInRunner={handleOpenSnippetInREPL} />
        )}

        {activeTab === 'my-projects' && (
          <MyProjectsLab onOpenInRunner={handleOpenSnippetInREPL} />
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
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span>akhand-dev / learned</span>
            <span>•</span>
            <span>Practice Python, Log What You Learn, Store Projects</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <span>React 19</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
