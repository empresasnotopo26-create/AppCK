import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { BarChart3, Users, MessageSquare, ListTodo, Coffee, Star, Gift, LogOut } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { currentUser, logout } = useAppContext();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/cadastro" />;
  }

  // Proteção: Se não for admin, volta pro app
  if (!currentUser.isAdmin) {
    return <Navigate to="/app" />;
  }

  const navItems = [
    { name: 'Visão Geral', path: '/admin', icon: BarChart3 },
    { name: 'Participantes', path: '/admin/participantes', icon: Users },
    { name: 'Quiz Inicial', path: '/admin/quiz', icon: MessageSquare },
    { name: 'Pesquisa Principal', path: '/admin/pesquisa', icon: ListTodo },
    { name: 'Pré-almoço', path: '/admin/pre-almoco', icon: Coffee },
    { name: 'NPS Final', path: '/admin/nps', icon: Star },
    { name: 'Sorteio', path: '/admin/sorteio', icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row text-white font-sans selection:bg-orange-500/30">
      
      {/* Sidebar Admin */}
      <aside className="w-full md:w-64 bg-black border-r border-orange-500/20 flex flex-col flex-shrink-0 z-20 shadow-[4px_0_30px_rgba(255,85,0,0.05)]">
        <div className="h-20 flex items-center px-6 border-b border-orange-500/20 bg-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-black border border-orange-500 flex items-center justify-center shadow-[0_0_15px_rgba(255,85,0,0.4)]">
              <img 
                src="https://ik.imagekit.io/lflb43qwh/ENT/ck_negocios_v2_orange_white.png?updatedAt=1774469979929" 
                alt="CK Negócios" 
                className="w-full h-full object-contain scale-125"
              />
            </div>
            <span className="font-black text-white tracking-widest text-xs border-l border-orange-500/30 pl-3">
              APP ADMIN
            </span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin' && item.path !== '/admin/participantes');
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm ${
                  isActive
                    ? 'bg-orange-500/10 text-orange-500 font-bold border border-orange-500/50 shadow-[0_0_15px_rgba(255,85,0,0.2)]'
                    : 'text-slate-400 hover:bg-orange-500/5 hover:text-orange-300 border border-transparent'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-orange-500 drop-shadow-[0_0_5px_rgba(255,85,0,0.6)]' : 'text-slate-500'} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-orange-500/20">
          <button onClick={logout} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-500 transition-colors w-full p-2 rounded-lg hover:bg-red-500/10">
            <LogOut size={16} />
            Sair do Admin
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-black">
        <header className="h-20 flex items-center px-8 border-b border-orange-500/20 bg-black z-10 flex-shrink-0 shadow-[0_4px_20px_rgba(255,85,0,0.03)]">
          <h1 className="text-xl font-black text-white tracking-tight">
            {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
          </h1>
        </header>
        
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};