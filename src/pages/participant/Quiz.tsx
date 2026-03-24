import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { showSuccess } from '../../utils/toast';

export const Quiz: React.FC = () => {
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const { saveResponse, responses, currentUser } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Pré-preencher se já respondeu
    const previous = responses.find(r => r.userId === currentUser?.id && r.type === 'quiz');
    if (previous && previous.type === 'quiz') {
      setQ1(previous.data.q1);
      setQ2(previous.data.q2);
    }
  }, [responses, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q1 || !q2) return;
    
    saveResponse('quiz', { q1, q2 });
    showSuccess('Respostas salvas com sucesso!');
    navigate('/app');
  };

  return (
    <div className="animate-in fade-in duration-300 max-w-2xl mx-auto">
      <div className="mb-8 border-b pb-6">
        <h2 className="text-2xl font-bold text-slate-900">Quiz Rápido</h2>
        <p className="text-slate-500 mt-2">Nivelamento de conhecimento (Não vale nota)</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        <div className="space-y-4">
          <Label className="text-lg font-medium text-slate-800">1. O que é um LLM (Large Language Model)?</Label>
          <RadioGroup value={q1} onValueChange={setQ1} className="flex flex-col space-y-2 mt-4">
            {['Um modelo preditivo de vendas', 'Um modelo de inteligência artificial treinado em vastas quantidades de texto', 'Um tipo de banco de dados relacional', 'Um framework de desenvolvimento frontend'].map((option) => (
              <div key={option} className="flex items-center space-x-3 bg-slate-50 p-4 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer">
                <RadioGroupItem value={option} id={`q1-${option}`} />
                <Label htmlFor={`q1-${option}`} className="font-normal cursor-pointer flex-1">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-medium text-slate-800">2. Qual o principal desafio ético da IA atual?</Label>
          <RadioGroup value={q2} onValueChange={setQ2} className="flex flex-col space-y-2 mt-4">
            {['Viés nos dados e decisões', 'Consumo excessivo de eletricidade', 'Criação de websites feios', 'Lentidão nas respostas do ChatGPT'].map((option) => (
              <div key={option} className="flex items-center space-x-3 bg-slate-50 p-4 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer">
                <RadioGroupItem value={option} id={`q2-${option}`} />
                <Label htmlFor={`q2-${option}`} className="font-normal cursor-pointer flex-1">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Button 
          type="submit" 
          disabled={!q1 || !q2}
          className="w-full h-12 bg-slate-900 hover:bg-blue-600 text-white text-lg rounded-xl transition-all mt-8"
        >
          Salvar Respostas
        </Button>
      </form>
    </div>
  );
};