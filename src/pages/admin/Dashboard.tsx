import React from 'react';
import { useAppContext } from '../../store/AppContext';
import { Users, FileText, CheckCircle2, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const Dashboard: React.FC = () => {
  const { users, responses } = useAppContext();

  const totalUsers = users.length;
  
  const stats = {
    quiz: responses.filter(r => r.type === 'quiz').length,
    pesquisa: responses.filter(r => r.type === 'pesquisa').length,
    preAlmoco: responses.filter(r => r.type === 'pre-almoco').length,
    nps: responses.filter(r => r.type === 'nps').length,
  };

  const chartData = [
    { name: 'Quiz', total: stats.quiz, color: 'bg-blue-500' },
    { name: 'Pesquisa', total: stats.pesquisa, color: 'bg-purple-500' },
    { name: 'Pré-Almoço', total: stats.preAlmoco, color: 'bg-amber-500' },
    { name: 'NPS', total: stats.nps, color: 'bg-emerald-500' },
  ];

  const maxTotal = Math.max(...chartData.map(d => d.total), 1);
  const totalResponses = responses.length;
  const participationRate = totalUsers > 0 ? Math.round(((stats.quiz + stats.pesquisa + stats.preAlmoco + stats.nps) / (totalUsers * 4)) * 100) : 0;

  const recentUsers = [...users].reverse().slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Inscritos</CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalUsers}</div>
            <p className="text-xs text-slate-500 mt-1">Participantes cadastrados</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Respostas</CardTitle>
            <FileText className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalResponses}</div>
            <p className="text-xs text-slate-500 mt-1">Interações coletadas</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Taxa de Conclusão</CardTitle>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{participationRate}%</div>
            <p className="text-xs text-slate-500 mt-1">Engajamento global</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Pesquisas Prontas</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.pesquisa}</div>
            <p className="text-xs text-slate-500 mt-1">Da pesquisa principal</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Barras Tailwind */}
        <Card className="bg-slate-900 border-slate-800 lg:col-span-2 shadow-md flex flex-col">
          <CardHeader>
            <CardTitle className="text-slate-100 text-base">Funil de Engajamento por Etapa</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end">
            <div className="h-[250px] w-full flex items-end justify-around gap-4 pt-8 border-b border-slate-800/50 pb-2">
              {chartData.map((data, idx) => {
                const heightPercentage = (data.total / maxTotal) * 100;
                return (
                  <div key={idx} className="flex flex-col items-center w-full max-w-[80px] gap-2 h-full justify-end group">
                    <div className="text-slate-300 font-bold opacity-70 group-hover:opacity-100 transition-opacity text-sm">{data.total}</div>
                    <div 
                      className={`w-full ${data.color} opacity-80 group-hover:opacity-100 rounded-t-md transition-all duration-500 ease-out`} 
                      style={{ height: `${heightPercentage}%`, minHeight: '4px' }}
                    ></div>
                    <div className="text-xs text-slate-400 mt-2 text-center font-medium">{data.name}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Últimos Inscritos */}
        <Card className="bg-slate-900 border-slate-800 shadow-md flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-slate-100 text-base">Últimos Participantes</CardTitle>
            <Clock className="w-4 h-4 text-slate-500" />
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {recentUsers.length > 0 ? (
                recentUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/50">
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">
                  Nenhum participante ainda.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};