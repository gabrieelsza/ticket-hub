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
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Painel do organizador
          </p>
          <h1 className="mt-1 text-3xl font-black text-gray-900">Seus eventos</h1>
        </div>

        <Link
          to="/organizador/criar-evento"
          className="flex items-center gap-2 rounded-full bg-green-900 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" />
          Novo evento
        </Link>
      </div>

      {/* Cards de resumo */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5">
          <p className="text-sm text-gray-500">Eventos publicados</p>
          <p className="mt-1 text-2xl font-black text-gray-900">{carregando ? "—" : publicados.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-5">
          <p className="text-sm text-gray-500">Rascunhos</p>
          <p className="mt-1 text-2xl font-black text-gray-900">{carregando ? "—" : rascunhos.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-5">
          <p className="text-sm text-gray-500">Sessões criadas</p>
          <p className="mt-1 text-2xl font-black text-gray-900">{carregando ? "—" : totalSessoes}</p>
        </div>
      </div>

      {/* Atalho */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/organizador/meus-eventos"
          className="flex flex-1 items-center gap-3 rounded-2xl bg-white p-5 hover:bg-gray-50"
        >
          <FileEdit className="h-6 w-6 text-green-900" />
          <div>
            <p className="font-bold text-gray-900">Gerenciar eventos</p>
            <p className="text-sm text-gray-500">Publicar, editar e criar sessões</p>
          </div>
        </Link>

        <Link
          to="/organizador/criar-evento"
          className="flex flex-1 items-center gap-3 rounded-2xl bg-white p-5 hover:bg-gray-50"
        >
          <CalendarCheck className="h-6 w-6 text-green-900" />
          <div>
            <p className="font-bold text-gray-900">Importar novo evento</p>
            <p className="text-sm text-gray-500">Buscar no TMDb ou Ticketmaster</p>
          </div>
        </Link>
      </div>
    </div>
  );
}