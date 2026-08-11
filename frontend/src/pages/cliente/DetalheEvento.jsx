import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Clock, Calendar, MapPin, Users } from "lucide-react";
import api from "../../services/api";

export default function DetalheEvento() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [evento, setEvento] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarEvento() {
      try {
        const response = await api.get(`/events/${id}`);
        setEvento(response.data);
      } catch (error) {
        setErro(error, "Evento não encontrado");
      } finally {
        setCarregando(false);
      }
    }

    carregarEvento();
  }, [id]);

  if (carregando) {
    return <p className="p-10 text-center text-gray-500">Carregando...</p>;
  }

  if (erro || !evento) {
    return <p className="p-10 text-center text-red-600">{erro || "Evento não encontrado"}</p>;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-8 md:grid-cols-[320px_1fr]">
        <img
          src={evento.imagem}
          alt={evento.titulo}
          className="aspect-2/3 w-full rounded-3xl object-cover"
        />

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            {evento.tipo === "FILME" ? "Filme" : "Show"}
          </p>

          <h1 className="mt-1 text-4xl font-black text-gray-900">{evento.titulo}</h1>

          <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
            {evento.nota && (
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-green-800 text-green-800" />
                {evento.nota}
              </span>
            )}
            {evento.duracao && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {evento.duracao}
              </span>
            )}
          </div>

          <p className="mt-4 max-w-2xl text-gray-700">{evento.descricao}</p>

          <button
            onClick={() => document.getElementById("sessoes")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-6 rounded-full bg-green-900 px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Comprar ingresso
          </button>
        </div>
      </div>

      <section id="sessoes" className="mt-14">
        <h2 className="text-2xl font-black text-gray-900">Sessões disponíveis</h2>
        <p className="text-sm text-gray-500">Escolha data, horário e local para seguir para a seleção de assentos.</p>

        <div className="mt-5 flex flex-col gap-3">
          {evento.sessions && evento.sessions.length > 0 ? (
            evento.sessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col gap-3 rounded-2xl bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                  <span className="flex items-center gap-1 font-semibold text-gray-900">
                    <Calendar className="h-4 w-4" />
                    {formatarDataHora(session.data)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {session.local}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {contarAssentosDisponiveis(session.seatMap)} lugares
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/sessoes/${session.id}/assentos`)}
                  className="rounded-full bg-green-900 px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                  Escolher assentos
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Nenhuma sessão disponível no momento.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function formatarDataHora(dataIso) {
  const data = new Date(dataIso);
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) +
    " · " +
    data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function contarAssentosDisponiveis(seatMap) {
  if (!seatMap?.layout?.assentos) return 0;
  return seatMap.layout.assentos.filter((a) => a.status === "DISPONIVEL").length;
}