import type React from 'react';
import type { User } from './user.interface';
import type { BackendNotification } from './notification.interface';

export interface RegistrationCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: string;
  referralCode?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: User | null;
  accountBalance: number | null;
  setAccountBalance: React.Dispatch<React.SetStateAction<number | null>>;
  response: User | null;
  user: User | null;
  register: (credentials: RegistrationCredentials) => Promise<any>;
  login: (credentials: LoginCredentials) => Promise<any>;
  logout: () => void;
}

export interface ProviderProps {
  children: React.ReactNode;
}

export interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}

export interface NotificationContextProps {
  notifications: BackendNotification[];
  unreadCount: number;
  isEmptyState: boolean;
  isLoading: boolean;
  setIsEmptyState: React.Dispatch<React.SetStateAction<boolean>>;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  deleteNotification: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => void;
  refetch: () => Promise<void>;
}
