import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import { Button } from '@/components/ui/button';
import { showSuccess } from '../../utils/toast';

export const Quiz: React.FC = () => {
  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '', q4: '' });
  const { saveResponse, responses, currentUser } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const previous = responses.find(r => r.userId === currentUser?.id && r.type === 'quiz');
    if (previous && previous.type === 'quiz') {
      setAnswers(previous.data);
    }
  }, [responses, currentUser]);

  const handleSelect = (question: string, value: string) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answers.q1 || !answers.q2 || !answers.q3 || !answers.q4) return;
    
    saveResponse('quiz', answers);
    showSuccess('Quiz concluído com sucesso!');
    navigate('/app');
  };

  const questions = [
    {
      id: 'q1',
      title: 'Você já usa Inteligência Artificial no seu dia a dia?',
      options: ['Sim, diariamente', 'Às vezes', 'Raramente', 'Não utilizo']
    },
    {
      id: 'q2',
      title: 'Qual destas áreas mais te interessa na Imersão?',
      options: ['Vendas', 'Marketing', 'Operações', 'Atendimento']
    },
    {
      id: 'q3',
      title: 'Você já testou alguma ferramenta de automação?',
      options: ['Sim, domino', 'Testei o básico', 'Conheço de nome', 'Nunca testei']
    },
    {
      id: 'q4',
      title: 'Seu negócio já utiliza tecnologia para produtividade?',
      options: ['Extensivamente', 'Algumas áreas', 'Muito pouco', 'Ainda não']
    }
  ];

  const answeredCount = Object.values(answers).filter(Boolean).length;
  const progress = (answeredCount / questions.length) * 100;
  const isComplete = answeredCount === questions.length;

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto pb-12">
      
      {/* Header Fixo de Progresso Elegante */}
      <div className="sticky top-0 md:-top-10 bg-white/90 backdrop-blur-xl z-10 py-4 mb-8 border-b border-slate-100 mx-[-20px] px-[20px] sm:mx-0 sm:px-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Quiz Inicial</h2>
          <span className="px-4 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-full text-sm">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
           <div className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {questions.map((q, index) => (
          <div key={q.id} className="space-y-5 animate-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms` }}>
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-tight">
              <span className="text-blue-600 mr-2">{index + 1}.</span>
              {q.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {q.options.map(opt => {
                const isSelected = answers[q.id as keyof typeof answers] === opt;
                return (
                  <div
                    key={opt}
                    onClick={() => handleSelect(q.id, opt)}
                    className={`p-5 rounded-3xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-600 text-white shadow-[0_8px_30px_rgba(37,99,235,0.2)] scale-[1.02]' 
                        : 'border-slate-100 bg-slate-50 hover:border-blue-300 hover:bg-white text-slate-700'
                    }`}
                  >
                    <span className="font-bold text-[15px]">{opt}</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-white bg-blue-600' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        <div className="pt-8 border-t border-slate-100">
          <Button 
            type="submit" 
            disabled={!isComplete}
            className="w-full h-16 bg-slate-900 hover:bg-blue-600 text-white text-xl font-bold rounded-2xl transition-all shadow-lg disabled:opacity-50 disabled:shadow-none"
          >
            {isComplete ? 'Concluir Quiz' : 'Responda tudo para continuar'}
          </Button>
        </div>
      </form>
    </div>
  );
};