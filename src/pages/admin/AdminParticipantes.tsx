import React, { useState } from 'react';
import { useAppContext } from '../../store/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Search, CheckCircle2, XCircle, MoreHorizontal, Shield, ShieldOff, UserX, UserCheck } from 'lucide-react';

export const AdminParticipantes: React.FC = () => {
  const { users, responses, updateUser } = useAppContext();
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
          <div className="rounded-md overflow-hidden overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-950/80">
                <TableRow className="border-slate-800 hover:bg-slate-950">
                  <TableHead className="text-slate-400 py-4 pl-6 min-w-[250px]">Participante</TableHead>
                  <TableHead className="text-slate-400 text-center">Quiz</TableHead>
                  <TableHead className="text-slate-400 text-center">Pesq.</TableHead>
                  <TableHead className="text-slate-400 text-center">Manhã</TableHead>
                  <TableHead className="text-slate-400 text-center">NPS</TableHead>
                  <TableHead className="text-slate-400 text-center">Cadastro</TableHead>
                  <TableHead className="text-slate-400 text-right pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  [...filteredUsers].map((user) => (
                    <TableRow key={user.id} className={`border-slate-800 hover:bg-slate-800/50 transition-colors ${!user.isActive ? 'opacity-50 grayscale' : ''}`}>
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-medium text-slate-200 truncate max-w-[150px]">{user.name}</div>
                          {user.isAdmin && <Badge className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-[9px] px-1.5 py-0 h-4 border-blue-600/30">Admin</Badge>}
                          {!user.isActive && <Badge variant="destructive" className="text-[9px] px-1.5 py-0 h-4 bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30">Inativo</Badge>}
                        </div>
                        <div className="text-xs text-slate-500 truncate max-w-[200px]">{user.email}</div>
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
                      <TableCell className="text-center text-xs text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-300">
                            
                            <DropdownMenuItem 
                              onClick={() => updateUser(user.id, { isActive: !user.isActive })}
                              className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white"
                            >
                              {user.isActive ? (
                                <><UserX className="w-4 h-4 mr-2 text-red-400" /> <span className="text-red-400">Inativar Acesso</span></>
                              ) : (
                                <><UserCheck className="w-4 h-4 mr-2 text-emerald-400" /> <span className="text-emerald-400">Ativar Acesso</span></>
                              )}
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator className="bg-slate-800" />
                            
                            <DropdownMenuItem 
                              onClick={() => updateUser(user.id, { isAdmin: !user.isAdmin })}
                              className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white"
                            >
                              {user.isAdmin ? (
                                <><ShieldOff className="w-4 h-4 mr-2 text-amber-400" /> Remover Admin</>
                              ) : (
                                <><Shield className="w-4 h-4 mr-2 text-blue-400" /> Tornar Admin</>
                              )}
                            </DropdownMenuItem>

                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-slate-500">
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