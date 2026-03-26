import React from 'react';
import { useAppContext } from '../../store/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const AdminQuiz: React.FC = () => {
  const { users, responses } = useAppContext();
  
  const quizResponses = responses.filter(r => r.type === 'quiz');
  const total = quizResponses.length || 1;

  const questionsInfo = [
    { key: 'q1', title: 'Analisar PDF de 200 páginas' },
    { key: 'q2', title: 'Uso de Midjourney/DALL·E' },
    { key: 'q3', title: 'Uso atual de IA nos negócios' },
    { key: 'q4', title: 'O que é um "prompt"?' },
    { key: 'q5', title: 'O que a IA generativa faz' },
    { key: 'q6', title: 'Gerar vídeos com IA' },
    { key: 'q7', title: 'Landing page via prompt' },
    { key: 'q8', title: 'Criar apps sem programar' },
  ];

  // Helper para agrupar respostas
  const getFrequencies = (questionKey: string) => {
    const counts = quizResponses.reduce((acc, curr: any) => {
      const val = curr.data[questionKey];
      if (val) {
        acc[val] = (acc[val] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Gráficos de Respostas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {questionsInfo.map((q, idx) => {
          const freqs = getFrequencies(q.key);
          return (
            <Card key={q.key} className="bg-slate-900 border-slate-800 shadow-md flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400 font-medium">Pergunta {idx + 1}</CardTitle>
                <h3 className="text-slate-100 font-semibold text-sm h-10 line-clamp-2">{q.title}</h3>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4 mt-2">
                  {freqs.length > 0 ? freqs.map(([answer, count], i) => {
                    const percent = Math.round((count / total) * 100);
                    return (
                      <div key={answer} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300 font-medium truncate pr-2" title={answer}>{answer}</span>
                          <span className="text-slate-400 flex-shrink-0">{percent}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-orange-500 h-full rounded-full" style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    );
                  }) : (
                    <p className="text-slate-500 text-xs py-4">Sem dados</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabela de Respostas */}
      <Card className="bg-slate-900 border-slate-800 shadow-md">
        <CardHeader>
          <CardTitle className="text-slate-100 text-base">Respostas Individuais</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-950/80">
                <TableRow className="border-slate-800 hover:bg-slate-950">
                  <TableHead className="text-slate-400 min-w-[200px] pl-6 sticky left-0 bg-slate-950/80 backdrop-blur-sm z-10">Participante</TableHead>
                  {questionsInfo.map((q, i) => (
                    <TableHead key={q.key} className="text-slate-400 min-w-[180px]">Q{i + 1}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizResponses.length > 0 ? (
                  quizResponses.map((r: any) => {
                    const user = users.find(u => u.id === r.userId);
                    return (
                      <TableRow key={r.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                        <TableCell className="pl-6 sticky left-0 bg-slate-900/50 backdrop-blur-md z-10 border-r border-slate-800">
                          <div className="font-medium text-slate-200 truncate w-40">{user?.name || 'Desconhecido'}</div>
                          <div className="text-[10px] text-slate-500 truncate w-40">{user?.email}</div>
                        </TableCell>
                        {questionsInfo.map((q) => (
                          <TableCell key={q.key} className="text-slate-400 text-xs">
                            <span className="line-clamp-2" title={r.data[q.key] || '-'}>
                              {r.data[q.key] || '-'}
                            </span>
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-32 text-center text-slate-500">
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