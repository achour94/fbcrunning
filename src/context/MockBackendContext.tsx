import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Run, AuthState } from '@/types';

interface MockBackendContextType {
  // Auth
  authState: AuthState;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  
  // Users
  users: User[];
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  getPendingUsers: () => User[];
  
  // Runs
  runs: Run[];
  createRun: (location: string, date: string, program: string) => { success: boolean; error?: string };
  approveRun: (runId: string) => void;
  rejectRun: (runId: string) => void;
  joinRun: (runId: string) => void;
  leaveRun: (runId: string) => void;
  getApprovedRuns: () => Run[];
  getPendingRuns: () => Run[];
  getUserRuns: (userId: string) => Run[];
}

const MockBackendContext = createContext<MockBackendContextType | null>(null);

const STORAGE_KEYS = {
  USERS: 'fbc_users',
  RUNS: 'fbc_runs',
  AUTH: 'fbc_auth',
};

const DEFAULT_ADMIN: User = {
  id: 'admin-001',
  name: 'Admin',
  email: 'admin@runclub.com',
  password: 'admin123',
  role: 'admin',
  isApproved: true,
  createdAt: new Date().toISOString(),
};

const generateId = () => Math.random().toString(36).substring(2, 15);

export const MockBackendProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [authState, setAuthState] = useState<AuthState>({ user: null, isAuthenticated: false });

  // Initialize data from localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    const storedRuns = localStorage.getItem(STORAGE_KEYS.RUNS);
    const storedAuth = localStorage.getItem(STORAGE_KEYS.AUTH);

    let initialUsers: User[] = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Ensure admin exists
    const adminExists = initialUsers.some(u => u.email === DEFAULT_ADMIN.email);
    if (!adminExists) {
      initialUsers = [...initialUsers, DEFAULT_ADMIN];
    }
    
    setUsers(initialUsers);
    setRuns(storedRuns ? JSON.parse(storedRuns) : []);
    
    if (storedAuth) {
      const auth = JSON.parse(storedAuth);
      // Verify user still exists
      const user = initialUsers.find(u => u.id === auth.user?.id);
      if (user) {
        setAuthState({ user, isAuthenticated: true });
      }
    }
  }, []);

  // Persist users
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  }, [users]);

  // Persist runs
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RUNS, JSON.stringify(runs));
  }, [runs]);

  // Persist auth
  useEffect(() => {
    if (authState.isAuthenticated) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authState));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  }, [authState]);

  const login = useCallback((email: string, password: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    if (!user.isApproved) {
      return { success: false, error: 'Your account is pending admin approval. Please wait!' };
    }
    
    setAuthState({ user, isAuthenticated: true });
    return { success: true };
  }, [users]);

  const signup = useCallback((name: string, email: string, password: string) => {
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (exists) {
      return { success: false, error: 'An account with this email already exists' };
    }
    
    const newUser: User = {
      id: generateId(),
      name,
      email,
      password,
      role: 'member',
      isApproved: false,
      createdAt: new Date().toISOString(),
    };
    
    setUsers(prev => [...prev, newUser]);
    return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    setAuthState({ user: null, isAuthenticated: false });
  }, []);

  const approveUser = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, isApproved: true } : u
    ));
  }, []);

  const rejectUser = useCallback((userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  }, []);

  const getPendingUsers = useCallback(() => {
    return users.filter(u => !u.isApproved);
  }, [users]);

  const createRun = useCallback((location: string, date: string, program: string) => {
    if (!authState.user) {
      return { success: false, error: 'You must be logged in to create a run' };
    }
    
    const newRun: Run = {
      id: generateId(),
      creatorId: authState.user.id,
      creatorName: authState.user.name,
      location,
      date,
      program,
      status: authState.user.role === 'admin' ? 'approved' : 'pending',
      attendees: [authState.user.id],
      createdAt: new Date().toISOString(),
    };
    
    setRuns(prev => [...prev, newRun]);
    return { success: true };
  }, [authState.user]);

  const approveRun = useCallback((runId: string) => {
    setRuns(prev => prev.map(r => 
      r.id === runId ? { ...r, status: 'approved' } : r
    ));
  }, []);

  const rejectRun = useCallback((runId: string) => {
    setRuns(prev => prev.filter(r => r.id !== runId));
  }, []);

  const joinRun = useCallback((runId: string) => {
    if (!authState.user) return;
    
    setRuns(prev => prev.map(r => {
      if (r.id === runId && !r.attendees.includes(authState.user!.id)) {
        return { ...r, attendees: [...r.attendees, authState.user!.id] };
      }
      return r;
    }));
  }, [authState.user]);

  const leaveRun = useCallback((runId: string) => {
    if (!authState.user) return;
    
    setRuns(prev => prev.map(r => {
      if (r.id === runId) {
        return { ...r, attendees: r.attendees.filter(id => id !== authState.user!.id) };
      }
      return r;
    }));
  }, [authState.user]);

  const getApprovedRuns = useCallback(() => {
    return runs
      .filter(r => r.status === 'approved')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [runs]);

  const getPendingRuns = useCallback(() => {
    return runs.filter(r => r.status === 'pending');
  }, [runs]);

  const getUserRuns = useCallback((userId: string) => {
    return runs.filter(r => r.attendees.includes(userId));
  }, [runs]);

  return (
    <MockBackendContext.Provider value={{
      authState,
      login,
      signup,
      logout,
      users,
      approveUser,
      rejectUser,
      getPendingUsers,
      runs,
      createRun,
      approveRun,
      rejectRun,
      joinRun,
      leaveRun,
      getApprovedRuns,
      getPendingRuns,
      getUserRuns,
    }}>
      {children}
    </MockBackendContext.Provider>
  );
};

export const useBackend = () => {
  const context = useContext(MockBackendContext);
  if (!context) {
    throw new Error('useBackend must be used within MockBackendProvider');
  }
  return context;
};
