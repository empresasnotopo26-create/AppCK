import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { showSuccess, showError } from '../../utils/toast';

export const Cadastro: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { registerUser, loginUser } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      if (!email.trim() || !password.trim()) return;
      
      const result = loginUser(email, password);
      if (result.success) {
        showSuccess('Login realizado com sucesso!');
        navigate('/app');
      } else {
        showError(result.error || 'Erro ao fazer login.');
      }
    } else {
      if (!name.trim() || !email.trim() || !password.trim()) return;
      
      const result = registerUser(name, email, password);
      if (result.success) {
        showSuccess('Cadastro realizado com sucesso!');
        navigate('/app');
      } else {
        showError(result.error || 'Erro ao realizar cadastro.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decorativo Dark Neon */}
      <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-orange-500/5 to-slate-950 border-b border-orange-500/10"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-600 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500 rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-800 overflow-hidden relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="p-10 pb-6 text-center border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <div className="mx-auto mb-6 flex justify-center">
            <div className="w-24 h-24 bg-slate-950 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.3)] flex items-center justify-center border-2 border-orange-500/50 overflow-hidden">
              <img 
                src="https://ik.imagekit.io/lflb43qwh/ENT/ck_negocios_v2_orange_white.png" 
                alt="CK Negócios" 
                className="w-full h-full object-contain scale-[1.8]"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Imersão de IA</h1>
          <p className="text-slate-400 text-sm font-medium">Faça login ou crie sua conta para iniciar</p>
        </div>

        {/* Abas de Navegação */}
        <div className="flex border-b border-slate-800 bg-slate-950/50">
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              !isLogin ? 'text-orange-500 border-b-2 border-orange-500 bg-slate-900' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Criar Conta
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              isLogin ? 'text-orange-500 border-b-2 border-orange-500 bg-slate-900' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Fazer Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 bg-slate-900">
          
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300 font-semibold text-sm">Nome completo</Label>
              <Input
                id="name"
                placeholder="Ex: João da Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="h-12 border-slate-700 bg-slate-950 text-white focus-visible:ring-orange-500 focus-visible:border-orange-500 placeholder:text-slate-600 rounded-xl transition-all"
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
              className="h-12 border-slate-700 bg-slate-950 text-white focus-visible:ring-orange-500 focus-visible:border-orange-500 placeholder:text-slate-600 rounded-xl transition-all"
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
              className="h-12 border-slate-700 bg-slate-950 text-white focus-visible:ring-orange-500 focus-visible:border-orange-500 placeholder:text-slate-600 rounded-xl transition-all"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-14 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-lg rounded-xl transition-all group mt-6 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
          >
            {isLogin ? 'Entrar' : 'Criar Conta'}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
      </div>
    </div>
  );
};