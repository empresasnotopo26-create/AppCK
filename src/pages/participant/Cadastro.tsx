import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { showSuccess, showError } from '../../utils/toast';

export const Cadastro: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { registerUser, loginUser, currentUser, isLoadingAuth } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.isAdmin) navigate('/admin');
      else navigate('/app');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        if (!email.trim() || !password.trim()) return;
        
        const result = await loginUser(email, password);
        if (result.success) {
          showSuccess('Conectado! Aguarde o redirecionamento...');
        } else {
          showError(result.error || 'Erro ao fazer login.');
        }
      } else {
        if (!name.trim() || !email.trim() || !password.trim()) return;
        
        const result = await registerUser(name, email, password);
        if (result.success) {
          showSuccess('Conta criada! Aguarde o redirecionamento...');
        } else {
          showError(result.error || 'Erro ao realizar cadastro.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="text-orange-500 font-bold tracking-widest uppercase text-sm animate-pulse">
          Verificando Acesso...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-orange-500/10 to-transparent"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-500 rounded-full blur-[150px] opacity-25 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600 rounded-full blur-[150px] opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-slate-800 overflow-hidden relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="p-10 pb-6 text-center border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <div className="mx-auto mb-6 flex justify-center">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-black border border-orange-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(255,94,0,0.4)]">
              <img 
                src="https://ik.imagekit.io/lflb43qwh/ENT/ck_negocios_v2_orange_white.png?updatedAt=1774469979929" 
                alt="CK Negócios" 
                className="w-full h-full object-contain scale-125"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Imersão de IA</h1>
          <p className="text-slate-400 text-sm font-medium">Faça login ou crie sua conta para iniciar</p>
        </div>

        <div className="px-6 py-5 bg-slate-900 border-b border-slate-800/50">
          <div className="flex p-1.5 bg-black border border-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 rounded-xl transition-all duration-300 ${
                isLogin 
                  ? 'bg-slate-800 text-orange-500 shadow-[0_0_15px_rgba(255,94,0,0.2)]' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/50'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Fazer Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 rounded-xl transition-all duration-300 ${
                !isLogin 
                  ? 'bg-slate-800 text-orange-500 shadow-[0_0_15px_rgba(255,94,0,0.2)]' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/50'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Criar Conta
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 pt-6 space-y-5 bg-slate-900">
          
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300 font-semibold text-sm">Nome completo</Label>
              <Input
                id="name"
                placeholder="Ex: João da Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="h-12 border-slate-800 bg-black text-white focus-visible:ring-orange-500 focus-visible:border-orange-500 placeholder:text-slate-600 rounded-xl transition-all"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300 font-semibold text-sm">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 border-slate-800 bg-black text-white focus-visible:ring-orange-500 focus-visible:border-orange-500 placeholder:text-slate-600 rounded-xl transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300 font-semibold text-sm">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Sua senha de acesso"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 border-slate-800 bg-black text-white focus-visible:ring-orange-500 focus-visible:border-orange-500 placeholder:text-slate-600 rounded-xl transition-all"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-14 bg-orange-500 hover:bg-orange-400 text-black font-black text-lg rounded-xl transition-all group mt-6 shadow-[0_0_20px_rgba(255,94,0,0.4)] hover:shadow-[0_0_35px_rgba(255,94,0,0.6)] disabled:opacity-70 disabled:shadow-none"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                {isLogin ? 'Entrar' : 'Criar Conta'}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};