export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export interface Project {
  id: string;
  name: string;
  baseUrls: string[]; // List of base URLs that point to this project
  databaseJson?: string; // Global JSON database for this project
  isActive: boolean;
  createdAt: number;
}

export interface MockEndpoint {
  id: string;
  projectId: string;
  path: string; // The relative path, e.g., /users
  method: HttpMethod;
  responseBody: string; // JSON string
  statusCode: number;
  delayMs: number;
  isActive: boolean;
}

export interface PlaygroundLog {
  id: string;
  timestamp: number;
  url: string;
  method: string;
  status: number;
  intercepted: boolean;
  response: any;
}
