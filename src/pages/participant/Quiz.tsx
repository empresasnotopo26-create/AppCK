import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import { Button } from '@/components/ui/button';
import { showSuccess } from '../../utils/toast';
import { Progress } from '@/components/ui/progress';

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
      title: 'Você já testou alguma ferramenta de automação (ex: Zapier, Make)?',
      options: ['Sim, domino várias', 'Apenas testei o básico', 'Conheço de nome', 'Nunca testei']
    },
    {
      id: 'q4',
      title: 'Seu negócio já utiliza tecnologia para melhorar produtividade?',
      options: ['Sim, extensivamente', 'Em algumas áreas', 'Muito pouco', 'Ainda não']
    }
  ];

  const answeredCount = Object.values(answers).filter(Boolean).length;
  const progress = (answeredCount / questions.length) * 100;
  const isComplete = answeredCount === questions.length;

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto pb-12">
      
      {/* Header Fixo com Progresso */}
      <div className="sticky top-[64px] bg-white/80 backdrop-blur-md z-10 py-4 mb-8 border-b border-slate-100">
        <div className="flex justify-between items-end mb-2">
          <h2 className="text-2xl font-bold text-slate-900">Quiz Inicial</h2>
          <span className="text-sm font-semibold text-blue-600">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2 bg-slate-100" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {questions.map((q, index) => (
          <div key={q.id} className="space-y-4 animate-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms` }}>
            <h3 className="text-lg font-semibold text-slate-800 leading-snug">
              <span className="text-slate-400 mr-2">{index + 1}.</span>
              {q.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map(opt => {
                const isSelected = answers[q.id as keyof typeof answers] === opt;
                return (
                  <div
                    key={opt}
                    onClick={() => handleSelect(q.id, opt)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50/50 shadow-sm' 
                        : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`font-medium ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>{opt}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-blue-600' : 'border-slate-300'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
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
            className="w-full h-14 bg-slate-900 hover:bg-blue-600 text-white text-lg font-semibold rounded-xl transition-all shadow-md disabled:opacity-50"
          >
            {isComplete ? 'Concluir Quiz' : 'Responda todas as perguntas'}
          </Button>
        </div>
      </form>
    </div>
  );
};