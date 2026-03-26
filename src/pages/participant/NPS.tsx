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

  // Funções para controle de Cores Dinâmicas do NPS
  const getScoreColorHex = (s: number | null) => {
    if (s === null) return '#27272a'; // Estado inicial neutro (cinza escuro)
    if (s >= 9) return '#10b981'; // Promotor (Verde)
    if (s >= 7) return '#f59e0b'; // Neutro (Amarelo)
    return '#ef4444'; // Detrator (Vermelho)
  };

  const getScoreColorClass = (s: number | null) => {
    if (s === null) return 'text-slate-600';
    if (s >= 9) return 'text-emerald-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]';
    if (s >= 7) return 'text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]';
    return 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]';
  };

  const getScoreLabel = (s: number | null) => {
    if (s === null) return 'Arraste para avaliar';
    if (s >= 9) return 'Promotor';
    if (s >= 7) return 'Neutro';
    return 'Detrator';
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
        
        <div className="space-y-10">
          <Label className="text-xl sm:text-2xl font-black text-white text-center block leading-snug">
            Em uma escala de 0 a 10, o quanto você recomendaria esta Imersão para um colega?
          </Label>
          
          <div className="bg-slate-900/50 p-6 sm:p-12 rounded-[2.5rem] border border-slate-800 flex flex-col items-center justify-center relative shadow-inner">
             
             {/* Exibição Gigante do Número */}
             <div className="flex flex-col items-center mb-10">
                <span className={`text-8xl sm:text-9xl font-black transition-colors duration-300 tracking-tighter ${getScoreColorClass(score)}`}>
                   {score !== null ? score : '-'}
                </span>
                <span className={`text-lg sm:text-xl font-bold mt-4 uppercase tracking-widest transition-colors duration-300 ${
                  score === null ? 'text-slate-500' :
                  score >= 9 ? 'text-emerald-500' : 
                  score >= 7 ? 'text-amber-500' : 
                  'text-red-500'
                }`}>
                   {getScoreLabel(score)}
                </span>
             </div>

             {/* Área do Slider de Arrasto */}
             <div className="w-full relative px-2 sm:px-6">
               <style>{`
                  input[type=range] {
                    -webkit-appearance: none;
                    width: 100%;
                    background: transparent;
                  }
                  input[type=range]:focus {
                    outline: none;
                  }
                  /* Custom Track */
                  input[type=range]::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 14px;
                    cursor: pointer;
                    border-radius: 9999px;
                    background: linear-gradient(to right, ${getScoreColorHex(score)} 0%, ${getScoreColorHex(score)} ${(score ?? 5) * 10}%, #141414 ${(score ?? 5) * 10}%, #141414 100%);
                    border: 1px solid #000;
                  }
                  /* Custom Thumb (Bolinha) */
                  input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 44px;
                    width: 44px;
                    border-radius: 50%;
                    background: ${getScoreColorHex(score)};
                    cursor: pointer;
                    border: 6px solid #000;
                    box-shadow: 0 0 25px ${getScoreColorHex(score)}90;
                    margin-top: -16px;
                    transition: transform 0.15s ease, background-color 0.3s ease;
                  }
                  input[type=range]:not(:disabled)::-webkit-slider-thumb:hover {
                    transform: scale(1.15);
                  }
                  input[type=range]:not(:disabled)::-webkit-slider-thumb:active {
                    transform: scale(0.95);
                  }

                  /* Firefox Support */
                  input[type=range]::-moz-range-track {
                    width: 100%;
                    height: 14px;
                    cursor: pointer;
                    border-radius: 9999px;
                    background: linear-gradient(to right, ${getScoreColorHex(score)} 0%, ${getScoreColorHex(score)} ${(score ?? 5) * 10}%, #141414 ${(score ?? 5) * 10}%, #141414 100%);
                    border: 1px solid #000;
                  }
                  input[type=range]::-moz-range-thumb {
                    height: 44px;
                    width: 44px;
                    border-radius: 50%;
                    background: ${getScoreColorHex(score)};
                    cursor: pointer;
                    border: 6px solid #000;
                    box-shadow: 0 0 25px ${getScoreColorHex(score)}90;
                    transition: transform 0.15s ease, background-color 0.3s ease;
                  }
                  input[type=range]:not(:disabled)::-moz-range-thumb:hover {
                    transform: scale(1.15);
                  }
                  input[type=range]:not(:disabled)::-moz-range-thumb:active {
                    transform: scale(0.95);
                  }
               `}</style>
               
               <input
                 type="range"
                 min="0"
                 max="10"
                 step="1"
                 value={score ?? 5}
                 onChange={(e) => !alreadyResponded && setScore(Number(e.target.value))}
                 disabled={alreadyResponded}
                 className={`w-full transition-opacity duration-300 ${alreadyResponded ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
               />
               
               <div className="flex justify-between text-xs sm:text-sm text-slate-500 uppercase tracking-widest font-bold mt-8">
                 <span className="flex flex-col gap-1 items-start">
                   <span className="text-red-500 font-black text-lg">0</span>
                   Pior nota
                 </span>
                 <span className="flex flex-col gap-1 items-end">
                   <span className="text-emerald-500 font-black text-lg">10</span>
                   Melhor nota
                 </span>
               </div>
             </div>
          </div>
        </div>

        <div className="space-y-5">
          <Label className="text-xl font-bold text-white block">Gostaria de deixar algum comentário, elogio ou sugestão?</Label>
          <Textarea 
            placeholder="Campo aberto (opcional)"
            className={`min-h-[160px] resize-none border-2 border-slate-800 focus-visible:ring-0 focus-visible:border-orange-500 rounded-3xl text-base p-6 bg-slate-900 focus:bg-slate-900/80 text-white placeholder:text-slate-600 transition-all shadow-inner ${alreadyResponded ? 'opacity-70 cursor-not-allowed' : ''}`}
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
              className="w-full h-16 bg-orange-600 hover:bg-orange-500 text-black text-xl font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(255,94,0,0.3)] hover:shadow-[0_0_35px_rgba(255,94,0,0.6)] disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none"
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Finalizar Imersão'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};