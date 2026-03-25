import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { showSuccess } from '../../utils/toast';
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export const NPS: React.FC = () => {
  const [score, setScore] = useState<number | null>(null);
  const [suggestion, setSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyResponded, setAlreadyResponded] = useState(false);
  
  const { saveResponse, responses, currentUser } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const previous = responses.find(r => r.userId === currentUser?.id && r.type === 'nps');
    if (previous && previous.type === 'nps') {
      setScore(previous.data.score);
      setSuggestion(previous.data.suggestion);
      setAlreadyResponded(true);
    }
  }, [responses, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (alreadyResponded || score === null) return;
    
    setIsSubmitting(true);
    try {
      await saveResponse('nps', { score, suggestion });
      showSuccess('Avaliação enviada! Muito obrigado.');
      navigate('/app');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-3xl mx-auto pb-8">
      
      {/* Banner de Aviso Refinado */}
      {!alreadyResponded && (
        <div className="bg-orange-500/10 border-l-4 border-orange-500 p-5 rounded-2xl mb-12 flex items-start gap-4 shadow-sm">
          <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-orange-400 text-base">Pesquisa de Saída</h3>
            <p className="text-orange-200/80 text-sm mt-1 leading-relaxed font-medium">
              Responda esta pesquisa <strong>apenas ao final da imersão</strong>.
            </p>
          </div>
        </div>
      )}

      <div className="mb-12 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Avaliação Final</h2>
        <p className="text-slate-400 mt-3 text-lg font-medium">Sua opinião é o que nos move para o futuro.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-14">
        
        <div className="space-y-8">
          <Label className="text-xl sm:text-2xl font-black text-white text-center block leading-snug">
            Em uma escala de 0 a 10, o quanto você recomendaria esta Imersão para um colega?
          </Label>
          
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 bg-slate-950 p-4 sm:p-6 rounded-[2.5rem] border border-slate-800">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
              const isSelected = score === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => !alreadyResponded && setScore(num)}
                  className={`w-12 h-14 sm:w-16 sm:h-20 flex items-center justify-center rounded-2xl sm:rounded-3xl text-xl sm:text-2xl font-black transition-all duration-300 border-2 ${
                    isSelected 
                      ? num >= 9 ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-[0_10px_30px_rgba(16,185,129,0.5)] scale-110' 
                        : num >= 7 ? 'bg-orange-500 text-slate-950 border-orange-500 shadow-[0_10px_30px_rgba(249,115,22,0.5)] scale-110' 
                        : 'bg-red-500 text-slate-950 border-red-500 shadow-[0_10px_30px_rgba(239,68,68,0.5)] scale-110'
                      : `bg-slate-900 text-slate-500 border-slate-800 ${
                          alreadyResponded ? 'opacity-50 cursor-default' : 'hover:border-slate-600 hover:text-white'
                        }`
                  }`}
                >
                  {num}
                </button>
              )
            })}
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-slate-500 px-6 uppercase tracking-widest font-bold">
            <span>Pouco provável</span>
            <span>Muito provável</span>
          </div>
        </div>

        <div className="space-y-5">
          <Label className="text-xl font-bold text-white block">Gostaria de deixar algum comentário, elogio ou sugestão?</Label>
          <Textarea 
            placeholder="Campo aberto (opcional)"
            className={`min-h-[160px] resize-none border-2 border-slate-800 focus-visible:ring-0 focus-visible:border-orange-500 rounded-3xl text-base p-6 bg-slate-950 focus:bg-slate-900 text-white placeholder:text-slate-600 transition-all shadow-inner ${alreadyResponded ? 'opacity-70 cursor-not-allowed' : ''}`}
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            readOnly={alreadyResponded}
          />
        </div>

        <div className="pt-6">
          {alreadyResponded ? (
            <div className="w-full h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center text-xl font-bold rounded-2xl">
              <CheckCircle2 className="w-6 h-6 mr-2" />
              Avaliação já enviada
            </div>
          ) : (
            <Button 
              type="submit" 
              disabled={score === null || isSubmitting}
              className="w-full h-16 bg-slate-800 hover:bg-orange-500 text-white hover:text-slate-950 text-xl font-bold rounded-2xl transition-all shadow-lg hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] disabled:opacity-50 disabled:shadow-none"
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Finalizar Imersão'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};