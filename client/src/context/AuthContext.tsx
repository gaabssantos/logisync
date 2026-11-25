import React, { createContext, useContext, useState, useEffect } from 'react';
import { TOKEN_KEY } from '../services/api';

export interface User {
  name: string;
  email: string;
  type: 'empresa' | 'usuario' | 'motorista';
  document?: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User, token?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('@LogiSync:user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('@LogiSync:user', JSON.stringify(user));
    } else {
      localStorage.removeItem('@LogiSync:user');
    }
  }, [user]);

  const login = (userData: User, token?: string) => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
