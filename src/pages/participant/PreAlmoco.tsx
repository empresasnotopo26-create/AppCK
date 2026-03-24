import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { showSuccess } from '../../utils/toast';
import { Slider } from '@/components/ui/slider';

export const PreAlmoco: React.FC = () => {
  const [clarityScore, setClarityScore] = useState<number[]>([5]);
  const [usefulnessScore, setUsefulnessScore] = useState<number[]>([5]);
  const [relevantTheme, setRelevantTheme] = useState('');
  const [afternoonDoubts, setAfternoonDoubts] = useState('');
  
  const { saveResponse, responses, currentUser } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const previous = responses.find(r => r.userId === currentUser?.id && r.type === 'pre-almoco');
    if (previous && previous.type === 'pre-almoco') {
      setClarityScore([previous.data.clarityScore]);
      setUsefulnessScore([previous.data.usefulnessScore]);
      setRelevantTheme(previous.data.relevantTheme);
      setAfternoonDoubts(previous.data.afternoonDoubts);
    }
  }, [responses, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!relevantTheme) return;
    
    saveResponse('pre-almoco', { 
      clarityScore: clarityScore[0], 
      usefulnessScore: usefulnessScore[0], 
      relevantTheme, 
      afternoonDoubts 
    });
    showSuccess('Feedback enviado. Bom apetite!');
    navigate('/app');
  };

  const themeOptions = [
    'Introdução à IA Gen',
    'Agentes Autônomos',
    'Automação de Processos',
    'Casos de uso práticos',
    'Outro'
  ];

  return (
    <div className="animate-in fade-in duration-300 max-w-2xl mx-auto">
      <div className="mb-8 border-b pb-6">
        <h2 className="text-2xl font-bold text-slate-900">Feedback da Manhã</h2>
        <p className="text-slate-500 mt-2">Responda antes do almoço para nos ajudar a ajustar a tarde.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-end mb-4">
              <Label className="text-lg font-medium text-slate-800">O conteúdo da manhã foi claro?</Label>
              <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">{clarityScore[0]}/10</span>
            </div>
            <Slider
              value={clarityScore}
              onValueChange={setClarityScore}
              max={10}
              step={1}
              className="my-6"
            />
            <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
              <span>0 (Confuso)</span>
              <span>10 (Muito claro)</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-end mb-4">
              <Label className="text-lg font-medium text-slate-800">O conteúdo foi útil para sua realidade?</Label>
              <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">{usefulnessScore[0]}/10</span>
            </div>
            <Slider
              value={usefulnessScore}
              onValueChange={setUsefulnessScore}
              max={10}
              step={1}
              className="my-6"
            />
             <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
              <span>0 (Inútil)</span>
              <span>10 (Muito útil)</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-medium text-slate-800">Tema mais relevante para você até agora</Label>
          <RadioGroup value={relevantTheme} onValueChange={setRelevantTheme} className="flex flex-col space-y-2 mt-4">
            {themeOptions.map((option) => (
              <div key={option} className="flex items-center space-x-3 bg-slate-50 p-4 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer">
                <RadioGroupItem value={option} id={`theme-${option}`} />
                <Label htmlFor={`theme-${option}`} className="font-normal cursor-pointer flex-1">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-medium text-slate-800">Que dúvidas você quer ver respondidas à tarde?</Label>
          <Textarea 
            placeholder="Opcional: Deixe uma pergunta para os palestrantes"
            className="min-h-[100px] resize-none border-slate-200 focus-visible:ring-blue-600 rounded-xl"
            value={afternoonDoubts}
            onChange={(e) => setAfternoonDoubts(e.target.value)}
          />
        </div>

        <Button 
          type="submit" 
          disabled={!relevantTheme}
          className="w-full h-12 bg-slate-900 hover:bg-blue-600 text-white text-lg rounded-xl transition-all"
        >
          Enviar Feedback
        </Button>
      </form>
    </div>
  );
};