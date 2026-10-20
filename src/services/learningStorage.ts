import { LearnedTopic, UserProject, MasteryLevel } from '../types/learning';
import { INITIAL_LEARNED_TOPICS, INITIAL_USER_PROJECTS } from '../data/initialLearnedData';

const TOPICS_STORAGE_KEY = 'learned_python_topics_v1';
const PROJECTS_STORAGE_KEY = 'learned_python_projects_v1';

export const learningStorage = {
  // Topics
  getTopics(): LearnedTopic[] {
    try {
      const data = localStorage.getItem(TOPICS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(INITIAL_LEARNED_TOPICS));
        return INITIAL_LEARNED_TOPICS;
      }
      const existing: LearnedTopic[] = JSON.parse(data);
      const existingIds = new Set(existing.map((t) => t.id));
      const missingInitial = INITIAL_LEARNED_TOPICS.filter((t) => !existingIds.has(t.id));
      if (missingInitial.length > 0) {
        const merged = [...existing, ...missingInitial];
        localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
      return existing;
    } catch {
      return INITIAL_LEARNED_TOPICS;
    }
  },

  saveTopics(topics: LearnedTopic[]): void {
    localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(topics));
  },

  addTopic(topic: Omit<LearnedTopic, 'id' | 'dateLearned'>): LearnedTopic {
    const topics = this.getTopics();
    const newTopic: LearnedTopic = {
      ...topic,
      id: `topic-${Date.now()}`,
      dateLearned: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
    };
    const updated = [newTopic, ...topics];
    this.saveTopics(updated);
    return newTopic;
  },

  updateTopic(topic: LearnedTopic): void {
    const topics = this.getTopics();
    const updated = topics.map((t) => (t.id === topic.id ? { ...topic, updatedAt: new Date().toISOString() } : t));
    this.saveTopics(updated);
  },

  updateTopicMastery(id: string, mastery: MasteryLevel): void {
    const topics = this.getTopics();
    const updated = topics.map((t) => (t.id === id ? { ...t, mastery, updatedAt: new Date().toISOString() } : t));
    this.saveTopics(updated);
  },

  deleteTopic(id: string): void {
    const topics = this.getTopics();
    const updated = topics.filter((t) => t.id !== id);
    this.saveTopics(updated);
  },

  // Projects
  getProjects(): UserProject[] {
    try {
      const data = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(INITIAL_USER_PROJECTS));
        return INITIAL_USER_PROJECTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_USER_PROJECTS;
    }
  },

  saveProjects(projects: UserProject[]): void {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  },

  addProject(project: Omit<UserProject, 'id' | 'createdAt' | 'updatedAt'>): UserProject {
    const projects = this.getProjects();
    const now = new Date().toISOString().split('T')[0];
    const newProject: UserProject = {
      ...project,
      id: `proj-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newProject, ...projects];
    this.saveProjects(updated);
    return newProject;
  },

  updateProject(project: UserProject): void {
    const projects = this.getProjects();
    const updated = projects.map((p) =>
      p.id === project.id ? { ...project, updatedAt: new Date().toISOString().split('T')[0] } : p
    );
    this.saveProjects(updated);
  },

  deleteProject(id: string): void {
    const projects = this.getProjects();
    const updated = projects.filter((p) => p.id !== id);
    this.saveProjects(updated);
  },

  // Export / Import
  exportBackup(): string {
    const data = {
      topics: this.getTopics(),
      projects: this.getProjects(),
      exportedAt: new Date().toISOString(),
      source: 'akhand-dev/learned',
    };
    return JSON.stringify(data, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.topics)) {
        this.saveTopics(parsed.topics);
      }
      if (Array.isArray(parsed.projects)) {
        this.saveProjects(parsed.projects);
      }
      return true;
    } catch {
      return false;
    }
  },

  resetDefaults(): void {
    this.saveTopics(INITIAL_LEARNED_TOPICS);
    this.saveProjects(INITIAL_USER_PROJECTS);
  },
};
