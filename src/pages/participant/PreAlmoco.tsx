import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { showSuccess } from '../../utils/toast';
import { Loader2, CheckCircle2 } from 'lucide-react';

export const PreAlmoco: React.FC = () => {
  const [scores, setScores] = useState({
    dataClarity: null as number | null,
    processExecution: null as number | null,
    salesPredictability: null as number | null,
    customerEvaluation: null as number | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyResponded, setAlreadyResponded] = useState(false);
  
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
      setAlreadyResponded(true);
    }
  }, [responses, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (alreadyResponded || !isComplete) return;
    
    setIsSubmitting(true);
    try {
      await saveResponse('pre-almoco', scores);
      showSuccess('Feedback enviado. Bom apetite!');
      navigate('/app');
    } finally {
      setIsSubmitting(false);
    }
  };

  const setScore = (field: keyof typeof scores, value: number) => {
    if (alreadyResponded) return;
    setScores(prev => ({ ...prev, [field]: value }));
  };

  // Precisamos verificar se não é nulo, pois se for 0 ele cairia como "falso" no javascript
  const isComplete = 
    scores.dataClarity !== null && 
    scores.processExecution !== null && 
    scores.salesPredictability !== null && 
    scores.customerEvaluation !== null;

  const questions = [
    { id: 'dataClarity' as const, title: 'Você tem clareza dos seus dados?' },
    { id: 'processExecution' as const, title: 'Sua equipe executa processos corretamente?' },
    { id: 'salesPredictability' as const, title: 'Você tem previsibilidade de vendas?' },
    { id: 'customerEvaluation' as const, title: 'Seu cliente avalia sua empresa?' },
  ];

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto pb-8">
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-3xl font-black text-white tracking-tight">Diagnóstico: Manhã</h2>
        <p className="text-slate-400 mt-2 text-lg font-medium">Avalie os pilares do seu negócio de 0 (Muito Ruim) a 4 (Muito Bom).</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {questions.map((q, index) => (
          <div key={q.id} className="space-y-4 animate-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms` }}>
            <Label className="text-xl font-bold text-white leading-tight block mb-2">
              <span className="text-orange-500 mr-2 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]">{index + 1}.</span>
              {q.title}
            </Label>
            
            <div className="flex justify-between items-center gap-1 sm:gap-3 mt-4 bg-slate-950 p-2 sm:p-4 rounded-[2rem] border border-slate-800">
              {/* Array alterado para ir apenas de 0 a 4 */}
              {[0, 1, 2, 3, 4].map((num) => {
                const isSelected = scores[q.id] === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setScore(q.id, num)}
                    className={`flex-1 h-14 sm:h-16 rounded-xl sm:rounded-2xl text-lg sm:text-xl font-black transition-all duration-300 ${
                      isSelected 
                        ? 'bg-orange-500 text-slate-950 shadow-[0_0_25px_rgba(249,115,22,0.5)] scale-110 border-orange-500 z-10' 
                        : `bg-slate-900 text-slate-500 border-2 border-slate-800 ${
                            alreadyResponded ? 'opacity-50 cursor-default' : 'hover:border-orange-500/50 hover:text-orange-500'
                          }`
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest px-4 pt-1">
              <span>Muito ruim</span>
              <span>Muito bom</span>
            </div>
          </div>
        ))}

        <div className="pt-6 border-t border-slate-800">
          {alreadyResponded ? (
            <div className="w-full h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center text-xl font-bold rounded-2xl mt-6">
              <CheckCircle2 className="w-6 h-6 mr-2" />
              Avaliação já respondida
            </div>
          ) : (
            <Button 
              type="submit" 
              disabled={!isComplete || isSubmitting}
              className="w-full h-16 bg-slate-800 hover:bg-orange-500 text-white hover:text-slate-950 text-xl font-bold rounded-2xl transition-all shadow-lg hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] disabled:opacity-50 disabled:shadow-none"
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Enviar Avaliação'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};