import { useEffect, useState } from "react";
import api from "../../services/api";
import ModalCriarSessao from "../organizador/CriarSessao";

export default function MeusEventos() {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [publicandoId, setPublicandoId] = useState(null);
  const [modalEvento, setModalEvento] = useState(null); // evento selecionado pra criar sessão

  async function carregar() {
    try {
      const response = await api.get("/events/meus");
      setEventos(response.data);
    } catch (error) {
      setErro("Erro ao carregar seus eventos");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function publicar(id) {
    setPublicandoId(id);
    try {
      await api.patch(`/events/${id}/publish`);
      await carregar();
    } catch (error) {
      setErro(error.response?.data?.message || "Erro ao publicar");
    } finally {
      setPublicandoId(null);
    }
  }

  if (carregando) return <p className="p-10 text-center text-gray-500">Carregando...</p>;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Gerenciar</p>
      <h1 className="mt-1 text-3xl font-black text-gray-900">Meus eventos</h1>

      {erro && <p className="mt-4 text-sm text-red-600">{erro}</p>}

      <div className="mt-6 flex flex-col gap-4">
        {eventos.length === 0 && (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500">
            Você ainda não importou nenhum evento.
          </p>
        )}

        {eventos.map((evento) => (
          <div key={evento.id} className="flex flex-col gap-4 rounded-3xl bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img src={evento.imagem} alt={evento.titulo} className="h-20 w-16 rounded-xl object-cover" />
              <div>
                <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
                  evento.status === "PUBLICADO" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {evento.status === "PUBLICADO" ? "Publicado" : "Rascunho"}
                </span>
                <h3 className="mt-1 font-bold text-gray-900">{evento.titulo}</h3>
                <p className="text-xs text-gray-500">{evento.sessions?.length || 0} sessão(ões) criada(s)</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setModalEvento(evento)}
                className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:border-gray-400"
              >
                Criar sessão
              </button>

              {evento.status !== "PUBLICADO" && (
                <button
                  onClick={() => publicar(evento.id)}
                  disabled={publicandoId === evento.id}
                  className="rounded-full bg-green-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                >
                  {publicandoId === evento.id ? "Publicando..." : "Publicar"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

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