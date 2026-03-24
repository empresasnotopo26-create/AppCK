import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { showSuccess } from '../../utils/toast';

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
    showSuccess('Muito obrigado pela avaliação!');
    navigate('/app');
  };

  return (
    <div className="animate-in fade-in duration-300 max-w-2xl mx-auto">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl mb-8 flex items-start gap-3">
        <div className="mt-0.5">⚠️</div>
        <p className="text-sm font-medium">Por favor, responda a esta pesquisa apenas ao <strong>final da imersão</strong>.</p>
      </div>

      <div className="mb-8 border-b pb-6">
        <h2 className="text-2xl font-bold text-slate-900">Avaliação Final (NPS)</h2>
        <p className="text-slate-500 mt-2">Sua opinião é fundamental para melhorarmos sempre.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        <div className="space-y-6">
          <Label className="text-lg font-medium text-slate-800 text-center block">
            Em uma escala de 0 a 10, o quanto você recomendaria esta Imersão para um colega?
          </Label>
          
          <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100 overflow-x-auto">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setScore(num)}
                className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg text-lg font-bold transition-all mx-1 flex-shrink-0 ${
                  score === num 
                    ? num >= 9 ? 'bg-emerald-500 text-white scale-110 shadow-md' 
                      : num >= 7 ? 'bg-amber-500 text-white scale-110 shadow-md' 
                      : 'bg-red-500 text-white scale-110 shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-400 px-2 uppercase tracking-wider font-semibold">
            <span>Pouco provável</span>
            <span>Muito provável</span>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-medium text-slate-800">Gostaria de deixar algum comentário, elogio ou sugestão?</Label>
          <Textarea 
            placeholder="Campo aberto (opcional)"
            className="min-h-[120px] resize-none border-slate-200 focus-visible:ring-blue-600 rounded-xl"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
          />
        </div>

        <Button 
          type="submit" 
          disabled={score === null}
          className="w-full h-12 bg-slate-900 hover:bg-blue-600 text-white text-lg rounded-xl transition-all"
        >
          Finalizar Avaliação
        </Button>
      </form>
    </div>
  );
};