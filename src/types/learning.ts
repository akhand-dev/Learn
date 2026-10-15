export type MasteryLevel = 'learning' | 'practicing' | 'mastered';

export type TopicCategory =
  | 'Basics & Syntax'
  | 'I/O & Formatting'
  | 'Operators & Math'
  | 'Loops & Time'
  | 'Data Structures'
  | 'Object-Oriented (OOP)'
  | 'Modules & Pip'
  | 'Custom Project';

export interface LearnedTopic {
  id: string;
  title: string;
  category: TopicCategory;
  summary: string;
  notes: string;
  codeSnippet: string;
  sampleOutput?: string;
  mastery: MasteryLevel;
  tags: string[];
  dateLearned: string;
  updatedAt?: string;
}

export interface UserProject {
  id: string;
  title: string;
  fileName: string;
  category: string;
  description: string;
  code: string;
  expectedOutput?: string;
  status: 'planning' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}
