import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function Publicacoes() {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const response = await api.get("/events/meus");
        setEventos(response.data.filter((e) => e.status === "PUBLICADO"));
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  function totalVendidos(evento) {
    return (evento.sessions || []).reduce((soma, s) => {
      const assentos = s.seatMap?.layout?.assentos || [];
      return soma + assentos.filter((a) => a.status === "OCUPADO").length;
    }, 0);
  }

  if (carregando) return <p className="p-10 text-center text-gray-500">Carregando...</p>;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Painel</p>
      <h1 className="mt-1 text-3xl font-black text-gray-900">Publicações</h1>

      {eventos.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-white p-8 text-center text-sm text-gray-500">
          Nenhum evento publicado ainda.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {eventos.map((evento) => (
            <Link
              key={evento.id}
              to="/organizador/meus-eventos"
              className="overflow-hidden rounded-2xl bg-white hover:shadow-sm"
            >
              <img src={evento.imagem} alt={evento.titulo} className="h-40 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{evento.titulo}</h3>
                {evento.sessions?.[0] && (
                  <p className="mt-1 text-xs text-gray-500">
                    {formatarDataHora(evento.sessions[0].data)}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {totalVendidos(evento)} ingressos vendidos
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function formatarDataHora(dataIso) {
  const data = new Date(dataIso);
  return (
    data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) +
    " · " +
    data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
}