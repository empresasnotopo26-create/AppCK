import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { BarChart3, Users, MessageSquare, ListTodo, Coffee, Star, Gift, LogOut } from 'lucide-react';
import logoImg from '@/assets/logo.png';

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
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-300 font-sans">
      
      {/* Sidebar Admin */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 z-20">
        <div className="h-20 flex items-center px-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-slate-800/50 shadow-sm">
              <img 
                src={logoImg} 
                alt="CK Negócios" 
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <span className="font-bold text-white tracking-wide text-xs border-l border-slate-700 pl-3">
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 font-medium shadow-[inset_2px_0_0_0_rgba(37,99,235,1)]'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-blue-500' : 'text-slate-500'} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-400 transition-colors w-full">
            <LogOut size={16} />
            Sair do Admin
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-950">
        <header className="h-20 flex items-center px-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm z-10 flex-shrink-0">
          <h1 className="text-lg font-semibold text-white">
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