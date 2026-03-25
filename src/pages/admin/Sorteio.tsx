import React, { useState } from 'react';
import { useAppContext } from '../../store/AppContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Gift, RefreshCw, Trophy, Users, Sparkles } from 'lucide-react';

export const Sorteio: React.FC = () => {
  const { users, winners, addWinner, clearWinners } = useAppContext();
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<any>(null);
  const [avoidRepeat, setAvoidRepeat] = useState(true);

  // Filtra apenas participantes válidos (ativos e que não são admins)
  const activeParticipants = users.filter(u => u.isActive !== false && !u.isAdmin);
  
  // Define quem realmente está na roleta baseado na regra de repetição
  const eligibleUsers = avoidRepeat 
    ? activeParticipants.filter(u => !winners.map(w => w.id).includes(u.id))
    : activeParticipants;

  const handleDraw = () => {
    if (eligibleUsers.length === 0) {
      alert('Não há mais participantes elegíveis para o sorteio.');
      return;
    }

    setIsSpinning(true);
    setCurrentWinner(null);

    // Efeito visual de sorteio (simulação roleta rápida)
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
    <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-8rem)] pb-4 animate-in fade-in duration-700">
      
      {/* Coluna Principal - Área do Sorteio */}
      <div className="flex-1 flex flex-col gap-6 min-w-0 overflow-y-auto pr-1">
        
        {/* Palco do Sorteio */}
        <div className="relative flex-1 min-h-[350px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center justify-center p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08)_0,transparent_70%)] pointer-events-none"></div>
          
          {!currentWinner && !isSpinning && (
            <div className="text-center z-10 space-y-5 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-slate-950 border-2 border-slate-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Gift className="w-10 h-10 text-blue-500" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">Pronto para o Sorteio</h2>
                <p className="text-slate-400 font-medium">Prepare-se para descobrir o próximo ganhador.</p>
              </div>
            </div>
          )}

          {isSpinning && currentWinner && (
            <div className="text-center z-10 space-y-4">
              <div className="text-sm font-bold text-blue-500 uppercase tracking-widest animate-pulse">Sorteando...</div>
              <div className="text-5xl sm:text-6xl font-black text-white blur-[0.5px] opacity-90 scale-105 transition-all">
                {currentWinner.name}
              </div>
            </div>
          )}

          {!isSpinning && currentWinner && (
            <div className="text-center z-10 space-y-6 animate-in zoom-in slide-in-from-bottom-8 duration-700">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full"></div>
                <Trophy className="w-24 h-24 text-yellow-400 mx-auto relative z-10 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
              </div>
              <div>
                <div className="text-sm font-bold text-yellow-500 uppercase tracking-widest mb-3">Temos um Vencedor!</div>
                <h2 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-3">
                  {currentWinner.name}
                </h2>
                <p className="text-xl text-slate-400 font-medium">{currentWinner.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Painel de Controle */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg shrink-0">
          <Button 
            size="lg" 
            onClick={handleDraw} 
            disabled={isSpinning || eligibleUsers.length === 0}
            className="w-full sm:w-auto px-10 h-16 text-xl rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all disabled:opacity-50 disabled:shadow-none shrink-0"
          >
            {isSpinning ? <RefreshCw className="w-6 h-6 animate-spin mr-3" /> : <Sparkles className="w-6 h-6 mr-3" />}
            {isSpinning ? 'Sorteando...' : 'Sortear Agora'}
          </Button>
          
          <div className="flex items-center gap-4 bg-slate-950 px-6 py-4 rounded-2xl border border-slate-800 w-full sm:w-auto justify-center sm:justify-start">
            <Switch id="repeat" checked={avoidRepeat} onCheckedChange={setAvoidRepeat} className="data-[state=checked]:bg-blue-600" />
            <Label htmlFor="repeat" className="text-slate-300 font-semibold cursor-pointer">
              Evitar repetição
            </Label>
          </div>
        </div>

        {/* Participantes Elegíveis */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shrink-0">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-200 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Participantes na Roleta
            </h3>
            <div className="bg-blue-600/10 text-blue-400 px-3 py-1 rounded-full font-bold text-sm border border-blue-600/20">
              {eligibleUsers.length}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2.5 max-h-[120px] overflow-y-auto pr-2">
            {eligibleUsers.length > 0 ? (
              eligibleUsers.map(u => {
                const parts = u.name.split(' ');
                const displayName = parts.length > 1 
                  ? `${parts[0]} ${parts[parts.length-1][0]}.` 
                  : parts[0];

                return (
                  <div 
                    key={u.id} 
                    className="text-xs font-bold bg-slate-950 text-slate-400 px-4 py-2 rounded-xl border border-slate-800 shadow-sm transition-colors hover:border-blue-500/50 hover:text-blue-400"
                    title={u.name}
                  >
                    {displayName}
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-slate-500 w-full text-center py-4 font-medium">
                Nenhum participante disponível na roleta.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Coluna Lateral - Histórico */}
      <div className="w-full xl:w-96 flex flex-col gap-4 shrink-0">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center justify-between shadow-lg">
          <h3 className="font-bold text-slate-200 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Vencedores
          </h3>
          {winners.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearWinners} 
              className="h-8 px-3 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              Limpar
            </Button>
          )}
        </div>
        
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-3 overflow-y-auto shadow-lg">
          <div className="space-y-2">
            {winners.length === 0 ? (
              <div className="text-slate-500 text-sm text-center py-10 font-medium">
                Nenhum sorteio realizado.
              </div>
            ) : (
              [...winners].reverse().map((w, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex items-center gap-4 transition-all animate-in slide-in-from-right-4 duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-500 font-black text-sm shrink-0 shadow-inner">
                    #{winners.length - idx}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-slate-200 font-bold text-sm truncate">{w.name}</div>
                    <div className="text-slate-500 text-xs font-medium truncate mt-0.5">{w.email}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
};