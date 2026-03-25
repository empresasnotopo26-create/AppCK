import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { showSuccess } from '../../utils/toast';
import { AlertCircle } from 'lucide-react';

export const NPS: React.FC = () => {
  const [score, setScore] = useState<number | null>(null);
  const [suggestion, setSuggestion] = useState('');
  
  const { saveResponse, responses, currentUser } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const previous = responses.find(r => r.userId === currentUser?.id && r.type === 'nps');
    if (previous && previous.type === 'nps') {
      setScore(previous.data.score);
      setSuggestion(previous.data.suggestion);
    }
  }, [responses, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (score === null) return;
    
    saveResponse('nps', { score, suggestion });
    showSuccess('Avaliação enviada! Muito obrigado.');
    navigate('/app');
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-3xl mx-auto pb-8">
      
      {/* Banner de Aviso Refinado */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 sm:p-5 rounded-r-xl mb-10 flex items-start gap-4 shadow-sm">
        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-amber-800 text-base">Atenção!</h3>
          <p className="text-amber-700 text-sm mt-1 leading-relaxed">
            Responda esta pesquisa <strong>apenas ao final da imersão</strong>, para que você possa avaliar o evento por completo.
          </p>
        </div>
      </div>

      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-slate-900">Avaliação Final</h2>
        <p className="text-slate-500 mt-3 text-lg">Sua opinião é fundamental para evoluirmos.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        
        <div className="space-y-6">
          <Label className="text-xl font-bold text-slate-800 text-center block mb-8 leading-relaxed">
            Em uma escala de 0 a 10, o quanto você recomendaria esta Imersão para um colega?
          </Label>
          
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-100">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
              const isSelected = score === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => setScore(num)}
                  className={`w-12 h-14 sm:w-14 sm:h-16 flex items-center justify-center rounded-xl text-xl font-bold transition-all border-2 ${
                    isSelected 
                      ? num >= 9 ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg scale-110' 
                        : num >= 7 ? 'bg-amber-500 text-white border-amber-500 shadow-lg scale-110' 
                        : 'bg-red-500 text-white border-red-500 shadow-lg scale-110'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {num}
                </button>
              )
            })}
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-slate-400 px-4 uppercase tracking-wider font-bold">
            <span>Pouco provável</span>
            <span>Muito provável</span>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-semibold text-slate-800 block">Gostaria de deixar algum comentário, elogio ou sugestão?</Label>
          <Textarea 
            placeholder="Campo aberto (opcional)"
            className="min-h-[140px] resize-none border-2 border-slate-100 focus-visible:ring-0 focus-visible:border-blue-600 rounded-xl text-base p-4 bg-slate-50 focus:bg-white transition-colors"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
          />
        </div>

        <div className="pt-6">
          <Button 
            type="submit" 
            disabled={score === null}
            className="w-full h-14 bg-slate-900 hover:bg-blue-600 text-white text-lg font-bold rounded-xl transition-all shadow-md"
          >
            Finalizar Avaliação
          </Button>
        </div>
      </form>
    </div>
  );
};