import React from 'react';
import { useAppContext } from '../../store/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WordCloud } from '../../components/WordCloud';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const AdminNPS: React.FC = () => {
  const { users, responses } = useAppContext();
  
  const npsResponses = responses.filter(r => r.type === 'nps');
  
  let promotores = 0;
  let neutros = 0;
  let detratores = 0;
  let totalScore = 0;

  npsResponses.forEach(r => {
    const score = r.data.score;
    totalScore += score;
    if (score >= 9) promotores++;
    else if (score >= 7) neutros++;
    else detratores++;
  });

  const total = npsResponses.length;
  const average = total > 0 ? (totalScore / total).toFixed(1) : '0.0';
  const npsScore = total > 0 ? Math.round(((promotores - detratores) / total) * 100) : 0;

  const distribution = Array.from({ length: 11 }, (_, i) => ({
    score: i.toString(),
    count: npsResponses.filter(r => r.data.score === i).length
  }));

  const maxCount = Math.max(...distribution.map(d => d.count), 1);
  const comments = npsResponses.map(r => r.data.suggestion).filter(Boolean);

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'bg-emerald-500'; 
    if (score >= 7) return 'bg-amber-500';   
    return 'bg-red-500';                     
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 text-center">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Score NPS</h3>
            <div className={`text-4xl font-bold ${npsScore > 50 ? 'text-emerald-500' : npsScore > 0 ? 'text-amber-500' : 'text-red-500'}`}>
              {npsScore}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 text-center">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Média (0-10)</h3>
            <div className="text-4xl font-bold text-white">{average}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 text-center">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Promotores (9-10)</h3>
            <div className="text-4xl font-bold text-emerald-500">{promotores}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 text-center flex justify-between">
            <div>
              <h3 className="text-slate-400 text-xs font-medium mb-1">Neutros</h3>
              <div className="text-2xl font-bold text-amber-500">{neutros}</div>
            </div>
            <div className="w-px h-full bg-slate-800"></div>
            <div>
              <h3 className="text-slate-400 text-xs font-medium mb-1">Detratores</h3>
              <div className="text-2xl font-bold text-red-500">{detratores}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">Distribuição de Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full flex items-end justify-between gap-1 sm:gap-2 pt-8 border-b border-slate-800/50 pb-2">
               {distribution.map((entry, idx) => {
                 const heightPercentage = (entry.count / maxCount) * 100;
                 return (
                   <div key={idx} className="flex flex-col items-center w-full gap-1 h-full justify-end group">
                     <div className="text-slate-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">{entry.count}</div>
                     <div 
                       className={`w-full ${getScoreColor(Number(entry.score))} hover:opacity-80 rounded-t-sm transition-all duration-700 ease-out`} 
                       style={{ height: `${heightPercentage}%`, minHeight: '2px' }}
                     ></div>
                     <div className="text-xs text-slate-500 mt-1 text-center font-medium">{entry.score}</div>
                   </div>
                 );
               })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 flex flex-col">
          <CardHeader>
            <CardTitle className="text-slate-100">Nuvem de Palavras: Comentários</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center bg-slate-950/50 m-4 rounded-xl border border-slate-800/50">
             <WordCloud words={comments} />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-100">Feedback Detalhado</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="rounded-md border border-slate-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-950">
                <TableRow className="border-slate-800 hover:bg-slate-950">
                  <TableHead className="text-slate-400 w-[250px]">Participante</TableHead>
                  <TableHead className="text-slate-400 w-[100px] text-center">Nota</TableHead>
                  <TableHead className="text-slate-400">Comentário</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {npsResponses.length > 0 ? (
                  // Ordenar pelas notas mais baixas primeiro (para atenção do admin)
                  [...npsResponses].sort((a, b) => a.data.score - b.data.score).map((p) => {
                    const user = users.find(u => u.id === p.userId);
                    return (
                      <TableRow key={p.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                        <TableCell className="font-medium text-slate-300">
                          <div>{user?.name || 'Desconhecido'}</div>
                          <div className="text-xs text-slate-500">{user?.email}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                            p.data.score >= 9 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            p.data.score >= 7 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {p.data.score}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-400 text-sm">
                          {p.data.suggestion || <span className="text-slate-600 italic">Sem comentário</span>}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-slate-500">
                      Nenhuma avaliação encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};