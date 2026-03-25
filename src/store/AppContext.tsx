import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AppResponse, AppState, AuthResult } from '../types';
import { supabase } from '../integrations/supabase/client';
import { showError, showSuccess } from '../utils/toast';

interface AppContextType extends AppState {
  registerUser: (name: string, email: string, password?: string) => Promise<AuthResult>;
  loginUser: (email: string, password?: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  saveResponse: (type: AppResponse['type'], data: any) => Promise<void>;
  updateUser: (userId: string, data: { isAdmin?: boolean, isActive?: boolean }) => Promise<void>;
  addWinner: (user: User) => Promise<void>;
  clearWinners: () => Promise<void>;
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
  const [state, setState] = useState<AppState>(generateMockData());

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) fetchProfile(session.user.id, session.user.email);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session.user.id, session.user.email);
      } else {
        setState(generateMockData());
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (state.currentUser?.isAdmin) {
      fetchAllUsers();
      fetchResponses(true, state.currentUser.id);
    } else if (state.currentUser) {
      fetchResponses(false, state.currentUser.id);
    }
  }, [state.currentUser]);

  // INSCRIÇÃO EM TEMPO REAL PARA ADMIN (Escuta INSERT e DELETE)
  useEffect(() => {
    if (state.currentUser?.isAdmin) {
      const channel = supabase
        .channel('realtime_responses')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'responses' },
          (payload) => {
            const newResponse: AppResponse = {
              id: payload.new.id,
              userId: payload.new.user_id,
              type: payload.new.type,
              data: payload.new.data,
              createdAt: payload.new.created_at,
            } as AppResponse;

            setState(prev => {
              if (prev.responses.some(r => r.id === newResponse.id)) return prev;
              return { ...prev, responses: [...prev.responses, newResponse] };
            });
          }
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'responses' },
          (payload) => {
            setState(prev => ({
              ...prev,
              responses: prev.responses.filter(r => r.id !== payload.old.id)
            }));
          }
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'profiles' },
          (payload) => {
            const newUser: User = {
              id: payload.new.id,
              name: payload.new.name || 'Sem Nome',
              email: payload.new.email || '',
              createdAt: payload.new.created_at,
              isAdmin: payload.new.is_admin,
              isActive: payload.new.is_active !== false,
            };
            setState(prev => {
              if (prev.users.some(u => u.id === newUser.id)) return prev;
              return { ...prev, users: [newUser, ...prev.users] };
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [state.currentUser?.isAdmin]);

  const fetchAllUsers = async () => {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error("Erro ao buscar usuários:", error);
      showError("Bloqueio no Banco: Não foi possível carregar os usuários.");
      return;
    }
    if (data) {
      const mappedUsers: User[] = data.map((d: any) => ({
        id: d.id,
        name: d.name || 'Sem Nome',
        email: d.email || '',
        createdAt: d.created_at || new Date().toISOString(),
        isAdmin: d.is_admin || d.email === 'admin@ianapratica.com',
        isActive: d.is_active !== false
      }));
      setState(prev => ({ ...prev, users: mappedUsers }));
    }
  };

  const fetchResponses = async (isAdmin: boolean, userId: string) => {
    let query = supabase.from('responses').select('*').order('created_at', { ascending: true });
    
    if (!isAdmin) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    if (error) {
      console.error("Erro ao buscar respostas:", error);
      showError("Bloqueio no Banco: Não foi possível carregar as respostas.");
      return;
    }

    if (data) {
      const mappedResponses = data.map((r: any) => ({
        id: r.id,
        userId: r.user_id,
        type: r.type,
        data: r.data,
        createdAt: r.created_at
      })) as AppResponse[];
      
      setState(prev => ({ ...prev, responses: mappedResponses }));
    }
  };

  const fetchProfile = async (userId: string, email?: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    
    if (data) {
      if (data.is_active === false) {
        showError('Sua conta foi inativada pelo administrador.');
        await supabase.auth.signOut();
        setState(prev => ({ ...prev, currentUser: null }));
        return;
      }

      let isAdmin = data.is_admin;

      if (email === 'admin@ianapratica.com' && !isAdmin) {
        const { error: updateError } = await supabase.from('profiles').update({ is_admin: true }).eq('id', userId);
        if (!updateError) {
          isAdmin = true;
        }
      }

      if (email === 'admin@ianapratica.com') {
        isAdmin = true;
      }

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

  const updateUser = async (userId: string, data: { isAdmin?: boolean, isActive?: boolean }) => {
    const updates: any = {};
    if (data.isAdmin !== undefined) updates.is_admin = data.isAdmin;
    if (data.isActive !== undefined) updates.is_active = data.isActive;

    const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
    if (error) {
      showError('Erro ao atualizar usuário.');
      return;
    }
    showSuccess('Status atualizado com sucesso!');
    setState(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === userId ? { ...u, ...data } : u)
    }));
  };

  const saveResponse = async (type: AppResponse['type'], data: any) => {
    if (!state.currentUser) return;
    
    const { data: insertedData, error } = await supabase.from('responses').insert({
      user_id: state.currentUser.id,
      type: type,
      data: data
    }).select().single();

    if (error) {
      showError('Falha ao salvar a resposta.');
      console.error(error);
      return;
    }

    const newResponse: AppResponse = {
      id: insertedData.id,
      userId: insertedData.user_id,
      type: insertedData.type,
      createdAt: insertedData.created_at,
      data: insertedData.data,
    } as AppResponse;

    setState(prev => {
      const isSingleForm = type !== 'winner';
      const filteredResponses = isSingleForm
        ? prev.responses.filter(r => !(r.userId === prev.currentUser?.id && r.type === type))
        : prev.responses;

      return {
        ...prev,
        responses: [...filteredResponses, newResponse],
      };
    });
  };

  const addWinner = async (user: User) => {
    if (state.responses.some(r => r.type === 'winner' && r.data.winnerId === user.id)) return;
    await saveResponse('winner', { winnerId: user.id });
  };

  const clearWinners = async () => {
    const { error } = await supabase.from('responses').delete().eq('type', 'winner');
    if (error) {
      showError('Erro ao limpar histórico do sorteio.');
      return;
    }
    showSuccess('Histórico de sorteio limpo!');
    
    setState(prev => ({
      ...prev,
      responses: prev.responses.filter(r => r.type !== 'winner')
    }));
  };

  const derivedWinners = state.responses
    .filter(r => r.type === 'winner')
    .map(r => state.users.find(u => u.id === r.data.winnerId))
    .filter((u): u is User => Boolean(u));

  return (
    <AppContext.Provider value={{ 
      ...state, 
      winners: derivedWinners,
      registerUser, 
      loginUser, 
      logout, 
      updateUser, 
      saveResponse, 
      addWinner, 
      clearWinners 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};