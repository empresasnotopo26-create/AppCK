import React, { useState } from 'react';
import { useAppContext } from '../../store/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, CheckCircle2, XCircle } from 'lucide-react';

export const AdminParticipantes: React.FC = () => {
  const { users, responses } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const hasCompleted = (userId: string, type: string) => {
    return responses.some(r => r.userId === userId && r.type === type);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatusBadge = ({ completed }: { completed: boolean }) => {
    if (completed) {
      return <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />;
    }
    return <XCircle className="w-5 h-5 text-slate-700 mx-auto" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Lista de Participantes</h2>
          <p className="text-sm text-slate-500">Gerencie e visualize o status de cada inscrito.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="Buscar por nome ou e-mail..." 
            className="pl-9 bg-slate-900 border-slate-800 text-slate-200 focus-visible:ring-blue-600 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-800 shadow-md">
        <CardContent className="p-0">
          <div className="rounded-md overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-950/80">
                <TableRow className="border-slate-800 hover:bg-slate-950">
                  <TableHead className="text-slate-400 py-4 pl-6">Participante</TableHead>
                  <TableHead className="text-slate-400 text-center">Quiz</TableHead>
                  <TableHead className="text-slate-400 text-center">Pesquisa</TableHead>
                  <TableHead className="text-slate-400 text-center">Pré-almoço</TableHead>
                  <TableHead className="text-slate-400 text-center">NPS</TableHead>
                  <TableHead className="text-slate-400 text-right pr-6">Data Cadastro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  [...filteredUsers].reverse().map((user) => (
                    <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                      <TableCell className="pl-6">
                        <div className="font-medium text-slate-200">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <StatusBadge completed={hasCompleted(user.id, 'quiz')} />
                      </TableCell>
                      <TableCell className="text-center">
                        <StatusBadge completed={hasCompleted(user.id, 'pesquisa')} />
                      </TableCell>
                      <TableCell className="text-center">
                        <StatusBadge completed={hasCompleted(user.id, 'pre-almoco')} />
                      </TableCell>
                      <TableCell className="text-center">
                        <StatusBadge completed={hasCompleted(user.id, 'nps')} />
                      </TableCell>
                      <TableCell className="text-right text-xs text-slate-500 pr-6">
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                      Nenhum participante encontrado.
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