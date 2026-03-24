import React from 'react';
import { useAppContext } from '../../store/AppContext';
import { Users, FileText, CheckCircle2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    { name: 'Quiz', total: stats.quiz },
    { name: 'Pesquisa', total: stats.pesquisa },
    { name: 'Pré-Almoço', total: stats.preAlmoco },
    { name: 'NPS', total: stats.nps },
  ];

  const maxTotal = Math.max(...chartData.map(d => d.total), 1);
  const totalResponses = responses.length;
  const participationRate = totalUsers > 0 ? Math.round(((stats.pesquisa + stats.nps) / (totalUsers * 2)) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Participantes</CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalUsers}</div>
            <p className="text-xs text-slate-500 mt-1">Cadastrados no sistema</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Respostas</CardTitle>
            <FileText className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalResponses}</div>
            <p className="text-xs text-slate-500 mt-1">Interações coletadas</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Engajamento Médio</CardTitle>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{participationRate}%</div>
            <p className="text-xs text-slate-500 mt-1">Taxa estimada</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Pesquisas Concluídas</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.pesquisa}</div>
            <p className="text-xs text-slate-500 mt-1">Da pesquisa principal</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico customizado usando Tailwind */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-100">Respostas por Etapa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full flex items-end justify-around gap-4 pt-8 border-b border-slate-800/50 pb-2">
            {chartData.map((data, idx) => {
              const heightPercentage = (data.total / maxTotal) * 100;
              return (
                <div key={idx} className="flex flex-col items-center w-full max-w-[80px] gap-2 h-full justify-end group">
                  <div className="text-slate-300 font-bold opacity-50 group-hover:opacity-100 transition-opacity">{data.total}</div>
                  <div 
                    className="w-full bg-blue-500 hover:bg-blue-400 rounded-t-md transition-all duration-500 ease-out shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]" 
                    style={{ height: `${heightPercentage}%`, minHeight: '4px' }}
                  ></div>
                  <div className="text-xs text-slate-400 mt-2 text-center">{data.name}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};