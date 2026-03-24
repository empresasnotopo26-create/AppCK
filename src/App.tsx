import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./store/AppContext";

// Layouts
import { ParticipantLayout } from "./layouts/ParticipantLayout";
import { AdminLayout } from "./layouts/AdminLayout";

// Páginas Participante
import { Cadastro } from "./pages/participant/Cadastro";
import { HomeApp } from "./pages/participant/HomeApp";
import { Quiz } from "./pages/participant/Quiz";
import { Pesquisa } from "./pages/participant/Pesquisa";
import { PreAlmoco } from "./pages/participant/PreAlmoco";
import { NPS } from "./pages/participant/NPS";

// Páginas Admin
import { Dashboard } from "./pages/admin/Dashboard";
import { AdminPesquisa } from "./pages/admin/AdminPesquisa";
import { AdminNPS } from "./pages/admin/AdminNPS";
import { Sorteio } from "./pages/admin/Sorteio";

const PlaceholderAdminView = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
    <h2 className="text-xl mb-2">Módulo: {title}</h2>
    <p className="text-sm">Desenvolvimento futuro ou integração de dados.</p>
  </div>
);

const App = () => (
  <AppProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" theme="light" />
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Navigate to="/cadastro" replace />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Área do Participante (Logado) */}
          <Route path="/app" element={<ParticipantLayout />}>
            <Route index element={<HomeApp />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="pesquisa" element={<Pesquisa />} />
            <Route path="pre-almoco" element={<PreAlmoco />} />
            <Route path="nps" element={<NPS />} />
          </Route>

          {/* Área Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="quiz" element={<PlaceholderAdminView title="Respostas do Quiz" />} />
            <Route path="pesquisa" element={<AdminPesquisa />} />
            <Route path="pre-almoco" element={<PlaceholderAdminView title="Feedback Pré-almoço" />} />
            <Route path="nps" element={<AdminNPS />} />
            <Route path="sorteio" element={<Sorteio />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </AppProvider>
);

export default App;