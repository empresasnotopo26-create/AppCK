import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import { Button } from '@/components/ui/button';
import { showSuccess } from '../../utils/toast';
import { CheckCircle2, Loader2 } from 'lucide-react';

export const Quiz: React.FC = () => {
  const [answers, setAnswers] = useState({ 
    q1: '', q2: '', q3: '', q4: '', 
    q5: '', q6: '', q7: '', q8: '' 
  });
  const [alreadyResponded, setAlreadyResponded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { saveResponse, responses, currentUser } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const previous = responses.find(r => r.userId === currentUser?.id && r.type === 'quiz');
    if (previous && previous.type === 'quiz') {
      setAnswers({
        q1: previous.data.q1 || '',
        q2: previous.data.q2 || '',
        q3: previous.data.q3 || '',
        q4: previous.data.q4 || '',
        q5: previous.data.q5 || '',
        q6: previous.data.q6 || '',
        q7: previous.data.q7 || '',
        q8: previous.data.q8 || '',
      });
      setAlreadyResponded(true);
    }
  }, [responses, currentUser]);

  const handleSelect = (question: string, value: string) => {
    if (alreadyResponded) return;
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (alreadyResponded || Object.values(answers).some(val => !val)) return;
    
    setIsSubmitting(true);
    try {
      await saveResponse('quiz', answers);
      showSuccess('Quiz concluído com sucesso!');
      navigate('/app');
    } finally {
      setIsSubmitting(false);
    }
  };

  const questions = [
    {
      id: 'q1',
      title: 'Você precisa analisar um PDF de 200 páginas com relatórios da sua empresa. Qual ferramenta resolve isso melhor?',
      options: ['ChatGPT', 'NotebookLM do Google', 'Excel', 'Google Docs']
    },
    {
      id: 'q2',
      title: 'O que ferramentas como Midjourney ou DALL·E permitem fazer?',
      options: ['Criar imagens a partir de descrições em texto', 'Editar fotos já existentes com filtros', 'Produzir vídeos automaticamente', 'Criar apresentações completas']
    },
    {
      id: 'q3',
      title: 'Qual dessas situações representa um uso mais atual de IA nos negócios?',
      options: ['Usar IA para responder clientes com contexto e agilidade', 'Usar IA para buscar informações no Google', 'Usar IA para organizar arquivos', 'Usar IA para editar documentos']
    },
    {
      id: 'q4',
      title: 'O que é um “prompt”?',
      options: ['Um tipo de comando ou instrução que você dá para a IA', 'Um sistema interno da ferramenta', 'Um tipo de automação de IA', 'Um modelo de resposta pronto em uma IA']
    },
    {
      id: 'q5',
      title: 'O que a IA generativa faz na prática?',
      options: ['Ajuda a organizar conteúdos existentes', 'Cria novos conteúdos como textos, imagens e ideias', 'Melhora a velocidade de sistemas', 'Armazena grandes volumes de dados']
    },
    {
      id: 'q6',
      title: 'Quais dessas plataformas são usadas para gerar vídeos com IA?',
      options: ['Runway e veo3', 'Notion e Trello', 'Canva e chatgpt', 'Google Drive e stich']
    },
    {
      id: 'q7',
      title: 'Em qual dessas plataformas você consegue gerar uma landing page pronta usando apenas prompt?',
      options: ['Lovable', 'gemini', 'sora', 'notebook lm']
    },
    {
      id: 'q8',
      title: 'Qual dessas plataformas permite criar apps com IA sem programar?',
      options: ['Bubble', 'Base44', 'WordPress', 'Wix']
    }
  ];

  const answeredCount = Object.values(answers).filter(Boolean).length;
  const progress = alreadyResponded ? 100 : (answeredCount / questions.length) * 100;
  const isComplete = answeredCount === questions.length;

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto pb-12">
      
      {/* Header Fixo de Progresso Elegante */}
      <div className="sticky top-0 md:-top-10 bg-slate-900/95 backdrop-blur-xl z-10 py-4 mb-8 border-b border-slate-800 mx-[-20px] px-[20px] sm:mx-0 sm:px-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Quiz de Nivelamento</h2>
          <span className={`px-4 py-1.5 font-bold rounded-full text-sm border ${
            alreadyResponded 
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
              : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
          }`}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
           <div className={`h-full shadow-[0_0_10px_rgba(249,115,22,0.8)] transition-all duration-500 ease-out rounded-full ${
             alreadyResponded ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-orange-500'
           }`} style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {questions.map((q, index) => (
          <div key={q.id} className="space-y-5 animate-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 50}ms` }}>
            <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
              <span className="text-orange-500 mr-2 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]">{index + 1}.</span>
              {q.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {q.options.map(opt => {
                const isSelected = answers[q.id as keyof typeof answers] === opt;
                return (
                  <div
                    key={opt}
                    onClick={() => handleSelect(q.id, opt)}
                    className={`p-5 rounded-3xl border-2 transition-all duration-200 flex items-center justify-between ${
                      isSelected 
                        ? 'border-orange-500 bg-orange-500 text-slate-950 shadow-[0_0_20px_rgba(249,115,22,0.3)] scale-[1.02]' 
                        : `border-slate-800 bg-slate-950 text-slate-300 ${
                            alreadyResponded ? 'opacity-50 cursor-default' : 'hover:border-orange-500/50 hover:bg-slate-900 cursor-pointer'
                          }`
                    }`}
                  >
                    <span className="font-bold text-[14px] leading-snug pr-2">{opt}</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-slate-950 bg-orange-500' : 'border-slate-700 bg-slate-900'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-slate-950 rounded-full" />}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        <div className="pt-8 border-t border-slate-800">
          {alreadyResponded ? (
            <div className="w-full h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center text-xl font-bold rounded-2xl">
              <CheckCircle2 className="w-6 h-6 mr-2" />
              Quiz já respondido
            </div>
          ) : (
            <Button 
              type="submit" 
              disabled={!isComplete || isSubmitting}
              className="w-full h-16 bg-slate-800 hover:bg-orange-500 text-white hover:text-slate-950 text-xl font-bold rounded-2xl transition-all shadow-lg disabled:opacity-50 disabled:shadow-none hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]"
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (isComplete ? 'Concluir Quiz' : 'Responda tudo para continuar')}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};