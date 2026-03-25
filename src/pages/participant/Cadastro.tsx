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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-blue-50 to-slate-50 border-b border-blue-100/50"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-200 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 overflow-hidden relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="p-10 pb-6 text-center border-b border-slate-50 bg-white/50 backdrop-blur-sm">
          <div className="mx-auto mb-6 flex justify-center">
            {/* Contêiner Circular - Proporção exata de 65% para nunca cortar as bordas */}
            <div className="w-24 h-24 bg-slate-900 rounded-full shadow-xl shadow-slate-900/10 flex items-center justify-center border-4 border-white">
              <img 
                src="https://ik.imagekit.io/lflb43qwh/ENT/ck_negocios_v2_orange_white.png" 
                alt="CK Negócios" 
                className="w-[65%] h-[65%] object-contain"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Imersão de IA</h1>
          <p className="text-slate-500 text-sm font-medium">Faça login ou crie sua conta para iniciar</p>
        </div>

        {/* Abas de Navegação */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              !isLogin ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Criar Conta
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              isLogin ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Fazer Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 bg-white">
          
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-semibold text-sm">Nome completo</Label>
              <Input
                id="name"
                placeholder="Ex: João da Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="h-12 border-slate-200 bg-slate-50/50 focus-visible:ring-blue-600 focus-visible:bg-white text-base rounded-xl transition-all"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-semibold text-sm">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 border-slate-200 bg-slate-50/50 focus-visible:ring-blue-600 focus-visible:bg-white text-base rounded-xl transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-semibold text-sm">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Sua senha de acesso"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 border-slate-200 bg-slate-50/50 focus-visible:ring-blue-600 focus-visible:bg-white text-base rounded-xl transition-all"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-14 bg-slate-900 hover:bg-blue-600 text-white font-medium text-lg rounded-xl transition-all group mt-6 shadow-md hover:shadow-xl hover:shadow-blue-500/20"
          >
            {isLogin ? 'Entrar' : 'Criar Conta'}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
      </div>
    </div>
  );
};