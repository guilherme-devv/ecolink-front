import { createContext, useContext, useState, ReactNode } from 'react';
import { AuthContextType, AuthResponse, UserData } from '../types/auth';
import api from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { username, password });
      const { access_token, name, email, type, document } = response.data;

      setUser({ name, email, type, document });
      setToken(access_token);

      localStorage.setItem('authToken', access_token);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw new Error('Credenciais inválidas ou erro na API');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
