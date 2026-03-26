import React from 'react';
import { useAppContext } from '../../store/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WordCloud } from '../../components/WordCloud';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { Target, HelpCircle, Sun } from 'lucide-react';

export const AdminPesquisa: React.FC = () => {
  const { users, responses } = useAppContext();
  
  const pesquisas = responses.filter(r => r.type === 'pesquisa');
  
  // Ordem lógica das opções de faturamento
  const revenueOptionsOrder = [
    'Até R$ 50 mil',
    'R$ 50 mil a R$ 100 mil',
    'R$ 100 mil a R$ 360 mil',
    'R$ 360 mil a R$ 1 milhão',
    'R$ 1 milhão a R$ 5 milhões',
    'R$ 5 milhões a R$ 10 milhões',
    'Acima de R$ 10 milhões'
  ];

  // Agrupar faturamento
  const revenueCount = pesquisas.reduce((acc, curr: any) => {
    const val = curr.data.revenue;
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Montar dados para o gráfico respeitando a ordem e filtrando zerados (opcional)
  const orderedRevenueData = revenueOptionsOrder
    .map(name => ({
      name,
      value: revenueCount[name] || 0
    }))
    .filter(item => item.value > 0); // Mostra apenas as faixas que tiveram respostas

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444'];

  // Coletar textos para nuvem de palavras
  const desafiosWords = pesquisas.map((p: any) => p.data.biggestChallenge).filter(Boolean);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Primeira Linha: Gráfico e Nuvem de Palavras */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico de Faturamento */}
        <Card className="bg-slate-900 border-slate-800 flex flex-col shadow-md">
          <CardHeader>
            <CardTitle className="text-slate-100 text-base">Faturamento das Empresas</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px] pt-0">
            {orderedRevenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={orderedRevenueData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={160} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip 
                    cursor={{ fill: '#1e293b' }}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '0.5rem' }}
                    itemStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                    {orderedRevenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500">
                Sem dados suficientes para o gráfico.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Nuvem de Palavras */}
        <Card className="bg-slate-900 border-slate-800 flex flex-col shadow-md">
          <CardHeader>
            <CardTitle className="text-slate-100 text-base">Nuvem de Palavras: Maiores Desafios</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center bg-slate-950/50 m-4 mt-0 rounded-xl border border-slate-800/50 overflow-hidden min-h-[250px]">
             <WordCloud words={desafiosWords} />
          </CardContent>
        </Card>
      </div>

      {/* Tabela 1: Maiores Desafios */}
      <Card className="bg-slate-900 border-slate-800 shadow-md">
        <CardHeader className="border-b border-slate-800/50 pb-4">
          <CardTitle className="text-slate-100 text-base flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-500" />
            Detalhes: Maiores Desafios
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-950/80">
                <TableRow className="border-slate-800 hover:bg-slate-950">
                  <TableHead className="text-slate-400 min-w-[200px] pl-6">Participante</TableHead>
                  <TableHead className="text-slate-400 min-w-[160px]">Faturamento</TableHead>
                  <TableHead className="text-slate-400 min-w-[400px]">Maior Desafio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pesquisas.length > 0 ? (
                  pesquisas.map((p: any) => {
                    const user = users.find(u => u.id === p.userId);
                    return (
                      <TableRow key={`desafio-${p.id}`} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                        <TableCell className="font-medium text-slate-300 align-top pt-4 pl-6">
                          <div>{user?.name || 'Desconhecido'}</div>
                          <div className="text-xs text-slate-500">{user?.email}</div>
                        </TableCell>
                        <TableCell className="text-slate-300 align-top pt-4">
                           <span className="bg-blue-900/20 text-blue-400 px-2.5 py-1 rounded text-xs font-medium border border-blue-800/30 whitespace-nowrap">
                             {p.data.revenue}
                           </span>
                        </TableCell>
                        <TableCell className="text-slate-300 text-sm align-top pt-4 whitespace-pre-wrap leading-relaxed">
                          {p.data.biggestChallenge}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-slate-500">
                      Nenhuma resposta encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Tabela 2: Dúvidas sobre IA */}
      <Card className="bg-slate-900 border-slate-800 shadow-md">
        <CardHeader className="border-b border-slate-800/50 pb-4">
          <CardTitle className="text-slate-100 text-base flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-500" />
            Detalhes: Dúvidas sobre IA
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-950/80">
                <TableRow className="border-slate-800 hover:bg-slate-950">
                  <TableHead className="text-slate-400 min-w-[200px] pl-6">Participante</TableHead>
                  <TableHead className="text-slate-400 min-w-[160px]">Faturamento</TableHead>
                  <TableHead className="text-slate-400 min-w-[400px]">Dúvidas sobre IA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pesquisas.length > 0 ? (
                  pesquisas.map((p: any) => {
                    const user = users.find(u => u.id === p.userId);
                    return (
                      <TableRow key={`duvida-${p.id}`} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                        <TableCell className="font-medium text-slate-300 align-top pt-4 pl-6">
                          <div>{user?.name || 'Desconhecido'}</div>
                          <div className="text-xs text-slate-500">{user?.email}</div>
                        </TableCell>
                        <TableCell className="text-slate-300 align-top pt-4">
                           <span className="bg-purple-900/20 text-purple-400 px-2.5 py-1 rounded text-xs font-medium border border-purple-800/30 whitespace-nowrap">
                             {p.data.revenue}
                           </span>
                        </TableCell>
                        <TableCell className="text-slate-300 text-sm align-top pt-4 whitespace-pre-wrap leading-relaxed">
                          {p.data.aiDoubts}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-slate-500">
                      Nenhuma resposta encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Tabela 3: Avaliação Manhã & Expectativas */}
      <Card className="bg-slate-900 border-slate-800 shadow-md">
        <CardHeader className="border-b border-slate-800/50 pb-4">
          <CardTitle className="text-slate-100 text-base flex items-center gap-2">
            <Sun className="w-5 h-5 text-yellow-500" />
            Detalhes: Avaliação da Manhã e Expectativas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-950/80">
                <TableRow className="border-slate-800 hover:bg-slate-950">
                  <TableHead className="text-slate-400 min-w-[200px] pl-6">Participante</TableHead>
                  <TableHead className="text-slate-400 text-center min-w-[120px]">Nota Manhã</TableHead>
                  <TableHead className="text-slate-400 min-w-[400px]">Expectativa para a Tarde</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pesquisas.length > 0 ? (
                  pesquisas.map((p: any) => {
                    const user = users.find(u => u.id === p.userId);
                    return (
                      <TableRow key={`expectativa-${p.id}`} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                        <TableCell className="font-medium text-slate-300 align-top pt-4 pl-6">
                          <div>{user?.name || 'Desconhecido'}</div>
                          <div className="text-xs text-slate-500">{user?.email}</div>
                        </TableCell>
                        <TableCell className="text-center align-top pt-4">
                          {p.data.morningRating !== undefined ? (
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm border ${
                              p.data.morningRating >= 3 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                              p.data.morningRating === 2 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                              'bg-red-500/20 text-red-400 border-red-500/30'
                            }`}>
                              {p.data.morningRating}
                            </span>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-300 text-sm align-top pt-4 whitespace-pre-wrap leading-relaxed">
                          {p.data.afternoonExpectation || <span className="text-slate-600 italic">Sem resposta</span>}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-slate-500">
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