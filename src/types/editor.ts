export type FolderType = 'learned' | 'projects' | 'root';

export interface VirtualFile {
  id: string;
  name: string;
  path: string;
  folder: FolderType;
  content: string;
  summary: string;
  notes: string;
  tags: string[];
  mastery: 'learning' | 'practicing' | 'mastered';
  revisionCount: number;
  lastRevised?: string;
  createdAt: string;
  updatedAt: string;
  isReadOnly?: boolean;
}

export interface OpenTab {
  fileId: string;
  isDirty?: boolean;
}
