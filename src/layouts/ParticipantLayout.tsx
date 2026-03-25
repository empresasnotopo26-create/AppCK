import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { LogOut, Home, ClipboardList, Coffee, Star, MessageSquare } from 'lucide-react';

export const ParticipantLayout: React.FC = () => {
  const { currentUser, logout } = useAppContext();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/cadastro" />;
  }

  // Proteção: Se for admin, volta pro painel de admin
  if (currentUser.isAdmin) {
    return <Navigate to="/admin" />;
  }

  const navItems = [
    { name: 'Início', path: '/app', icon: Home },
    { name: 'Quiz', path: '/app/quiz', icon: MessageSquare },
    { name: 'Pesquisa', path: '/app/pesquisa', icon: ClipboardList },
    { name: 'Manhã', path: '/app/pre-almoco', icon: Coffee },
    { name: 'Avaliação', path: '/app/nps', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans pb-20 md:pb-0 text-slate-200">
      {/* Header Desktop (Escondido no Mobile) */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20 hidden md:block">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center shadow-[0_0_10px_rgba(249,115,22,0.2)]">
              <img 
                src="https://ik.imagekit.io/lflb43qwh/ENT/ck_negocios_v2_orange_white.png?updatedAt=1774469979929" 
                alt="CK Negócios" 
                className="w-full h-full object-contain scale-125"
              />
            </div>
            <span className="font-bold text-white text-lg tracking-tight border-l border-slate-700 pl-4">
              Imersão IA
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col text-right">
              <span className="text-sm font-bold text-white">{currentUser.name.split(' ')[0]}</span>
              <span className="text-xs text-slate-400">{currentUser.email}</span>
            </div>
            <button
              onClick={logout}
              className="text-slate-400 hover:text-red-400 transition-colors p-3 rounded-2xl hover:bg-slate-800"
              title="Sair"
            >
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Header Mobile Simplificado */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20 md:hidden px-4 h-16 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
              <img 
                src="https://ik.imagekit.io/lflb43qwh/ENT/ck_negocios_v2_orange_white.png?updatedAt=1774469979929" 
                alt="CK Negócios" 
                className="w-full h-full object-contain scale-125"
              />
            </div>
            <span className="font-bold text-white text-sm">Imersão IA</span>
          </div>
          <button onClick={logout} className="text-slate-400 p-2 hover:text-red-400">
             <LogOut size={20} />
          </button>
      </header>

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 md:py-10 flex flex-col md:flex-row gap-8 flex-1">
        
        {/* Sidebar Desktop */}
        <aside className="hidden md:flex w-64 flex-col gap-2 flex-shrink-0">
           <div className="text-xs font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">Menu</div>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'bg-orange-500 text-slate-950 shadow-[0_0_20px_rgba(249,115,22,0.3)] scale-[1.02] font-bold'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white hover:shadow-sm'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-slate-950' : 'text-slate-400'} />
                  <span className={isActive ? 'font-bold' : 'font-semibold'}>{item.name}</span>
                </Link>
              );
            })}
        </aside>

        {/* Content Area & Banner Rodapé */}
        <div className="flex-1 w-full flex flex-col gap-6 min-w-0">
          <main className="w-full bg-slate-900 rounded-3xl shadow-xl border border-slate-800 p-5 sm:p-10 min-h-[500px] overflow-hidden">
            <Outlet />
          </main>
          
          {/* Imagem de Banner no Rodapé */}
          <div className="w-full rounded-3xl overflow-hidden border border-slate-800 shadow-xl mt-2 flex-shrink-0">
            <img 
              src="https://ik.imagekit.io/lflb43qwh/ENT/Banner%20Imers%C3%A3o%20(1920%20x%201080%20px).png" 
              alt="Banner Imersão CK Negócios" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 flex justify-around items-center h-20 px-2 z-30 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-3xl">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive ? 'text-orange-500' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : ''}`}>
                <Icon size={22} className={isActive ? 'text-orange-500' : 'text-slate-500'} />
              </div>
              <span className={`text-[10px] font-bold ${isActive ? 'text-orange-500' : 'text-slate-500'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};