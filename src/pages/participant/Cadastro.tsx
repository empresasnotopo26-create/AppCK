import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, ArrowRight } from 'lucide-react';

export const Cadastro: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { registerUser } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      registerUser(name, email);
      navigate('/app');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decorativo Estilo SaaS */}
      <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-blue-50 to-slate-50 border-b border-blue-100/50"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-200 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 overflow-hidden relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="p-10 text-center border-b border-slate-50 bg-white/50 backdrop-blur-sm">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
            <Sparkles className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">APP CK</h1>
          <p className="text-slate-500 text-sm font-medium">Imersão de Inteligência Artificial</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6 bg-white">
          <div className="space-y-2.5">
            <Label htmlFor="name" className="text-slate-700 font-semibold text-sm">Nome completo</Label>
            <Input
              id="name"
              placeholder="Ex: João da Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12 border-slate-200 bg-slate-50/50 focus-visible:ring-blue-600 focus-visible:bg-white text-base rounded-xl transition-all"
            />
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="email" className="text-slate-700 font-semibold text-sm">E-mail corporativo</Label>
            <Input
              id="email"
              type="email"
              placeholder="joao@empresa.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 border-slate-200 bg-slate-50/50 focus-visible:ring-blue-600 focus-visible:bg-white text-base rounded-xl transition-all"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-14 bg-slate-900 hover:bg-blue-600 text-white font-medium text-lg rounded-xl transition-all group mt-4 shadow-md hover:shadow-xl hover:shadow-blue-500/20"
          >
            Começar Agora
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
      </div>
      
      <p className="mt-8 text-slate-400 text-sm text-center relative z-10 font-medium">
        Seus dados estão seguros e serão usados apenas para a Imersão.
      </p>
    </div>
  );
};