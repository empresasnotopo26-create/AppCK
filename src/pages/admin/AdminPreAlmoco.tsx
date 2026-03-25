import React from 'react';
import { useAppContext } from '../../store/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database, GitMerge, TrendingUp, Star } from 'lucide-react';

export const AdminPreAlmoco: React.FC = () => {
  const { users, responses } = useAppContext();
  
  const preAlmocoResp = responses.filter(r => r.type === 'pre-almoco');
  const hasData = preAlmocoResp.length > 0;
  const total = hasData ? preAlmocoResp.length : 1;

  // Calculando médias. Usando hasData para não exibir 0 se ninguém respondeu nada
  const avgDataClarity = hasData ? (preAlmocoResp.reduce((acc, curr: any) => acc + curr.data.dataClarity, 0) / total).toFixed(1) : '-';
  const avgProcessExecution = hasData ? (preAlmocoResp.reduce((acc, curr: any) => acc + curr.data.processExecution, 0) / total).toFixed(1) : '-';
  const avgSalesPredictability = hasData ? (preAlmocoResp.reduce((acc, curr: any) => acc + curr.data.salesPredictability, 0) / total).toFixed(1) : '-';
  const avgCustomerEvaluation = hasData ? (preAlmocoResp.reduce((acc, curr: any) => acc + curr.data.customerEvaluation, 0) / total).toFixed(1) : '-';

  const ScoreBadge = ({ score }: { score: number }) => {
    let colorClass = 'bg-slate-800 text-slate-400';
    if (score >= 4) colorClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    else if (score === 3) colorClass = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    else if (score >= 0) colorClass = 'bg-red-500/20 text-red-400 border-red-500/30';

    return (
      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm border ${colorClass}`}>
        {score}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Cards de Média */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800 shadow-md">
          <CardContent className="p-6 flex flex-col justify-center items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Database className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Dados</p>
              <h3 className="text-4xl font-bold text-white mt-1">{avgDataClarity}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800 shadow-md">
          <CardContent className="p-6 flex flex-col justify-center items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <GitMerge className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Processos</p>
              <h3 className="text-4xl font-bold text-white mt-1">{avgProcessExecution}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 shadow-md">
          <CardContent className="p-6 flex flex-col justify-center items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Vendas</p>
              <h3 className="text-4xl font-bold text-white mt-1">{avgSalesPredictability}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 shadow-md">
          <CardContent className="p-6 flex flex-col justify-center items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Star className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Clientes</p>
              <h3 className="text-4xl font-bold text-white mt-1">{avgCustomerEvaluation}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800 shadow-md">
        <CardHeader>
          <CardTitle className="text-slate-100 text-base">Avaliações Individuais</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-950/80">
                <TableRow className="border-slate-800 hover:bg-slate-950">
                  <TableHead className="text-slate-400 min-w-[200px] pl-6">Participante</TableHead>
                  <TableHead className="text-slate-400 text-center">Clareza de Dados</TableHead>
                  <TableHead className="text-slate-400 text-center">Processos</TableHead>
                  <TableHead className="text-slate-400 text-center">Vendas</TableHead>
                  <TableHead className="text-slate-400 text-center pr-6">Aval. Cliente</TableHead>
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
                        <TableCell className="text-center">
                          <ScoreBadge score={r.data.dataClarity} />
                        </TableCell>
                        <TableCell className="text-center">
                          <ScoreBadge score={r.data.processExecution} />
                        </TableCell>
                        <TableCell className="text-center">
                          <ScoreBadge score={r.data.salesPredictability} />
                        </TableCell>
                        <TableCell className="text-center pr-6">
                          <ScoreBadge score={r.data.customerEvaluation} />
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