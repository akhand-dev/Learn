import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Copy,
  Check,
  Trash2,
  Edit3,
  X,
  Lightbulb,
  ExternalLink,
  Play
} from 'lucide-react';
import { LearnedTopic, TopicCategory, MasteryLevel } from '../types/learning';
import { learningStorage } from '../services/learningStorage';

const CATEGORIES: TopicCategory[] = [
  'Basics & Syntax',
  'I/O & Formatting',
  'Operators & Math',
  'Loops & Time',
  'Data Structures',
  'Object-Oriented (OOP)',
  'Modules & Pip',
  'Custom Project',
];

const SUGGESTED_LEARNINGS = [
  {
    title: 'List Comprehensions',
    category: 'Data Structures' as TopicCategory,
    summary: 'A concise way to create lists using [expression for item in iterable if condition].',
    notes: 'Replaces verbose for-loops with map/filter expressions. Much faster in CPython due to optimized bytecode.',
    codeSnippet: `numbers = [1, 2, 3, 4, 5]
squares = [n ** 2 for n in numbers if n % 2 == 1]
print("Odd squares:", squares)`,
    sampleOutput: `Odd squares: [1, 9, 25]`,
    tags: 'lists, comprehensions, syntax',
    mastery: 'learning' as MasteryLevel,
  },
  {
    title: 'Exception Handling with try / except / finally',
    category: 'Basics & Syntax' as TopicCategory,
    summary: 'Catching runtime errors gracefully to prevent Python script crashes.',
    notes: 'Never catch bare except:. Always specify the exception type like ValueError or ZeroDivisionError. finally always runs.',
    codeSnippet: `try:
    x = int("not_a_number")
except ValueError as e:
    print(f"Caught error: {e}")
finally:
    print("Cleanup completed.")`,
    sampleOutput: `Caught error: invalid literal for int() with base 10: 'not_a_number'
Cleanup completed.`,
    tags: 'exceptions, errors, try-except',
    mastery: 'practicing' as MasteryLevel,
  },
  {
    title: 'Lambda Functions & map()',
    category: 'Basics & Syntax' as TopicCategory,
    summary: 'Anonymous inline one-line functions in Python.',
    notes: 'Syntax: lambda arguments: expression. Useful for sorting keys or quick mapping.',
    codeSnippet: `double = lambda x: x * 2
print("5 doubled is:", double(5))

nums = [1, 2, 3]
print("Mapped:", list(map(lambda x: x + 10, nums)))`,
    sampleOutput: `5 doubled is: 10
Mapped: [11, 12, 13]`,
    tags: 'lambdas, functional, functions',
    mastery: 'learning' as MasteryLevel,
  },
];

interface LearnedJournalProps {
  onOpenInRunner?: (code: string) => void;
}

export const LearnedJournal: React.FC<LearnedJournalProps> = ({ onOpenInRunner }) => {
  const [topics, setTopics] = useState<LearnedTopic[]>(() => learningStorage.getTopics());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMastery, setSelectedMastery] = useState<string>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTopic, setEditingTopic] = useState<LearnedTopic | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState<string>('');
  const [formCategory, setFormCategory] = useState<TopicCategory>('Basics & Syntax');
  const [formSummary, setFormSummary] = useState<string>('');
  const [formNotes, setFormNotes] = useState<string>('');
  const [formCode, setFormCode] = useState<string>('');
  const [formOutput, setFormOutput] = useState<string>('');
  const [formMastery, setFormMastery] = useState<MasteryLevel>('learning');
  const [formTags, setFormTags] = useState<string>('');

  // Snippet Copy State
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quick Run Test State
  const [testingTopicId, setTestingTopicId] = useState<string | null>(null);

  const reloadTopics = () => {
    setTopics(learningStorage.getTopics());
  };

  const handleOpenAddModal = () => {
    setEditingTopic(null);
    setFormTitle('');
    setFormCategory('Basics & Syntax');
    setFormSummary('');
    setFormNotes('');
    setFormCode('');
    setFormOutput('');
    setFormMastery('learning');
    setFormTags('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (topic: LearnedTopic) => {
    setEditingTopic(topic);
    setFormTitle(topic.title);
    setFormCategory(topic.category);
    setFormSummary(topic.summary);
    setFormNotes(topic.notes);
    setFormCode(topic.codeSnippet);
    setFormOutput(topic.sampleOutput || '');
    setFormMastery(topic.mastery);
    setFormTags(topic.tags.join(', '));
    setIsModalOpen(true);
  };

  const handleSaveTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    if (editingTopic) {
      learningStorage.updateTopic({
        ...editingTopic,
        title: formTitle.trim(),
        category: formCategory,
        summary: formSummary.trim(),
        notes: formNotes.trim(),
        codeSnippet: formCode.trim(),
        sampleOutput: formOutput.trim() || undefined,
        mastery: formMastery,
        tags: tagsArray,
      });
    } else {
      learningStorage.addTopic({
        title: formTitle.trim(),
        category: formCategory,
        summary: formSummary.trim(),
        notes: formNotes.trim(),
        codeSnippet: formCode.trim(),
        sampleOutput: formOutput.trim() || undefined,
        mastery: formMastery,
        tags: tagsArray,
      });
    }

    setIsModalOpen(false);
    reloadTopics();
  };

  const handleDeleteTopic = (id: string) => {
    if (confirm('Delete this learned topic from your workbook?')) {
      learningStorage.deleteTopic(id);
      reloadTopics();
    }
  };

  const handleToggleMastery = (topic: LearnedTopic) => {
    const nextMastery: Record<MasteryLevel, MasteryLevel> = {
      learning: 'practicing',
      practicing: 'mastered',
      mastered: 'learning',
    };
    const next = nextMastery[topic.mastery];
    learningStorage.updateTopicMastery(topic.id, next);
    reloadTopics();
  };

  const handleCopySnippet = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFillSuggestion = (suggestion: typeof SUGGESTED_LEARNINGS[0]) => {
    setFormTitle(suggestion.title);
    setFormCategory(suggestion.category);
    setFormSummary(suggestion.summary);
    setFormNotes(suggestion.notes);
    setFormCode(suggestion.codeSnippet);
    setFormOutput(suggestion.sampleOutput);
    setFormMastery(suggestion.mastery);
    setFormTags(suggestion.tags);
  };

  // Filtered Topics
  const filteredTopics = topics.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.codeSnippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesMastery = selectedMastery === 'All' || t.mastery === selectedMastery;

    return matchesSearch && matchesCategory && matchesMastery;
  });

  // Stats calculation
  const totalCount = topics.length;
  const masteredCount = topics.filter((t) => t.mastery === 'mastered').length;
  const practicingCount = topics.filter((t) => t.mastery === 'practicing').length;
  const learningCount = topics.filter((t) => t.mastery === 'learning').length;
  const masteryPercentage = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-mono mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Learning Tracker & Knowledge Base</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            What I Have Learned in Python
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Record every concept, syntax rule, function, and insight you discover while practicing. Review your notes, copy verified code snippets, and mark your mastery progress.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Total Topics
            </span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">{totalCount}</div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold block">
              Mastered
            </span>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
              {masteredCount}{' '}
              <span className="text-xs text-slate-400 font-normal">({masteryPercentage}%)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold block">
              Practicing
            </span>
            <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">{practicingCount}</div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-sky-400 font-semibold block">
              Currently Learning
            </span>
            <div className="text-2xl font-black text-sky-400 font-mono mt-0.5">{learningCount}</div>
          </div>
        </div>
      </div>

      {/* Action Header & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search learned topics, code, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Add What I Learned Button */}
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-sky-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add What I Learned</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 text-[11px] font-mono mr-1">Category:</span>
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-bold'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          All ({topics.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = topics.filter((t) => t.category === cat).length;
          if (count === 0 && selectedCategory !== cat) return null;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}

        <div className="h-4 w-px bg-slate-800 mx-1"></div>

        <span className="text-slate-400 text-[11px] font-mono mr-1">Mastery:</span>
        {['All', 'mastered', 'practicing', 'learning'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedMastery(status)}
            className={`px-2.5 py-1 rounded-lg border capitalize transition cursor-pointer ${
              selectedMastery === status
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Learned Topics Cards Grid */}
      {filteredTopics.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No learned topics match your search</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or add a new topic to your Python notebook.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-sky-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg cursor-pointer"
          >
            Add New Topic
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTopics.map((topic) => {
            const isMastered = topic.mastery === 'mastered';
            const isPracticing = topic.mastery === 'practicing';
            const isTesting = testingTopicId === topic.id;

            return (
              <div
                key={topic.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/80 transition flex flex-col justify-between shadow-xl space-y-4 group"
              >
                {/* Header & Badges */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700/60 inline-block">
                        {topic.category}
                      </span>
                      <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                        {topic.title}
                      </h3>
                    </div>

                    {/* Mastery Clickable Badge */}
                    <button
                      onClick={() => handleToggleMastery(topic)}
                      title="Click to cycle status: Learning -> Practicing -> Mastered"
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition cursor-pointer flex items-center space-x-1 shrink-0 ${
                        isMastered
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : isPracticing
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                      }`}
                    >
                      {isMastered && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      {isPracticing && <Clock className="w-3 h-3 text-amber-400" />}
                      {!isMastered && !isPracticing && <Sparkles className="w-3 h-3 text-sky-400" />}
                      <span className="capitalize">{topic.mastery}</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{topic.summary}</p>
                </div>

                {/* Code Snippet Box */}
                {topic.codeSnippet && (
                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                      <span>Python Snippet</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCopySnippet(topic.id, topic.codeSnippet)}
                          className="hover:text-white transition flex items-center space-x-1 cursor-pointer"
                          title="Copy snippet"
                        >
                          {copiedId === topic.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-[10px] text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span className="text-[10px]">Copy</span>
                            </>
                          )}
                        </button>

                        {onOpenInRunner && (
                          <button
                            onClick={() => onOpenInRunner(topic.codeSnippet)}
                            className="hover:text-sky-300 transition flex items-center space-x-1 cursor-pointer"
                            title="Open in REPL"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span className="text-[10px]">REPL</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <pre className="p-3 text-xs font-mono text-amber-300/90 overflow-x-auto whitespace-pre leading-relaxed select-text">
                      {topic.codeSnippet}
                    </pre>

                    {/* Quick interactive test runner for sample output */}
                    {topic.sampleOutput && (
                      <div className="border-t border-slate-800/80 bg-black/40 p-2.5 text-[11px] font-mono">
                        <div className="flex items-center justify-between text-slate-500 mb-1">
                          <span>Output:</span>
                          <button
                            onClick={() => setTestingTopicId(isTesting ? null : topic.id)}
                            className="text-sky-400 hover:text-sky-300 flex items-center space-x-1 cursor-pointer"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>{isTesting ? 'Hide Output' : 'View Output'}</span>
                          </button>
                        </div>
                        {isTesting && (
                          <pre className="text-emerald-400 whitespace-pre-wrap pt-1 font-semibold">
                            {topic.sampleOutput}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Key Takeaways Notes */}
                {topic.notes && (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start space-x-2">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed text-[11px] text-slate-300">{topic.notes}</p>
                  </div>
                )}

                {/* Footer: Tags, Date, and Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex flex-wrap items-center gap-1">
                    {topic.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 bg-slate-800/80 text-slate-400 rounded font-mono text-[10px]"
                      >
                        #{tag}
                      </span>
                    ))}
                    <span className="text-[10px] text-slate-500 ml-1">• {topic.dateLearned}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(topic)}
                      className="p-1 rounded text-slate-400 hover:text-white transition cursor-pointer"
                      title="Edit topic"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTopic(topic.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 transition cursor-pointer"
                      title="Delete topic"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="w-5 h-5 text-sky-400" />
              <h3 className="text-lg font-bold text-white">
                {editingTopic ? 'Edit Learned Topic' : 'Add What I Have Learned'}
              </h3>
            </div>

            {/* Quick Suggestions for new topics */}
            {!editingTopic && (
              <div className="mb-5 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Quick Ideas to Add:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_LEARNINGS.map((sug) => (
                    <button
                      key={sug.title}
                      type="button"
                      onClick={() => handleFillSuggestion(sug)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-300 text-xs font-medium border border-slate-700/80 cursor-pointer transition"
                    >
                      + {sug.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSaveTopic} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Topic Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. List Comprehensions, Lambda Functions, Python Sets..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as TopicCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Mastery Status
                  </label>
                  <select
                    value={formMastery}
                    onChange={(e) => setFormMastery(e.target.value as MasteryLevel)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-none"
                  >
                    <option value="learning">Learning (Just started)</option>
                    <option value="practicing">Practicing (Writing code)</option>
                    <option value="mastered">Mastered (Confident)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  One-Line Summary
                </label>
                <input
                  type="text"
                  placeholder="Short 1-sentence summary of what this feature does..."
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Python Code Snippet
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste or write the Python code you tested..."
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-amber-300 font-mono text-xs focus:border-sky-500 focus:outline-none whitespace-pre"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Expected / Sample Output
                </label>
                <textarea
                  rows={2}
                  placeholder="What does running this code output to terminal?"
                  value={formOutput}
                  onChange={(e) => setFormOutput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-emerald-400 font-mono text-xs focus:border-sky-500 focus:outline-none whitespace-pre"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Key Takeaways & Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="What should you remember? Any syntax quirks or performance notes?"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs focus:border-sky-500 focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. loops, strings, time, file-io"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-none"
                />
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
                  {editingTopic ? 'Save Changes' : 'Save Learned Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
