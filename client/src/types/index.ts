export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: string;
  _id?: string; // for backend compatibility
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  favicon?: string;
  folderId?: string;
  folder?: string; // for backend compatibility
  userId: string;
  isStarred: boolean;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
  _id?: string; // for backend compatibility
}

export interface Password {
  id: string;
  title: string;
  username: string;
  encryptedPassword: string;
  url?: string;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}