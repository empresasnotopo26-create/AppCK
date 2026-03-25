import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AppResponse, AppState, AuthResult } from '../types';
import { supabase } from '../integrations/supabase/client';

interface AppContextType extends AppState {
  registerUser: (name: string, email: string, password?: string) => Promise<AuthResult>;
  loginUser: (email: string, password?: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  saveResponse: (type: AppResponse['type'], data: any) => void;
  addWinner: (user: User) => void;
  clearWinners: () => void;
}

const generateMockData = (): AppState => {
  return {
    users: [],
    currentUser: null,
    responses: [],
    winners: [],
  };
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('app-ck-data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Resetamos o currentUser para forçar o Supabase a validar a sessão real
        return { ...parsed, currentUser: null, users: [] };
      } catch (e) {
        return generateMockData();
      }
    }
    return generateMockData();
  });

  useEffect(() => {
    // 1. Verificar sessão ativa ao carregar
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) fetchProfile(session.user.id, session.user.email);
    });

    // 2. Escutar mudanças de autenticação (login, logout, etc)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session.user.id, session.user.email);
      } else {
        setState(prev => ({ ...prev, currentUser: null }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, email?: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) {
      const isAdmin = email === 'admin@ianapratica.com';
      const user: User = {
        id: data.id,
        name: data.name || (isAdmin ? 'Administrador' : 'Usuário'),
        email: data.email || email || '',
        createdAt: data.created_at || new Date().toISOString(),
        isAdmin: isAdmin
      };
      setState(prev => ({ ...prev, currentUser: user }));
    } else if (email === 'admin@ianapratica.com') {
      // Fallback pro admin caso não tenha profile ainda
      const user: User = {
        id: userId,
        name: 'Administrador',
        email: email,
        createdAt: new Date().toISOString(),
        isAdmin: true
      };
      setState(prev => ({ ...prev, currentUser: user }));
    }
  };

  const registerUser = async (name: string, email: string, password?: string): Promise<AuthResult> => {
    const isAdmin = email === 'admin@ianapratica.com';
    const { data, error } = await supabase.auth.signUp({
      email,
      password: password || '12345678', // Senha padrão se não for fornecida
      options: {
        data: { name }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) return { success: false, error: 'E-mail já cadastrado.' };
      return { success: false, error: error.message };
    }
    return { success: true, isAdmin };
  };

  const loginUser = async (email: string, password?: string): Promise<AuthResult> => {
    const isAdmin = email === 'admin@ianapratica.com';
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: password || '12345678'
    });

    if (error) return { success: false, error: 'Credenciais inválidas.' };
    return { success: true, isAdmin };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // Mantido local por enquanto (Migraremos no Passo 2)
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
      const newState = {
        ...prev,
        responses: [...filteredResponses, newResponse],
      };
      localStorage.setItem('app-ck-data', JSON.stringify(newState));
      return newState;
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
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};