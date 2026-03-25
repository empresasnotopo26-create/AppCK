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
    'De R$ 360 mil a R$ 1 milhão',
    'De R$ 1 milhão a R$ 5 milhões',
    'De R$ 5 milhões a R$ 10 milhões',
    'Acima de R$ 10 milhões'
  ];

  const isComplete = revenue && biggestChallenge.trim() && aiDoubts.trim();

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto pb-8">
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-bold text-slate-900">Pesquisa Principal</h2>
        <p className="text-slate-500 mt-2 text-lg">Queremos conhecer melhor a realidade do seu negócio.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* Faturamento */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-slate-800">Qual é o faturamento anual da sua empresa?</Label>
          <div className="grid grid-cols-1 gap-3 mt-4">
            {revenueOptions.map((opt) => {
              const isSelected = revenue === opt;
              return (
                <div
                  key={opt}
                  onClick={() => setRevenue(opt)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm' 
                      : 'border-slate-100 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${
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

        {/* Desafio Aberto */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-slate-800 block">Qual é hoje o maior desafio da sua empresa?</Label>
          <Textarea 
            placeholder="Descreva brevemente seu principal gargalo ou dificuldade..."
            className="min-h-[140px] resize-none border-2 border-slate-100 focus-visible:ring-0 focus-visible:border-blue-600 rounded-xl text-base p-4 bg-slate-50 focus:bg-white transition-colors"
            value={biggestChallenge}
            onChange={(e) => setBiggestChallenge(e.target.value)}
          />
        </div>

        {/* Dúvidas Abertas */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-slate-800 block">Quais são suas maiores dúvidas sobre IA neste momento?</Label>
          <Textarea 
            placeholder="O que você espera esclarecer ao longo desta imersão?"
            className="min-h-[140px] resize-none border-2 border-slate-100 focus-visible:ring-0 focus-visible:border-blue-600 rounded-xl text-base p-4 bg-slate-50 focus:bg-white transition-colors"
            value={aiDoubts}
            onChange={(e) => setAiDoubts(e.target.value)}
          />
        </div>

        <div className="pt-4 border-t border-slate-100">
          <Button 
            type="submit" 
            disabled={!isComplete}
            className="w-full h-14 bg-slate-900 hover:bg-blue-600 text-white text-lg font-semibold rounded-xl transition-all shadow-md"
          >
            Enviar Pesquisa
          </Button>
        </div>
      </form>
    </div>
  );
};