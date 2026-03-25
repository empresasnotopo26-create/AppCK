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
    'Agentes inteligentes'
  ];

  const renderScoreButtons = (score: number | null, setScore: (val: number) => void) => {
    return (
      <div className="flex justify-between items-center gap-2 sm:gap-4 mt-4 bg-slate-50 p-3 sm:p-4 rounded-[2rem] border border-slate-100">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => setScore(num)}
            className={`flex-1 h-16 sm:h-20 rounded-2xl sm:rounded-3xl text-xl sm:text-2xl font-black transition-all duration-300 ${
              score === num 
                ? 'bg-blue-600 text-white shadow-[0_8px_25px_rgba(37,99,235,0.4)] scale-110' 
                : 'bg-white text-slate-400 border-2 border-slate-100 hover:border-blue-300 hover:text-blue-600 hover:bg-white'
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
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Avaliação da Manhã</h2>
        <p className="text-slate-500 mt-2 text-lg font-medium">Ajude-nos a calibrar o conteúdo da tarde.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-14">
        
        <div className="space-y-4">
          <Label className="text-xl font-bold text-slate-800">O conteúdo da manhã foi claro?</Label>
          {renderScoreButtons(clarityScore, setClarityScore)}
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest px-4 pt-2">
            <span>Confuso</span>
            <span>Muito claro</span>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-xl font-bold text-slate-800">O conteúdo foi útil para sua realidade?</Label>
          {renderScoreButtons(usefulnessScore, setUsefulnessScore)}
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest px-4 pt-2">
            <span>Pouco útil</span>
            <span>Muito útil</span>
          </div>
        </div>

        <div className="space-y-5">
          <Label className="text-xl font-bold text-slate-800">Qual tema você mais gostou até agora?</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {themeOptions.map((opt) => {
              const isSelected = relevantTheme === opt;
              return (
                 <div
                  key={opt}
                  onClick={() => setRelevantTheme(opt)}
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
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <Label className="text-xl font-bold text-slate-800 block">Quais dúvidas você gostaria que fossem abordadas à tarde?</Label>
          <Textarea 
            placeholder="Espaço opcional para sua pergunta..."
            className="min-h-[140px] resize-none border-2 border-slate-100 focus-visible:ring-0 focus-visible:border-blue-500 rounded-3xl text-base p-6 bg-slate-50 focus:bg-white transition-all shadow-inner"
            value={afternoonDoubts}
            onChange={(e) => setAfternoonDoubts(e.target.value)}
          />
        </div>

        <div className="pt-6">
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