import { useEffect, useState } from "react";
import api from "../../services/api";
import ModalCriarSessao from "./CriarSessao";

export default function Rascunhos() {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalEvento, setModalEvento] = useState(null);

  async function carregar() {
    try {
      const response = await api.get("/events/meus");
      setEventos(response.data.filter((e) => e.status === "RASCUNHO"));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function pendencia(evento) {
    if (!evento.sessions || evento.sessions.length === 0) {
      return "Nenhuma sessão criada ainda.";
    }
    return null;
  }

  if (carregando) return <p className="p-10 text-center text-gray-500">Carregando...</p>;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Painel</p>
      <h1 className="mt-1 text-3xl font-black text-gray-900">Rascunhos</h1>

      {eventos.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-white p-8 text-center text-sm text-gray-500">
          Nenhum rascunho no momento.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {eventos.map((evento) => (
            <div
              key={evento.id}
              className="flex flex-col gap-3 rounded-2xl bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <img src={evento.imagem} alt={evento.titulo} className="h-16 w-14 rounded-xl object-cover" />
                <div>
                  <h3 className="font-bold text-gray-900">{evento.titulo}</h3>
                  {evento.sessions?.[0] ? (
                    <p className="text-xs text-gray-500">
                      {formatarDataHora(evento.sessions[0].data)} · {evento.sessions[0].local}
                    </p>
                  ) : (
                    <p className="text-xs text-amber-600">{pendencia(evento)}</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setModalEvento(evento)}
                className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:border-gray-400"
              >
                {evento.sessions?.length > 0 ? "Nova sessão" : "Criar sessão"}
              </button>
            </div>
          ))}
        </div>
      )}

      {modalEvento && (
        <ModalCriarSessao
          evento={modalEvento}
          onFechar={() => setModalEvento(null)}
          onCriada={() => {
            setModalEvento(null);
            carregar();
          }}
        />
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