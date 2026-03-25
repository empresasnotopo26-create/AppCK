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

  const navItems = [
    { name: 'Início', path: '/app', icon: Home },
    { name: 'Quiz', path: '/app/quiz', icon: MessageSquare },
    { name: 'Pesquisa', path: '/app/pesquisa', icon: ClipboardList },
    { name: 'Manhã', path: '/app/pre-almoco', icon: Coffee },
    { name: 'Avaliação', path: '/app/nps', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans pb-20 md:pb-0">
      {/* Header Desktop (Escondido no Mobile) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 hidden md:block">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-slate-900 px-4 py-2.5 rounded-xl shadow-md">
              <img 
                src="https://ik.imagekit.io/lflb43qwh/ENT/ck_negocios_v2_orange_white.png" 
                alt="CK Negócios" 
                className="h-6 object-contain"
              />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight border-l border-slate-200 pl-4">
              Imersão IA
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col text-right">
              <span className="text-sm font-bold text-slate-800">{currentUser.name.split(' ')[0]}</span>
              <span className="text-xs text-slate-500">{currentUser.email}</span>
            </div>
            <button
              onClick={logout}
              className="text-slate-400 hover:text-red-500 transition-colors p-3 rounded-2xl hover:bg-red-50"
              title="Sair"
            >
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Header Mobile Simplificado */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 md:hidden px-4 h-16 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="bg-slate-900 px-2.5 py-1.5 rounded-lg">
              <img 
                src="https://ik.imagekit.io/lflb43qwh/ENT/ck_negocios_v2_orange_white.png" 
                alt="CK Negócios" 
                className="h-4 object-contain"
              />
            </div>
            <span className="font-bold text-slate-900 text-sm">Imersão IA</span>
          </div>
          <button onClick={logout} className="text-slate-400 p-2">
             <LogOut size={20} />
          </button>
      </header>

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 md:py-10 flex flex-col md:flex-row gap-8 flex-1">
        
        {/* Sidebar Desktop */}
        <aside className="hidden md:flex w-64 flex-col gap-2 flex-shrink-0">
           <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Menu</div>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                      : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span className="font-semibold">{item.name}</span>
                </Link>
              );
            })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 w-full bg-white rounded-3xl shadow-sm border border-slate-100 p-5 sm:p-10 min-h-[500px] overflow-hidden">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around items-center h-20 px-2 z-30 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-3xl">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-blue-50' : ''}`}>
                <Icon size={22} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
              </div>
              <span className={`text-[10px] font-bold ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};