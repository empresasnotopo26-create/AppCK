import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { showSuccess } from '../../utils/toast';

export const Pesquisa: React.FC = () => {
  const [revenue, setRevenue] = useState('');
  const [biggestChallenge, setBiggestChallenge] = useState('');
  const [aiDoubts, setAiDoubts] = useState('');
  const { saveResponse, responses, currentUser } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const previous = responses.find(r => r.userId === currentUser?.id && r.type === 'pesquisa');
    if (previous && previous.type === 'pesquisa') {
      setRevenue(previous.data.revenue);
      setBiggestChallenge(previous.data.biggestChallenge);
      setAiDoubts(previous.data.aiDoubts);
    }
  }, [responses, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revenue || !biggestChallenge || !aiDoubts) return;
    
    saveResponse('pesquisa', { revenue, biggestChallenge, aiDoubts });
    showSuccess('Pesquisa enviada com sucesso!');
    navigate('/app');
  };

  const revenueOptions = [
    'Até R$ 360 mil',
    'R$ 360 mil a R$ 1 milhão',
    'R$ 1 milhão a R$ 5 milhões',
    'R$ 5 milhões a R$ 10 milhões',
    'Acima de R$ 10 milhões'
  ];

  const isComplete = revenue && biggestChallenge.trim() && aiDoubts.trim();

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto pb-8">
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Pesquisa Principal</h2>
        <p className="text-slate-500 mt-2 text-lg font-medium">Conhecendo a realidade do seu negócio.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* Faturamento */}
        <div className="space-y-5">
          <Label className="text-xl font-bold text-slate-800 leading-tight">Qual é o faturamento anual da sua empresa?</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {revenueOptions.map((opt) => {
              const isSelected = revenue === opt;
              return (
                <div
                  key={opt}
                  onClick={() => setRevenue(opt)}
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

        {/* Desafio Aberto */}
        <div className="space-y-5">
          <Label className="text-xl font-bold text-slate-800 block">Qual é hoje o maior desafio da sua empresa?</Label>
          <Textarea 
            placeholder="Descreva brevemente seu principal gargalo ou dificuldade..."
            className="min-h-[160px] resize-none border-2 border-slate-100 focus-visible:ring-0 focus-visible:border-blue-500 rounded-3xl text-base p-6 bg-slate-50 focus:bg-white transition-all shadow-inner"
            value={biggestChallenge}
            onChange={(e) => setBiggestChallenge(e.target.value)}
          />
        </div>

        {/* Dúvidas Abertas */}
        <div className="space-y-5">
          <Label className="text-xl font-bold text-slate-800 block">Quais são suas maiores dúvidas sobre IA neste momento?</Label>
          <Textarea 
            placeholder="O que você espera esclarecer ao longo desta imersão?"
            className="min-h-[160px] resize-none border-2 border-slate-100 focus-visible:ring-0 focus-visible:border-blue-500 rounded-3xl text-base p-6 bg-slate-50 focus:bg-white transition-all shadow-inner"
            value={aiDoubts}
            onChange={(e) => setAiDoubts(e.target.value)}
          />
        </div>

        <div className="pt-6">
          <Button 
            type="submit" 
            disabled={!isComplete}
            className="w-full h-16 bg-slate-900 hover:bg-blue-600 text-white text-xl font-bold rounded-2xl transition-all shadow-lg disabled:opacity-50"
          >
            Enviar Pesquisa
          </Button>
        </div>
      </form>
    </div>
  );
};