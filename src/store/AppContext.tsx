import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AppResponse, AppState, AuthResult } from '../types';
import { supabase } from '../integrations/supabase/client';
import { showError, showSuccess } from '../utils/toast';

interface AppContextType extends AppState {
  registerUser: (name: string, email: string, password?: string) => Promise<AuthResult>;
  loginUser: (email: string, password?: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  saveResponse: (type: AppResponse['type'], data: any) => void;
  updateUser: (userId: string, data: { isAdmin?: boolean, isActive?: boolean }) => Promise<void>;
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
        return { ...parsed, currentUser: null, users: [] };
      } catch (e) {
        return generateMockData();
      }
    }
    return generateMockData();
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) fetchProfile(session.user.id, session.user.email);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session.user.id, session.user.email);
      } else {
        setState(prev => ({ ...prev, currentUser: null }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Busca todos os usuários se o usuário atual for admin
  useEffect(() => {
    if (state.currentUser?.isAdmin) {
      fetchAllUsers();
    }
  }, [state.currentUser?.isAdmin]);

  const fetchAllUsers = async () => {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) {
      const mappedUsers: User[] = data.map((d: any) => ({
        id: d.id,
        name: d.name || 'Sem Nome',
        email: d.email || '',
        createdAt: d.created_at || new Date().toISOString(),
        isAdmin: d.is_admin || d.email === 'admin@ianapratica.com',
        isActive: d.is_active !== false // se for nulo, é true
      }));
      setState(prev => ({ ...prev, users: mappedUsers }));
    }
  };

  const fetchProfile = async (userId: string, email?: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) {
      // Bloqueia acesso de usuário inativado
      if (data.is_active === false) {
        showError('Sua conta foi inativada pelo administrador.');
        await supabase.auth.signOut();
        setState(prev => ({ ...prev, currentUser: null }));
        return;
      }

      const isAdmin = data.is_admin || email === 'admin@ianapratica.com';
      const user: User = {
        id: data.id,
        name: data.name || (isAdmin ? 'Administrador' : 'Usuário'),
        email: data.email || email || '',
        createdAt: data.created_at || new Date().toISOString(),
        isAdmin: isAdmin,
        isActive: true
      };
      setState(prev => ({ ...prev, currentUser: user }));
    } else if (email === 'admin@ianapratica.com') {
      const user: User = {
        id: userId,
        name: 'Administrador',
        email: email,
        createdAt: new Date().toISOString(),
        isAdmin: true,
        isActive: true
      };
      setState(prev => ({ ...prev, currentUser: user }));
    }
  };

  const registerUser = async (name: string, email: string, password?: string): Promise<AuthResult> => {
    const isAdmin = email === 'admin@ianapratica.com';
    const { data, error } = await supabase.auth.signUp({
      email,
      password: password || '12345678',
      options: { data: { name } }
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

  // Atualiza um usuário via painel Admin
  const updateUser = async (userId: string, data: { isAdmin?: boolean, isActive?: boolean }) => {
    const updates: any = {};
    if (data.isAdmin !== undefined) updates.is_admin = data.isAdmin;
    if (data.isActive !== undefined) updates.is_active = data.isActive;

    const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
    
    if (error) {
      showError('Erro ao atualizar usuário. Verifique as permissões.');
      console.error(error);
      return;
    }
    
    showSuccess('Status atualizado com sucesso!');
    
    // Atualiza a lista localmente para resposta rápida na UI
    setState(prev => ({
      ...prev,
      users: prev.users.map(u => 
        u.id === userId 
          ? { ...u, isAdmin: data.isAdmin !== undefined ? data.isAdmin : u.isAdmin, isActive: data.isActive !== undefined ? data.isActive : u.isActive } 
          : u
      )
    }));
  };

  // Mantido local por enquanto (Formulários)
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
    <AppContext.Provider value={{ ...state, registerUser, loginUser, logout, updateUser, saveResponse, addWinner, clearWinners }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};