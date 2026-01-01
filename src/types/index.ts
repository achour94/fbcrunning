export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isApproved: boolean;
  createdAt: string;
}

export interface Run {
  id: string;
  creatorId: string;
  creatorName: string;
  location: string;
  date: string;
  program: string;
  status: 'pending' | 'approved';
  attendees: string[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
