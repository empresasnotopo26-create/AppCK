import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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

  return (
    <div className="animate-in fade-in duration-300 max-w-2xl mx-auto">
      <div className="mb-8 border-b pb-6">
        <h2 className="text-2xl font-bold text-slate-900">Pesquisa Principal</h2>
        <p className="text-slate-500 mt-2">Queremos conhecer melhor a sua realidade.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="space-y-4">
          <Label className="text-lg font-medium text-slate-800">Faturamento anual da empresa</Label>
          <RadioGroup value={revenue} onValueChange={setRevenue} className="flex flex-col space-y-2 mt-4">
            {revenueOptions.map((option) => (
              <div key={option} className="flex items-center space-x-3 bg-slate-50 p-4 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer">
                <RadioGroupItem value={option} id={`rev-${option}`} />
                <Label htmlFor={`rev-${option}`} className="font-normal cursor-pointer flex-1">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-medium text-slate-800">Qual é hoje o maior desafio da sua empresa?</Label>
          <Textarea 
            placeholder="Descreva brevemente o seu maior desafio atual..."
            className="min-h-[120px] resize-none border-slate-200 focus-visible:ring-blue-600 rounded-xl"
            value={biggestChallenge}
            onChange={(e) => setBiggestChallenge(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-medium text-slate-800">Quais são suas maiores dúvidas sobre IA?</Label>
          <Textarea 
            placeholder="O que você espera esclarecer hoje?"
            className="min-h-[120px] resize-none border-slate-200 focus-visible:ring-blue-600 rounded-xl"
            value={aiDoubts}
            onChange={(e) => setAiDoubts(e.target.value)}
          />
        </div>

        <Button 
          type="submit" 
          disabled={!revenue || !biggestChallenge || !aiDoubts}
          className="w-full h-12 bg-slate-900 hover:bg-blue-600 text-white text-lg rounded-xl transition-all"
        >
          Enviar Respostas
        </Button>
      </form>
    </div>
  );
};