import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import { ChevronRight, CheckCircle2, Circle } from 'lucide-react';

export const HomeApp: React.FC = () => {
  const { currentUser, responses } = useAppContext();

  // Função auxiliar para verificar se uma etapa foi preenchida
  const hasCompleted = (type: string) => {
    return responses.some(r => r.userId === currentUser?.id && r.type === type);
  };

  const tasks = [
    { title: 'Quiz Inicial', desc: 'Responda para nivelamento', path: '/app/quiz', type: 'quiz' },
    { title: 'Pesquisa Principal', desc: 'Métricas da sua empresa', path: '/app/pesquisa', type: 'pesquisa' },
    { title: 'Feedback Pré-almoço', desc: 'Como foi a manhã?', path: '/app/pre-almoco', type: 'pre-almoco' },
    { title: 'NPS Final', desc: 'Avaliação geral do evento', path: '/app/nps', type: 'nps' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Bem-vindo(a), {currentUser?.name}!</h1>
        <p className="text-slate-600">Acompanhe as atividades da imersão por aqui.</p>
      </div>

      <div className="grid gap-4">
        {tasks.map((task, idx) => {
          const completed = hasCompleted(task.type);
          return (
            <Link 
              key={idx}
              to={task.path}
              className={`group flex items-center p-5 rounded-xl border transition-all ${
                completed 
                  ? 'bg-slate-50 border-slate-200' 
                  : 'bg-white border-blue-100 shadow-sm hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="mr-4">
                {completed ? (
                  <CheckCircle2 className="text-emerald-500 w-8 h-8" />
                ) : (
                  <Circle className="text-blue-200 group-hover:text-blue-400 w-8 h-8 transition-colors" />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold text-lg ${completed ? 'text-slate-500' : 'text-slate-800'}`}>
                  {task.title}
                </h3>
                <p className={`text-sm ${completed ? 'text-slate-400' : 'text-slate-500'}`}>
                  {task.desc}
                </p>
              </div>
              <div>
                <ChevronRight className={`w-6 h-6 ${completed ? 'text-slate-300' : 'text-blue-500 group-hover:translate-x-1 transition-transform'}`} />
              </div>
            </Link>
          );
        })}
      </div>
      
      <div className="bg-slate-900 text-white rounded-xl p-6 relative overflow-hidden mt-8">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500 rounded-full blur-2xl opacity-40"></div>
        <h3 className="text-xl font-bold mb-2 relative z-10">Sorteios</h3>
        <p className="text-slate-300 text-sm relative z-10">
          Você já está concorrendo aos prêmios que serão sorteados ao longo do dia pelo painel admin. Fique atento!
        </p>
      </div>
    </div>
  );
};