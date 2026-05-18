import { Project, MockEndpoint } from '../types';

const STORAGE_KEYS = {
  PROJECTS: 'proxymocker_projects',
  MOCKS: 'proxymocker_mocks',
};

export const storage = {
  getProjects: (): Project[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
  },

  saveProjects: (projects: Project[]) => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  },

  getMocks: (): MockEndpoint[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MOCKS);
    return data ? JSON.parse(data) : [];
  },

  saveMocks: (mocks: MockEndpoint[]) => {
    localStorage.setItem(STORAGE_KEYS.MOCKS, JSON.stringify(mocks));
  },

  // Helper to add a new project
  addProject: (name: string, baseUrls: string[]): Project => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      baseUrls,
      databaseJson: JSON.stringify({
        users: [
          { id: 1, name: "Alice" },
          { id: 2, name: "Bob" }
        ],
        status: "ok"
      }, null, 2),
      isActive: true,
      createdAt: Date.now(),
    };
    const projects = storage.getProjects();
    storage.saveProjects([...projects, newProject]);
    return newProject;
  },

  // Helper to add a new mock
  addMock: (projectId: string, path: string, method: any): MockEndpoint => {
    const newMock: MockEndpoint = {
      id: crypto.randomUUID(),
      projectId,
      path,
      method,
      responseBody: JSON.stringify({ message: "Success" }, null, 2),
      statusCode: 200,
      delayMs: 0,
      isActive: true,
    };
    const mocks = storage.getMocks();
    storage.saveMocks([...mocks, newMock]);
    return newMock;
  },
};
