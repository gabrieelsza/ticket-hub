import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, CalendarCheck, FileEdit } from "lucide-react";
import api from "../../services/api";

export default function Dashboard() {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const response = await api.get("/events/meus");
        setEventos(response.data);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  const publicados = eventos.filter((e) => e.status === "PUBLICADO");
  const rascunhos = eventos.filter((e) => e.status === "RASCUNHO");
  const totalSessoes = eventos.reduce((soma, e) => soma + (e.sessions?.length || 0), 0);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Painel do organizador
          </p>
          <h1 className="mt-1 text-3xl font-black text-foreground">Seus eventos</h1>
        </div>

        <Link
          to="/organizador/criar-e  vento"
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" />
          Novo evento
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Eventos publicados</p>
          <p className="mt-1 text-2xl font-black text-foreground">
            {carregando ? "—" : publicados.length}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Rascunhos</p>
          <p className="mt-1 text-2xl font-black text-foreground">
            {carregando ? "—" : rascunhos.length}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Sessões criadas</p>
          <p className="mt-1 text-2xl font-black text-foreground">
            {carregando ? "—" : totalSessoes}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/organizador/meus-eventos"
          className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-muted"
        >
          <FileEdit className="h-6 w-6 text-primary" />
          <div>
            <p className="font-bold text-foreground">Gerenciar eventos</p>
            <p className="text-sm text-muted-foreground">
              Publicar, editar e criar sessões
            </p>
          </div>
        </Link>

        <Link
          to="/organizador/criar-evento"
          className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-muted"
        >
          <CalendarCheck className="h-6 w-6 text-primary" />
          <div>
            <p className="font-bold text-foreground">Importar novo evento</p>
            <p className="text-sm text-muted-foreground">
              Buscar no TMDb ou Ticketmaster
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}