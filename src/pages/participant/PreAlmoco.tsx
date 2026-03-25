import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { showSuccess } from '../../utils/toast';

export const PreAlmoco: React.FC = () => {
  const [scores, setScores] = useState({
    dataClarity: null as number | null,
    processExecution: null as number | null,
    salesPredictability: null as number | null,
    customerEvaluation: null as number | null,
  });
  
  const { saveResponse, responses, currentUser } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const previous = responses.find(r => r.userId === currentUser?.id && r.type === 'pre-almoco');
    if (previous && previous.type === 'pre-almoco') {
      setScores({
        dataClarity: previous.data.dataClarity,
        processExecution: previous.data.processExecution,
        salesPredictability: previous.data.salesPredictability,
        customerEvaluation: previous.data.customerEvaluation,
      });
    }
  }, [responses, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;
    
    saveResponse('pre-almoco', scores);
    showSuccess('Feedback enviado. Bom apetite!');
    navigate('/app');
  };

  const setScore = (field: keyof typeof scores, value: number) => {
    setScores(prev => ({ ...prev, [field]: value }));
  };

  const isComplete = scores.dataClarity && scores.processExecution && scores.salesPredictability && scores.customerEvaluation;

  const questions = [
    { id: 'dataClarity' as const, title: 'Você tem clareza dos seus dados?' },
    { id: 'processExecution' as const, title: 'Sua equipe executa processos corretamente?' },
    { id: 'salesPredictability' as const, title: 'Você tem previsibilidade de vendas?' },
    { id: 'customerEvaluation' as const, title: 'Seu cliente avalia sua empresa?' },
  ];

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto pb-8">
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Diagnóstico: Manhã</h2>
        <p className="text-slate-500 mt-2 text-lg font-medium">Avalie os pilares do seu negócio de 1 (Muito Ruim) a 5 (Muito Bom).</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {questions.map((q, index) => (
          <div key={q.id} className="space-y-4 animate-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms` }}>
            <Label className="text-xl font-bold text-slate-800 leading-tight block mb-2">
              <span className="text-blue-600 mr-2">{index + 1}.</span>
              {q.title}
            </Label>
            
            <div className="flex justify-between items-center gap-2 sm:gap-4 mt-4 bg-slate-50 p-3 sm:p-4 rounded-[2rem] border border-slate-100">
              {[1, 2, 3, 4, 5].map((num) => {
                const isSelected = scores[q.id] === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setScore(q.id, num)}
                    className={`flex-1 h-16 sm:h-20 rounded-2xl sm:rounded-3xl text-xl sm:text-2xl font-black transition-all duration-300 ${
                      isSelected 
                        ? 'bg-blue-600 text-white shadow-[0_8px_25px_rgba(37,99,235,0.4)] scale-110' 
                        : 'bg-white text-slate-400 border-2 border-slate-100 hover:border-blue-300 hover:text-blue-600 hover:bg-white'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest px-4 pt-1">
              <span>Muito ruim</span>
              <span>Muito bom</span>
            </div>
          </div>
        ))}

        <div className="pt-6 border-t border-slate-100">
          <Button 
            type="submit" 
            disabled={!isComplete}
            className="w-full h-16 bg-slate-900 hover:bg-blue-600 text-white text-xl font-bold rounded-2xl transition-all shadow-lg disabled:opacity-50"
          >
            Enviar Avaliação
          </Button>
        </div>
      </form>
    </div>
  );
};