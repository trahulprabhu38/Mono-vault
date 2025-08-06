import axios from 'axios';
import { User, Bookmark, Password, Folder } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mono vault_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },

  verifyToken: async (token: string) => {
    const response = await api.post('/auth/verify-token', { token });
    return response.data;
  },
};

export const bookmarksAPI = {
  getAll: async (): Promise<Bookmark[]> => {
    const response = await api.get('/bookmarks');
    return response.data;
  },
  create: async (bookmark: Partial<Bookmark>): Promise<Bookmark> => {
    const response = await api.post('/bookmarks', bookmark);
    return response.data;
  },
  update: async (id: string, bookmark: Partial<Bookmark>): Promise<Bookmark> => {
    const response = await api.put(`/bookmarks/${id}`, bookmark);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/bookmarks/${id}`);
  },
};

export const foldersAPI = {
  getAll: async (): Promise<Folder[]> => {
    const response = await api.get('/folders');
    return response.data;
  },
  create: async (folder: Partial<Folder>): Promise<Folder> => {
    const response = await api.post('/folders', folder);
    return response.data;
  },
  // If update/delete endpoints are added on backend, implement here
};

export const passwordsAPI = {
  getAll: async (): Promise<Password[]> => {
    const response = await api.get('/passwords');
    return response.data;
  },
  create: async (password: Partial<Password>): Promise<Password> => {
    const response = await api.post('/passwords', password);
    return response.data;
  },
  update: async (id: string, password: Partial<Password>): Promise<Password> => {
    const response = await api.put(`/passwords/${id}`, password);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/passwords/${id}`);
  },
};