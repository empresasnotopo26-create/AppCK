import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import { ChevronRight, CheckCircle2, Clock, PlayCircle, Trophy } from 'lucide-react';

export const HomeApp: React.FC = () => {
  const { currentUser, responses } = useAppContext();

  const hasCompleted = (type: string) => {
    return responses.some(r => r.userId === currentUser?.id && r.type === type);
  };

  const tasks = [
    { title: 'Quiz Inicial', desc: 'Nivelamento rápido', path: '/app/quiz', type: 'quiz' },
    { title: 'Pesquisa Principal', desc: 'Desafios da empresa', path: '/app/pesquisa', type: 'pesquisa' },
    { title: 'Pesquisa da Manhã', path: '/app/pre-almoco', desc: 'Feedback pré-almoço', type: 'pre-almoco' },
    { title: 'Avaliação Final', desc: 'NPS da Imersão', path: '/app/nps', type: 'nps' },
  ];

  const getFirstName = (name?: string) => name ? name.split(' ')[0] : '';
  const completedTasks = tasks.filter(t => hasCompleted(t.type)).length;
  const progress = Math.round((completedTasks / tasks.length) * 100);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      
      {/* Banner Sólido e Elegante (Dark + Neon) */}
      <div className="bg-slate-950 border border-orange-500/30 rounded-3xl p-8 sm:p-10 text-white shadow-[0_0_30px_rgba(249,115,22,0.1)] relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[150%] bg-orange-600/10 blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10 w-full sm:w-2/3">
          <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight text-white">Olá, {getFirstName(currentUser?.name)}! 👋</h1>
          <p className="text-slate-300 text-lg font-medium">Sua jornada na Imersão de IA acontece aqui. Complete as etapas para maximizar seu aprendizado.</p>
        </div>
        
        {/* Progresso Circular */}
        <div className="relative z-10 bg-slate-900/80 p-6 rounded-3xl backdrop-blur-md border border-orange-500/20 text-center w-full sm:w-auto flex-shrink-0 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
          <div className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-1">Progresso</div>
          <div className="text-4xl font-black text-white">{progress}%</div>
          <div className="text-xs font-medium text-slate-400 mt-1">{completedTasks} de {tasks.length} concluídas</div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Suas Atividades</h2>
          {progress === 100 && <Trophy className="text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)] w-6 h-6" />}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {tasks.map((task, idx) => {
            const completed = hasCompleted(task.type);
            return (
              <Link 
                key={idx}
                to={task.path}
                className={`group flex flex-col p-6 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden ${
                  completed 
                    ? 'bg-slate-950 border-slate-800 opacity-70 hover:opacity-100' 
                    : 'bg-slate-950 border-slate-800 hover:border-orange-500 hover:shadow-[0_0_25px_rgba(249,115,22,0.15)]'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                    completed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-slate-950 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                  }`}>
                    {completed ? <CheckCircle2 className="w-7 h-7" /> : <PlayCircle className="w-7 h-7 ml-1" />}
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    completed ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}>
                    {completed ? 'Feito' : 'Pendente'}
                  </span>
                </div>

                <div>
                  <h3 className={`font-black text-xl mb-2 tracking-tight ${completed ? 'text-slate-500' : 'text-white'}`}>
                    {task.title}
                  </h3>
                  <p className={`text-sm font-medium ${completed ? 'text-slate-600' : 'text-slate-400'}`}>
                    {task.desc}
                  </p>
                </div>

                {/* Seta indicativa no canto inferior */}
                {!completed && (
                  <div className="absolute bottom-6 right-6 w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center group-hover:bg-orange-500 group-hover:translate-x-1 transition-all group-hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                     <ChevronRight className="w-5 h-5 text-orange-500 group-hover:text-slate-950 transition-colors" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};