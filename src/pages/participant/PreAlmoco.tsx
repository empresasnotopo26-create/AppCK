import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { showSuccess } from '../../utils/toast';

export const PreAlmoco: React.FC = () => {
  const [clarityScore, setClarityScore] = useState<number | null>(null);
  const [usefulnessScore, setUsefulnessScore] = useState<number | null>(null);
  const [relevantTheme, setRelevantTheme] = useState('');
  const [afternoonDoubts, setAfternoonDoubts] = useState('');
  
  const { saveResponse, responses, currentUser } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const previous = responses.find(r => r.userId === currentUser?.id && r.type === 'pre-almoco');
    if (previous && previous.type === 'pre-almoco') {
      setClarityScore(previous.data.clarityScore);
      setUsefulnessScore(previous.data.usefulnessScore);
      setRelevantTheme(previous.data.relevantTheme);
      setAfternoonDoubts(previous.data.afternoonDoubts);
    }
  }, [responses, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clarityScore || !usefulnessScore || !relevantTheme) return;
    
    saveResponse('pre-almoco', { 
      clarityScore, 
      usefulnessScore, 
      relevantTheme, 
      afternoonDoubts 
    });
    showSuccess('Feedback enviado. Bom apetite!');
    navigate('/app');
  };

  const themeOptions = [
    'Automação',
    'Criação de apps',
    'Marketing com IA',
    'Agentes inteligentes',
    'Produtividade com IA'
  ];

  const renderScoreButtons = (score: number | null, setScore: (val: number) => void) => {
    return (
      <div className="flex justify-between items-center gap-2 sm:gap-4 mt-4">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => setScore(num)}
            className={`flex-1 h-14 sm:h-16 rounded-xl text-xl sm:text-2xl font-bold transition-all border-2 ${
              score === num 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' 
                : 'bg-white text-slate-500 border-slate-200 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    );
  };

  const isComplete = clarityScore && usefulnessScore && relevantTheme;

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto pb-8">
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-bold text-slate-900">Pesquisa Pré-almoço</h2>
        <p className="text-slate-500 mt-2 text-lg">Responda rapidamente para nos ajudar a ajustar a tarde.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        
        <div className="space-y-3">
          <Label className="text-lg font-semibold text-slate-800">O conteúdo da manhã foi claro?</Label>
          <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>1 - Muito confuso</span>
            <span>5 - Muito claro</span>
          </div>
          {renderScoreButtons(clarityScore, setClarityScore)}
        </div>

        <div className="space-y-3">
          <Label className="text-lg font-semibold text-slate-800">O conteúdo foi útil para sua realidade?</Label>
          <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>1 - Pouco útil</span>
            <span>5 - Muito útil</span>
          </div>
          {renderScoreButtons(usefulnessScore, setUsefulnessScore)}
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-semibold text-slate-800">Qual tema você mais gostou até agora?</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {themeOptions.map((opt) => {
              const isSelected = relevantTheme === opt;
              return (
                <div
                  key={opt}
                  onClick={() => setRelevantTheme(opt)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm' 
                      : 'border-slate-100 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                    isSelected ? 'border-blue-600' : 'border-slate-300'
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                  </div>
                  <span className={`font-medium ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>{opt}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-semibold text-slate-800 block">Quais dúvidas você gostaria que fossem abordadas à tarde?</Label>
          <Textarea 
            placeholder="Espaço opcional para sua pergunta..."
            className="min-h-[120px] resize-none border-2 border-slate-100 focus-visible:ring-0 focus-visible:border-blue-600 rounded-xl text-base p-4 bg-slate-50 focus:bg-white transition-colors"
            value={afternoonDoubts}
            onChange={(e) => setAfternoonDoubts(e.target.value)}
          />
        </div>

        <div className="pt-4 border-t border-slate-100">
          <Button 
            type="submit" 
            disabled={!isComplete}
            className="w-full h-14 bg-slate-900 hover:bg-blue-600 text-white text-lg font-semibold rounded-xl transition-all shadow-md"
          >
            Enviar Feedback
          </Button>
        </div>
      </form>
    </div>
  );
};