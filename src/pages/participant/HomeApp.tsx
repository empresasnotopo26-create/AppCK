import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import { ChevronRight, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

export const HomeApp: React.FC = () => {
  const { currentUser, responses } = useAppContext();

  const hasCompleted = (type: string) => {
    return responses.some(r => r.userId === currentUser?.id && r.type === type);
  };

  const tasks = [
    { title: 'Quiz Inicial', desc: 'Nivelamento rápido de conhecimento', path: '/app/quiz', type: 'quiz' },
    { title: 'Pesquisa Principal', desc: 'Métricas e desafios da sua empresa', path: '/app/pesquisa', type: 'pesquisa' },
    { title: 'Pesquisa Pré-almoço', desc: 'Avalie a manhã e deixe suas dúvidas', path: '/app/pre-almoco', type: 'pre-almoco' },
    { title: 'Avaliação Final (NPS)', desc: 'Sua opinião geral sobre o evento', path: '/app/nps', type: 'nps' },
  ];

  const getFirstName = (name?: string) => name ? name.split(' ')[0] : '';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <h1 className="text-3xl font-bold mb-2 relative z-10">Olá, {getFirstName(currentUser?.name)}! 👋</h1>
        <p className="text-blue-100 text-lg relative z-10">Bem-vindo(a) ao hub do participante. Acompanhe suas atividades abaixo.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 px-1">Suas Atividades</h2>
        <div className="grid gap-4">
          {tasks.map((task, idx) => {
            const completed = hasCompleted(task.type);
            return (
              <Link 
                key={idx}
                to={task.path}
                className={`group flex flex-col sm:flex-row sm:items-center p-6 rounded-2xl border transition-all duration-300 ${
                  completed 
                    ? 'bg-slate-50 border-slate-200' 
                    : 'bg-white border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md'
                }`}
              >
                <div className="flex items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0 transition-colors ${
                    completed ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                  }`}>
                    {completed ? <CheckCircle2 className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-1 ${completed ? 'text-slate-500' : 'text-slate-800'}`}>
                      {task.title}
                    </h3>
                    <p className={`text-sm ${completed ? 'text-slate-400' : 'text-slate-500'}`}>
                      {task.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 sm:mt-0 flex items-center justify-between sm:justify-end pl-16 sm:pl-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mr-4 ${
                    completed ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {completed ? 'Concluído' : 'Pendente'}
                  </span>
                  <ChevronRight className={`w-5 h-5 ${completed ? 'text-slate-300' : 'text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all'}`} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};