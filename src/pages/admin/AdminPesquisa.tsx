import React from 'react';
import { useAppContext } from '../../store/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WordCloud } from '../../components/WordCloud';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const AdminPesquisa: React.FC = () => {
  const { users, responses } = useAppContext();
  
  const pesquisas = responses.filter(r => r.type === 'pesquisa');
  
  // Agrupar faturamento
  const revenueCount = pesquisas.reduce((acc, curr) => {
    const val = curr.data.revenue;
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const revenueData = Object.entries(revenueCount).map(([name, value]) => ({ name, value }));
  const COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-amber-500', 'bg-emerald-500'];

  const totalPesquisas = pesquisas.length || 1;

  // Coletar textos para nuvem de palavras
  const desafiosWords = pesquisas.map(p => p.data.biggestChallenge).filter(Boolean);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">Faturamento das Empresas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5 mt-4">
               {revenueData.sort((a,b) => b.value - a.value).map((item, index) => {
                 const percent = Math.round((item.value / totalPesquisas) * 100);
                 const colorClass = COLORS[index % COLORS.length];
                 return (
                   <div key={item.name} className="space-y-2">
                     <div className="flex justify-between text-sm">
                       <span className="text-slate-300 font-medium">{item.name}</span>
                       <span className="text-slate-400">{percent}% ({item.value})</span>
                     </div>
                     <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                       <div className={`${colorClass} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${percent}%` }}></div>
                     </div>
                   </div>
                 );
               })}
               {revenueData.length === 0 && (
                 <p className="text-slate-500 text-center py-8">Sem dados suficientes.</p>
               )}
             </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 flex flex-col">
          <CardHeader>
            <CardTitle className="text-slate-100">Nuvem de Palavras: Maiores Desafios</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center bg-slate-950/50 m-4 rounded-xl border border-slate-800/50 overflow-hidden">
             <WordCloud words={desafiosWords} />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-100">Respostas Detalhadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-950">
                <TableRow className="border-slate-800 hover:bg-slate-950">
                  <TableHead className="text-slate-400 w-[200px]">Participante</TableHead>
                  <TableHead className="text-slate-400 w-[200px]">Faturamento</TableHead>
                  <TableHead className="text-slate-400">Maior Desafio</TableHead>
                  <TableHead className="text-slate-400">Dúvidas sobre IA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pesquisas.length > 0 ? (
                  pesquisas.map((p) => {
                    const user = users.find(u => u.id === p.userId);
                    return (
                      <TableRow key={p.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                        <TableCell className="font-medium text-slate-300">
                          <div>{user?.name || 'Desconhecido'}</div>
                          <div className="text-xs text-slate-500">{user?.email}</div>
                        </TableCell>
                        <TableCell className="text-slate-300">
                           <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs border border-blue-800/50">
                             {p.data.revenue}
                           </span>
                        </TableCell>
                        <TableCell className="text-slate-400 text-sm">{p.data.biggestChallenge}</TableCell>
                        <TableCell className="text-slate-400 text-sm">{p.data.aiDoubts}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                      Nenhuma resposta encontrada.
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