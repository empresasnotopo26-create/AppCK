import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { showSuccess } from '../../utils/toast';
import { Loader2, CheckCircle2 } from 'lucide-react';

export const Pesquisa: React.FC = () => {
  const [revenue, setRevenue] = useState('');
  const [biggestChallenge, setBiggestChallenge] = useState('');
  const [aiDoubts, setAiDoubts] = useState('');
  const [morningRating, setMorningRating] = useState<number | null>(null);
  const [afternoonExpectation, setAfternoonExpectation] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyResponded, setAlreadyResponded] = useState(false);
  
  const { saveResponse, responses, currentUser } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const previous = responses.find(r => r.userId === currentUser?.id && r.type === 'pesquisa');
    if (previous && previous.type === 'pesquisa') {
      setRevenue(previous.data.revenue);
      setBiggestChallenge(previous.data.biggestChallenge);
      setAiDoubts(previous.data.aiDoubts);
      setMorningRating(previous.data.morningRating ?? null);
      setAfternoonExpectation(previous.data.afternoonExpectation ?? '');
      setAlreadyResponded(true);
    }
  }, [responses, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (alreadyResponded || !isComplete) return;
    
    setIsSubmitting(true);
    try {
      await saveResponse('pesquisa', { 
        revenue, 
        biggestChallenge, 
        aiDoubts,
        morningRating,
        afternoonExpectation
      });
      showSuccess('Pesquisa enviada com sucesso!');
      navigate('/app');
    } finally {
      setIsSubmitting(false);
    }
  };

  const revenueOptions = [
    'Até R$ 50 mil',
    'R$ 50 mil a R$ 100 mil',
    'R$ 100 mil a R$ 360 mil',
    'R$ 360 mil a R$ 1 milhão',
    'R$ 1 milhão a R$ 5 milhões',
    'R$ 5 milhões a R$ 10 milhões',
    'Acima de R$ 10 milhões'
  ];

  const isComplete = revenue && 
    biggestChallenge.trim() && 
    aiDoubts.trim() && 
    morningRating !== null && 
    afternoonExpectation.trim();

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto pb-8">
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-3xl font-black text-white tracking-tight">Pesquisa Principal</h2>
        <p className="text-slate-400 mt-2 text-lg font-medium">Conhecendo a realidade do seu negócio.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* Faturamento */}
        <div className="space-y-5">
          <Label className="text-xl font-bold text-white leading-tight">Qual é o faturamento anual da sua empresa?</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {revenueOptions.map((opt) => {
              const isSelected = revenue === opt;
              return (
                <div
                  key={opt}
                  onClick={() => !alreadyResponded && setRevenue(opt)}
                  className={`p-5 rounded-3xl border-2 transition-all duration-200 flex items-center justify-between ${
                    isSelected 
                      ? 'border-orange-500 bg-orange-500 text-slate-950 shadow-[0_0_20px_rgba(249,115,22,0.3)] scale-[1.02]' 
                      : `border-slate-800 bg-slate-950 text-slate-300 ${
                          alreadyResponded ? 'opacity-50 cursor-default' : 'hover:border-orange-500/50 hover:bg-slate-900 cursor-pointer'
                        }`
                  }`}
                >
                  <span className="font-bold text-[15px]">{opt}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'border-slate-950 bg-orange-500' : 'border-slate-700 bg-slate-900'
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-slate-950 rounded-full" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desafio Aberto */}
        <div className="space-y-5">
          <Label className="text-xl font-bold text-white block">Qual é hoje o maior desafio da sua empresa?</Label>
          <Textarea 
            placeholder="Descreva brevemente seu principal gargalo ou dificuldade..."
            className={`min-h-[140px] resize-none border-2 border-slate-800 focus-visible:ring-0 focus-visible:border-orange-500 rounded-3xl text-base p-6 bg-slate-950 focus:bg-slate-900 text-white placeholder:text-slate-600 transition-all shadow-inner ${alreadyResponded ? 'opacity-70 cursor-not-allowed' : ''}`}
            value={biggestChallenge}
            onChange={(e) => setBiggestChallenge(e.target.value)}
            readOnly={alreadyResponded}
          />
        </div>

        {/* Dúvidas Abertas */}
        <div className="space-y-5">
          <Label className="text-xl font-bold text-white block">Quais são suas maiores dúvidas sobre IA neste momento?</Label>
          <Textarea 
            placeholder="O que você espera esclarecer ao longo desta imersão?"
            className={`min-h-[140px] resize-none border-2 border-slate-800 focus-visible:ring-0 focus-visible:border-orange-500 rounded-3xl text-base p-6 bg-slate-950 focus:bg-slate-900 text-white placeholder:text-slate-600 transition-all shadow-inner ${alreadyResponded ? 'opacity-70 cursor-not-allowed' : ''}`}
            value={aiDoubts}
            onChange={(e) => setAiDoubts(e.target.value)}
            readOnly={alreadyResponded}
          />
        </div>

        {/* Avaliação da Manhã */}
        <div className="space-y-5">
          <Label className="text-xl font-bold text-white block">O que achou do período da manhã?</Label>
          <div className="flex justify-between items-center gap-1 sm:gap-3 mt-4 bg-slate-950 p-2 sm:p-4 rounded-[2rem] border border-slate-800">
            {[0, 1, 2, 3, 4].map((num) => {
              const isSelected = morningRating === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => !alreadyResponded && setMorningRating(num)}
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

        {/* Expectativa da Tarde */}
        <div className="space-y-5">
          <Label className="text-xl font-bold text-white block">O que espera para a tarde?</Label>
          <Textarea 
            placeholder="Compartilhe o que você gostaria de ver ou aprender hoje à tarde..."
            className={`min-h-[140px] resize-none border-2 border-slate-800 focus-visible:ring-0 focus-visible:border-orange-500 rounded-3xl text-base p-6 bg-slate-950 focus:bg-slate-900 text-white placeholder:text-slate-600 transition-all shadow-inner ${alreadyResponded ? 'opacity-70 cursor-not-allowed' : ''}`}
            value={afternoonExpectation}
            onChange={(e) => setAfternoonExpectation(e.target.value)}
            readOnly={alreadyResponded}
          />
        </div>

        <div className="pt-6">
          {alreadyResponded ? (
            <div className="w-full h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center text-xl font-bold rounded-2xl">
              <CheckCircle2 className="w-6 h-6 mr-2" />
              Pesquisa já respondida
            </div>
          ) : (
            <Button 
              type="submit" 
              disabled={!isComplete || isSubmitting}
              className="w-full h-16 bg-slate-800 hover:bg-orange-500 text-white hover:text-slate-950 text-xl font-bold rounded-2xl transition-all shadow-lg hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] disabled:opacity-50 disabled:shadow-none"
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Enviar Pesquisa'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};