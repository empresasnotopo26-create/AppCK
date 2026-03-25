import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AppResponse, AppState } from '../types';

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AppContextType extends AppState {
  registerUser: (name: string, email: string, password?: string) => AuthResult;
  loginUser: (email: string, password?: string) => AuthResult;
  logout: () => void;
  saveResponse: (type: AppResponse['type'], data: any) => void;
  addWinner: (user: User) => void;
  clearWinners: () => void;
}

const generateMockData = (): AppState => {
  const mockUsers: User[] = [
    { id: '1', name: 'João Silva', email: 'joao@empresa.com', password: '123', createdAt: new Date().toISOString() },
    { id: '2', name: 'Maria Souza', email: 'maria@tech.com', password: '123', createdAt: new Date().toISOString() },
  ];

  const mockResponses: AppResponse[] = [
    {
      id: 'r1', userId: '1', type: 'pesquisa', createdAt: new Date().toISOString(),
      data: { revenue: 'R$ 1 milhão a R$ 5 milhões', biggestChallenge: 'Escalar vendas mantendo a qualidade', aiDoubts: 'Como implementar IA no atendimento?' }
    },
    {
      id: 'r7', userId: '1', type: 'pre-almoco', createdAt: new Date().toISOString(),
      data: { dataClarity: 4, processExecution: 3, salesPredictability: 2, customerEvaluation: 5 }
    },
    {
      id: 'r8', userId: '1', type: 'quiz', createdAt: new Date().toISOString(),
      data: { q1: 'Sim', q2: 'Marketing', q3: 'Nunca testei', q4: 'Em algumas áreas' }
    }
  ];

  return {
    users: mockUsers,
    currentUser: null,
    responses: mockResponses,
    winners: [],
  };
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('app-ck-data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return generateMockData();
      }
    }
    return generateMockData();
  });

  useEffect(() => {
    localStorage.setItem('app-ck-data', JSON.stringify(state));
  }, [state]);

  const registerUser = (name: string, email: string, password?: string): AuthResult => {
    const existingUser = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      return { success: false, error: 'Este e-mail já está cadastrado. Faça login.' };
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUser: newUser,
    }));

    return { success: true };
  };

  const loginUser = (email: string, password?: string): AuthResult => {
    const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return { success: false, error: 'E-mail não encontrado.' };
    }

    // Se o usuário tem senha (usuários novos) ou estamos usando os mocks
    if (user.password && user.password !== password) {
      return { success: false, error: 'Senha incorreta.' };
    }

    setState(prev => ({ ...prev, currentUser: user }));
    return { success: true };
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
  };

  const saveResponse = (type: AppResponse['type'], data: any) => {
    if (!state.currentUser) return;
    
    const newResponse: AppResponse = {
      id: Math.random().toString(36).substr(2, 9),
      userId: state.currentUser.id,
      type,
      createdAt: new Date().toISOString(),
      data,
    } as AppResponse;

    setState(prev => {
      const filteredResponses = prev.responses.filter(r => !(r.userId === prev.currentUser?.id && r.type === type));
      return {
        ...prev,
        responses: [...filteredResponses, newResponse],
      };
    });
  };

  const addWinner = (user: User) => {
    setState(prev => ({ ...prev, winners: [...prev.winners, user] }));
  };

  const clearWinners = () => {
    setState(prev => ({ ...prev, winners: [] }));
  };

  return (
    <AppContext.Provider value={{ ...state, registerUser, loginUser, logout, saveResponse, addWinner, clearWinners }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};