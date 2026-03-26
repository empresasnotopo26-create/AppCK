import React from 'react';
import { useAppContext } from '../../store/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Target, TrendingDown, TrendingUp, Users } from 'lucide-react';

export const AdminQuiz: React.FC = () => {
  const { users, responses } = useAppContext();
  
  // Participantes elegíveis (ignorando admins)
  const participants = users.filter(u => !u.isAdmin && u.isActive !== false);
  const quizResponses = responses.filter(r => r.type === 'quiz');
  
  const correctAnswers: Record<string, string> = {
    q1: 'NotebookLM do Google',
    q2: 'Criar imagens a partir de descrições em texto',
    q3: 'Usar IA para responder clientes com contexto e agilidade',
    q4: 'Um tipo de comando ou instrução que você dá para a IA',
    q5: 'Cria novos conteúdos como textos, imagens e ideias',
    q6: 'Runway e veo3',
    q7: 'Lovable',
    q8: 'Base44',
    q9: 'Automação segue regras fixas, IA aprende e se adapta aos dados',
    q10: 'Quando a IA gera uma resposta falsa ou inventada com muita convicção'
  };

  const questionsInfo = [
    { key: 'q1', title: 'Analisar PDF de 200 páginas' },
    { key: 'q2', title: 'Uso de Midjourney/DALL·E' },
    { key: 'q3', title: 'Uso atual de IA nos negócios' },
    { key: 'q4', title: 'O que é um "prompt"?' },
    { key: 'q5', title: 'O que a IA generativa faz' },
    { key: 'q6', title: 'Gerar vídeos com IA' },
    { key: 'q7', title: 'Landing page via prompt' },
    { key: 'q8', title: 'Criar apps sem programar' },
    { key: 'q9', title: 'Diferença entre IA e Automação' },
    { key: 'q10', title: 'O que é "Alucinação" em IA' },
  ];

  // 1. Calcular Notas Individuais e Desempenho Geral
  let totalScore = 0;
  const userScores: Record<string, number> = {};

  quizResponses.forEach(r => {
    let correct = 0;
    Object.keys(correctAnswers).forEach(key => {
      if ((r.data as any)[key] === correctAnswers[key]) correct++;
    });
    const score = (correct / 10) * 100;
    userScores[r.userId] = score;
    totalScore += score;
  });

  const averageScore = quizResponses.length > 0 ? Math.round(totalScore / quizResponses.length) : 0;

  // 2. Gráfico de Status (Pizza)
  const finishedCount = quizResponses.length;
  // O sistema não salva estado "em andamento" no BD atual, então será 0.
  const inProgressCount = 0; 
  const notStartedCount = Math.max(0, participants.length - finishedCount);

  const pieData = [
    { name: 'Finalizaram', value: finishedCount, color: '#10b981' }, // emerald-500
    { name: 'Em Andamento', value: inProgressCount, color: '#f59e0b' }, // amber-500
    { name: 'Não Iniciaram', value: notStartedCount, color: '#64748b' }, // slate-500
  ];

  // 3. Rankings de Acertos e Erros
  const questionStats = questionsInfo.map(q => {
    let correct = 0;
    quizResponses.forEach(r => {
      if ((r.data as any)[q.key] === correctAnswers[q.key]) correct++;
    });
    const correctPercent = quizResponses.length > 0 ? Math.round((correct / quizResponses.length) * 100) : 0;
    return { 
      ...q, 
      correctPercent, 
      errorPercent: 100 - correctPercent 
    };
  });

  const mostCorrect = [...questionStats].sort((a, b) => b.correctPercent - a.correctPercent).slice(0, 5);
  const mostMissed = [...questionStats].sort((a, b) => b.errorPercent - a.errorPercent).slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Desempenho Geral */}
        <Card className="bg-slate-900 border-slate-800 shadow-md flex flex-col justify-center items-center text-center p-8 relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[150%] bg-blue-600/5 blur-[80px] pointer-events-none"></div>
          <Target className="w-12 h-12 text-blue-500 mb-4 opacity-80" />
          <h3 className="text-slate-400 font-medium tracking-widest uppercase text-sm mb-2">Desempenho Geral</h3>
          <div className="text-7xl font-black text-white tracking-tighter">
            {averageScore}<span className="text-4xl text-slate-500">%</span>
          </div>
          <p className="text-slate-500 mt-4 text-sm font-medium">Média de acertos da turma</p>
        </Card>

        {/* Gráfico de Status */}
        <Card className="bg-slate-900 border-slate-800 shadow-md flex flex-col">
          <CardHeader className="pb-0">
            <CardTitle className="text-slate-100 text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-400" />
              Status de Conclusão
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center pt-6">
            <div className="w-full h-[200px] flex items-center">
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    stroke="none"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '0.5rem' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-[50%] flex flex-col gap-4">
                {pieData.map(item => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <div>
                      <p className="text-slate-300 text-sm font-semibold leading-tight">{item.name}</p>
                      <p className="text-slate-500 text-xs font-medium">{item.value} participantes</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rankings Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Mais Acertos */}
        <Card className="bg-slate-900 border-slate-800 shadow-md">
          <CardHeader className="border-b border-slate-800/50 pb-4">
            <CardTitle className="text-slate-100 text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Perguntas com Mais Acertos
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {mostCorrect.map((q, idx) => (
                <div key={q.key} className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-slate-300 text-sm font-medium line-clamp-1 flex-1">{idx + 1}. {q.title}</span>
                    <span className="text-emerald-400 text-sm font-bold">{q.correctPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${q.correctPercent}%` }}></div>
                  </div>
                </div>
              ))}
              {mostCorrect.length === 0 && <p className="text-slate-500 text-sm text-center">Sem dados suficientes</p>}
            </div>
          </CardContent>
        </Card>

        {/* Mais Erros */}
        <Card className="bg-slate-900 border-slate-800 shadow-md">
          <CardHeader className="border-b border-slate-800/50 pb-4">
            <CardTitle className="text-slate-100 text-base flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              Perguntas com Mais Erros
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {mostMissed.map((q, idx) => (
                <div key={q.key} className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-slate-300 text-sm font-medium line-clamp-1 flex-1">{idx + 1}. {q.title}</span>
                    <span className="text-red-400 text-sm font-bold">{q.errorPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div className="bg-red-500 h-full rounded-full transition-all" style={{ width: `${q.errorPercent}%` }}></div>
                  </div>
                </div>
              ))}
              {mostMissed.length === 0 && <p className="text-slate-500 text-sm text-center">Sem dados suficientes</p>}
            </div>
          </CardContent>
        </Card>

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
                  <TableHead className="text-slate-400 text-center min-w-[100px] font-bold text-blue-400">Nota (%)</TableHead>
                  {questionsInfo.map((q, i) => (
                    <TableHead key={q.key} className="text-slate-400 min-w-[180px]">Q{i + 1}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizResponses.length > 0 ? (
                  quizResponses.map((r: any) => {
                    const user = users.find(u => u.id === r.userId);
                    const score = userScores[r.userId];
                    return (
                      <TableRow key={r.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                        <TableCell className="pl-6 sticky left-0 bg-slate-900/50 backdrop-blur-md z-10 border-r border-slate-800">
                          <div className="font-medium text-slate-200 truncate w-40">{user?.name || 'Desconhecido'}</div>
                          <div className="text-[10px] text-slate-500 truncate w-40">{user?.email}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                            score >= 70 ? 'bg-emerald-500/20 text-emerald-400' : 
                            score >= 50 ? 'bg-amber-500/20 text-amber-400' : 
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {score}%
                          </span>
                        </TableCell>
                        {questionsInfo.map((q) => {
                          const answer = r.data[q.key];
                          const isCorrect = answer === correctAnswers[q.key];
                          return (
                            <TableCell key={q.key} className="text-slate-400 text-xs">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                <span className="line-clamp-2" title={answer || '-'}>
                                  {answer || '-'}
                                </span>
                              </div>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={12} className="h-32 text-center text-slate-500">
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