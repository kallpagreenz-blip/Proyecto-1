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

  const login = (emailOrDni: string) => {
    const val = (emailOrDni || '').toLowerCase();
    const found = [...MOCK_USERS, ...getLocalUsers()].find(u => 
      u.email === val || u.dni === val
    );
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

  const checkDni = (dni: string) => {
    return [...MOCK_USERS, ...getLocalUsers()].some(u => u.dni === dni);
  };

  const checkEmail = (email: string) => {
    const val = (email || '').toLowerCase();
    return [...MOCK_USERS, ...getLocalUsers()].some(u => u.email === val);
  };

  const logout = () => {
    setCurrentUser(null);
    setUser(null);
    if (typeof window !== 'undefined') window.location.reload();
  };

  return { user, loading, login, register, checkDni, checkEmail, logout };
}
