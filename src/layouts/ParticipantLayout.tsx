import React, { useEffect } from 'react';
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
    { name: 'Quiz Rápido', path: '/app/quiz', icon: MessageSquare },
    { name: 'Pesquisa', path: '/app/pesquisa', icon: ClipboardList },
    { name: 'Pré-almoço', path: '/app/pre-almoco', icon: Coffee },
    { name: 'NPS Final', path: '/app/nps', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CK</span>
            </div>
            <span className="font-semibold text-slate-900 hidden sm:block">Imersão de IA</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 hidden sm:block">Olá, {currentUser.name.split(' ')[0]}</span>
            <button
              onClick={logout}
              className="text-slate-500 hover:text-slate-800 transition-colors p-2 rounded-md hover:bg-slate-100"
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6 flex-1 w-full">
        
        {/* Sidebar/Top nav para Mobile */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 p-6 sm:p-8 min-h-[400px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};