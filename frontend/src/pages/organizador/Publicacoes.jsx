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

  if (carregando) {
    return (
      <p className="p-10 text-center text-sm text-muted-foreground">
        Carregando...
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Painel
      </p>
      <h1 className="mt-1 text-3xl font-black text-foreground">Publicações</h1>

      {eventos.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Nenhum evento publicado ainda.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {eventos.map((evento) => (
            <Link
              key={evento.id}
              to="/organizador/meus-eventos"
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="overflow-hidden">
                <img
                  src={evento.imagem}
                  alt={evento.titulo}
                  className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>

              <div className="p-4">
                <h3 className="font-bold text-foreground">{evento.titulo}</h3>

                {evento.sessions?.[0] && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatarDataHora(evento.sessions[0].data)}
                  </p>
                )}

                <p className="mt-1 text-xs text-muted-foreground">
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