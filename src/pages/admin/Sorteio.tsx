import React, { useState } from 'react';
import { useAppContext } from '../../store/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Gift, RefreshCw, Trophy } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const Sorteio: React.FC = () => {
  const { users, winners, addWinner, clearWinners } = useAppContext();
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<any>(null);
  const [avoidRepeat, setAvoidRepeat] = useState(true);

  const handleDraw = () => {
    let eligibleUsers = users;
    
    if (avoidRepeat) {
      const winnerIds = winners.map(w => w.id);
      eligibleUsers = users.filter(u => !winnerIds.includes(u.id));
    }

    if (eligibleUsers.length === 0) {
      alert('Não há mais participantes elegíveis para o sorteio.');
      return;
    }

    setIsSpinning(true);
    setCurrentWinner(null);

    // Efeito visual de sorteio (simulação roleta)
    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * eligibleUsers.length);
      setCurrentWinner(eligibleUsers[randomIndex]);
      counter++;

      if (counter > 20) {
        clearInterval(interval);
        const finalWinner = eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];
        setCurrentWinner(finalWinner);
        addWinner(finalWinner);
        setIsSpinning(false);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500 h-[calc(100vh-8rem)]">
      
      {/* Área Principal Sorteio */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="absolute inset-0 bg-blue-900/10 blur-3xl rounded-full w-[80%] h-[80%] m-auto pointer-events-none"></div>
        
        <div className="w-full max-w-xl z-10 relative">
          <Card className="bg-slate-900/80 border-slate-700 backdrop-blur-md shadow-2xl overflow-hidden">
            <CardContent className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center relative">
              
              {!currentWinner && !isSpinning && (
                <div className="space-y-6">
                  <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-700">
                    <Gift className="w-10 h-10 text-slate-500" />
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-300">Pronto para o sorteio</h2>
                  <p className="text-slate-500">Clique no botão abaixo para selecionar um participante aleatório.</p>
                </div>
              )}

              {isSpinning && currentWinner && (
                <div className="space-y-4 animate-pulse">
                  <h3 className="text-xl text-slate-400 uppercase tracking-widest">Sorteando...</h3>
                  <div className="text-4xl font-bold text-white blur-[1px] opacity-80">{currentWinner.name}</div>
                </div>
              )}

              {!isSpinning && currentWinner && (
                <div className="space-y-6 animate-in zoom-in duration-500">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600"></div>
                  <Trophy className="w-20 h-20 text-yellow-400 mx-auto drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                  <div>
                    <h3 className="text-lg text-slate-400 uppercase tracking-widest mb-2">Vencedor</h3>
                    <div className="text-5xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                      {currentWinner.name}
                    </div>
                    <p className="text-xl text-slate-400 mt-4 font-light">{currentWinner.email}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 flex flex-col items-center gap-6">
            <Button 
              size="lg" 
              onClick={handleDraw} 
              disabled={isSpinning || users.length === 0}
              className="w-full sm:w-auto px-12 h-16 text-xl rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] transition-all disabled:opacity-50 disabled:shadow-none"
            >
              {isSpinning ? <RefreshCw className="w-6 h-6 animate-spin mr-2" /> : <Gift className="w-6 h-6 mr-2" />}
              Sortear Agora
            </Button>
            
            <div className="flex items-center space-x-2 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
              <Switch id="repeat" checked={avoidRepeat} onCheckedChange={setAvoidRepeat} />
              <Label htmlFor="repeat" className="text-slate-400 cursor-pointer text-sm">Evitar repetição de vencedores</Label>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Histórico */}
      <div className="w-full lg:w-80 bg-slate-900 border-l border-slate-800 flex flex-col rounded-xl overflow-hidden shadow-lg h-full">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <h3 className="font-semibold text-slate-200">Histórico</h3>
          {winners.length > 0 && (
            <button onClick={clearWinners} className="text-xs text-slate-500 hover:text-red-400 transition-colors">Limpar</button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {winners.length === 0 ? (
            <div className="text-slate-500 text-sm text-center py-8">Nenhum sorteio realizado ainda.</div>
          ) : (
            [...winners].reverse().map((w, idx) => (
              <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 font-bold text-xs">
                  #{winners.length - idx}
                </div>
                <div>
                  <div className="text-slate-200 font-medium text-sm">{w.name}</div>
                  <div className="text-slate-500 text-xs">{w.email}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};