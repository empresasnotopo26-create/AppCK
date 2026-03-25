import React from 'react';
import { useAppContext } from '../../store/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WordCloud } from '../../components/WordCloud';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Lightbulb, Target } from 'lucide-react';

export const AdminPreAlmoco: React.FC = () => {
  const { users, responses } = useAppContext();
  
  const preAlmocoResp = responses.filter(r => r.type === 'pre-almoco');
  const total = preAlmocoResp.length || 1;

  // Calculando médias
  const avgClarity = (preAlmocoResp.reduce((acc, curr: any) => acc + curr.data.clarityScore, 0) / total).toFixed(1);
  const avgUsefulness = (preAlmocoResp.reduce((acc, curr: any) => acc + curr.data.usefulnessScore, 0) / total).toFixed(1);

  // Temas preferidos
  const themeCounts = preAlmocoResp.reduce((acc, curr: any) => {
    const val = curr.data.relevantTheme;
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const themesData = Object.entries(themeCounts).sort((a, b) => b[1] - a[1]);

  // Palavras para Nuvem
  const doubts = preAlmocoResp.map((r: any) => r.data.afternoonDoubts).filter(Boolean);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Cards de Média */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-900 border-slate-800 shadow-md">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Lightbulb className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Clareza do Conteúdo (1-5)</p>
              <h3 className="text-4xl font-bold text-white mt-1">{avgClarity !== '0.0' ? avgClarity : '-'}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800 shadow-md">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Target className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Utilidade Prática (1-5)</p>
              <h3 className="text-4xl font-bold text-white mt-1">{avgUsefulness !== '0.0' ? avgUsefulness : '-'}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800 shadow-md">
          <CardHeader>
            <CardTitle className="text-slate-100 text-base">Temas Favoritos da Manhã</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              {themesData.length > 0 ? themesData.map(([theme, count]) => {
                const percent = Math.round((count / total) * 100);
                return (
                  <div key={theme} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300 font-medium truncate pr-4">{theme}</span>
                      <span className="text-slate-400 flex-shrink-0">{percent}% ({count})</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-slate-500 text-sm py-8 text-center">Nenhum dado coletado.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 shadow-md flex flex-col">
          <CardHeader>
            <CardTitle className="text-slate-100 text-base">Dúvidas para a Tarde</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center bg-slate-950/50 m-4 mt-0 rounded-xl border border-slate-800/50 overflow-hidden min-h-[200px]">
             <WordCloud words={doubts} />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800 shadow-md">
        <CardHeader>
          <CardTitle className="text-slate-100 text-base">Feedback Detalhado</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-950/80">
                <TableRow className="border-slate-800 hover:bg-slate-950">
                  <TableHead className="text-slate-400 min-w-[200px] pl-6">Participante</TableHead>
                  <TableHead className="text-slate-400 text-center">Clareza</TableHead>
                  <TableHead className="text-slate-400 text-center">Utilidade</TableHead>
                  <TableHead className="text-slate-400">Tema Preferido</TableHead>
                  <TableHead className="text-slate-400 pr-6">Dúvida / Comentário</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preAlmocoResp.length > 0 ? (
                  preAlmocoResp.map((r: any) => {
                    const user = users.find(u => u.id === r.userId);
                    return (
                      <TableRow key={r.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                        <TableCell className="pl-6">
                          <div className="font-medium text-slate-200">{user?.name || 'Desconhecido'}</div>
                          <div className="text-xs text-slate-500">{user?.email}</div>
                        </TableCell>
                        <TableCell className="text-center text-slate-300 font-semibold">{r.data.clarityScore}</TableCell>
                        <TableCell className="text-center text-slate-300 font-semibold">{r.data.usefulnessScore}</TableCell>
                        <TableCell className="text-slate-400 text-sm">
                          <span className="bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded text-xs border border-amber-500/20 whitespace-nowrap">
                            {r.data.relevantTheme}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-400 text-sm pr-6 max-w-[300px] truncate" title={r.data.afternoonDoubts}>
                          {r.data.afternoonDoubts || <span className="text-slate-600 italic">Sem dúvidas</span>}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-slate-500">
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