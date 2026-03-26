import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import { ChevronRight, CheckCircle2, PlayCircle, Trophy, Download, FileText, Sparkles } from 'lucide-react';

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

  // Cálculos do SVG do Gráfico Circular
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      
      {/* Banner Sólido e Elegante (Dark + Neon) */}
      <div className="bg-black border border-orange-500/40 rounded-3xl p-8 sm:p-10 text-white shadow-[0_0_30px_rgba(255,85,0,0.15)] relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[150%] bg-orange-600/20 blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 w-full sm:w-2/3">
          <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight text-white">Olá, {getFirstName(currentUser?.name)}! 👋</h1>
          <p className="text-slate-300 text-lg font-medium">Sua jornada na Imersão de IA acontece aqui. Complete as etapas para maximizar seu aprendizado.</p>
        </div>
        
        {/* Gráfico de Progresso Circular */}
        <div className="relative z-10 bg-slate-950/80 backdrop-blur-sm p-6 rounded-[2rem] border border-orange-500/30 text-center w-full sm:w-auto flex flex-col items-center justify-center flex-shrink-0 shadow-[0_0_25px_rgba(255,85,0,0.15)] min-w-[200px]">
          <div className="text-xs font-black text-orange-500 uppercase tracking-widest mb-4 drop-shadow-[0_0_8px_rgba(255,85,0,0.6)]">
            Progresso
          </div>
          
          <div className="relative flex items-center justify-center mb-5">
            <svg className="w-28 h-28 transform -rotate-90">
              {/* Fundo do círculo */}
              <circle
                className="text-slate-800"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="56"
                cy="56"
              />
              {/* Círculo Animado do Progresso */}
              <circle
                className="text-orange-500 transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="56"
                cy="56"
                style={{ filter: 'drop-shadow(0 0 6px rgba(249,115,22,0.8))' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white">{progress}%</span>
            </div>
          </div>

          <div className="text-xs font-bold text-slate-400 bg-slate-900 px-4 py-2 rounded-full border border-slate-800 shadow-inner">
            {completedTasks} de {tasks.length} concluídas
          </div>
        </div>
      </div>

      {/* Lista de Atividades */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black text-white tracking-tight">Suas Atividades</h2>
          {progress === 100 && <Trophy className="text-orange-500 drop-shadow-[0_0_10px_rgba(255,85,0,0.6)] w-6 h-6" />}
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
                    ? 'bg-black border-slate-800 opacity-60 hover:opacity-100' 
                    : 'bg-black border-orange-500/30 hover:border-orange-500 hover:shadow-[0_0_30px_rgba(255,85,0,0.2)]'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                    completed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-black group-hover:shadow-[0_0_20px_rgba(255,85,0,0.5)]'
                  }`}>
                    {completed ? <CheckCircle2 className="w-7 h-7" /> : <PlayCircle className="w-7 h-7 ml-1" />}
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    completed ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-black text-orange-500 border border-orange-500/30'
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
                  <div className="absolute bottom-6 right-6 w-10 h-10 bg-black border border-orange-500/30 rounded-full flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 group-hover:translate-x-1 transition-all group-hover:shadow-[0_0_15px_rgba(255,85,0,0.4)]">
                     <ChevronRight className="w-5 h-5 text-orange-500 group-hover:text-black transition-colors" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Material Bônus / Download do PDF */}
      <div className="pt-4 pb-4">
        <div className="flex items-center justify-between px-2 mb-6">
          <h2 className="text-2xl font-black text-white tracking-tight">Material Bônus</h2>
          <Sparkles className="text-orange-500 drop-shadow-[0_0_10px_rgba(255,85,0,0.6)] w-6 h-6" />
        </div>

        <div className="bg-slate-900 border border-slate-800 hover:border-orange-500/50 transition-colors duration-300 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-lg group relative overflow-hidden">
          {/* Efeito de brilho que passa ao passar o mouse */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

          <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-orange-500/20 group-hover:bg-orange-500 group-hover:text-black text-orange-500 transition-colors">
            <FileText className="w-8 h-8" />
          </div>

          <div className="flex-1 text-center sm:text-left z-10">
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Arsenal de Ferramentas IA</h3>
            <p className="text-slate-400 text-sm sm:text-base font-medium leading-relaxed">
              Baixe agora nosso catálogo exclusivo com as melhores Inteligências Artificiais do mercado, criteriosamente separadas para cada tipo de atividade do seu negócio.
            </p>
          </div>

          <a
            href="/guia-ia-ck-negocios.pdf"
            download="Catálogo IA - CK Negócios.pdf"
            className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-400 text-black font-black rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(255,85,0,0.4)] hover:-translate-y-1 flex-shrink-0 z-10"
          >
            <Download className="w-5 h-5" />
            Baixar Catálogo
          </a>
        </div>
      </div>

    </div>
  );
};