'use client';
import { useState, useEffect } from 'react';
import { User, getCurrentUser, setCurrentUser, MOCK_USERS, getLocalUsers, saveLocalUser } from '@/lib/mock-data';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getCurrentUser());
    setLoading(false);
  }, []);

  const login = (email: string) => {
    // Check both mock and local users
    const found = [...MOCK_USERS, ...getLocalUsers()].find(u => u.email === (email || '').toLowerCase());
    if (found) {
      setCurrentUser(found);
      setUser(found);
      return found;
    }
    return null;
  };

  const register = (newUser: User) => {
    saveLocalUser(newUser);
    setCurrentUser(newUser);
    setUser(newUser);
  };

  const logout = () => {
    setCurrentUser(null);
    setUser(null);
    if (typeof window !== 'undefined') window.location.reload();
  };

  return { user, loading, login, register, logout };
}
