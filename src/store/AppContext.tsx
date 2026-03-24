import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AppResponse, AppState } from '../types';

interface AppContextType extends AppState {
  registerUser: (name: string, email: string) => void;
  logout: () => void;
  saveResponse: (type: AppResponse['type'], data: any) => void;
  addWinner: (user: User) => void;
  clearWinners: () => void;
}

const generateMockData = (): AppState => {
  const mockUsers: User[] = [
    { id: '1', name: 'João Silva', email: 'joao@empresa.com', createdAt: new Date().toISOString() },
    { id: '2', name: 'Maria Souza', email: 'maria@tech.com', createdAt: new Date().toISOString() },
    { id: '3', name: 'Carlos Santos', email: 'carlos@inovacao.com.br', createdAt: new Date().toISOString() },
    { id: '4', name: 'Ana Oliveira', email: 'ana@startup.io', createdAt: new Date().toISOString() },
    { id: '5', name: 'Pedro Costa', email: 'pedro@digital.com', createdAt: new Date().toISOString() },
  ];

  const mockResponses: AppResponse[] = [
    {
      id: 'r1', userId: '1', type: 'pesquisa', createdAt: new Date().toISOString(),
      data: { revenue: 'R$ 1 milhão a R$ 5 milhões', biggestChallenge: 'Escalar vendas mantendo a qualidade', aiDoubts: 'Como implementar IA no atendimento?' }
    },
    {
      id: 'r2', userId: '2', type: 'pesquisa', createdAt: new Date().toISOString(),
      data: { revenue: 'Acima de R$ 10 milhões', biggestChallenge: 'Retenção de talentos', aiDoubts: 'Segurança de dados com LLMs' }
    },
    {
      id: 'r3', userId: '3', type: 'pesquisa', createdAt: new Date().toISOString(),
      data: { revenue: 'R$ 360 mil a R$ 1 milhão', biggestChallenge: 'Geração de leads qualificados', aiDoubts: 'Qual ferramenta usar para marketing?' }
    },
    {
      id: 'r4', userId: '1', type: 'nps', createdAt: new Date().toISOString(),
      data: { score: 10, suggestion: 'Conteúdo incrível, parabéns!' }
    },
    {
      id: 'r5', userId: '2', type: 'nps', createdAt: new Date().toISOString(),
      data: { score: 9, suggestion: 'Poderia ter mais tempo para networking.' }
    },
    {
      id: 'r6', userId: '3', type: 'nps', createdAt: new Date().toISOString(),
      data: { score: 6, suggestion: 'Alguns temas foram muito básicos.' }
    },
    {
      id: 'r7', userId: '1', type: 'pre-almoco', createdAt: new Date().toISOString(),
      data: { clarityScore: 5, usefulnessScore: 5, relevantTheme: 'Automação de Processos', afternoonDoubts: 'Exemplos práticos de agentes' }
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

  const registerUser = (name: string, email: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUser: newUser,
    }));
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
      // Remover resposta anterior do mesmo tipo para o mesmo usuário (permite edição/reatualização)
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
    <AppContext.Provider value={{ ...state, registerUser, logout, saveResponse, addWinner, clearWinners }}>
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