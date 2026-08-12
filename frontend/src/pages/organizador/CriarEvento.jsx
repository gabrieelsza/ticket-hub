import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import api from "../../services/api";

export default function CriarEvento() {
  const [fonte, setFonte] = useState("tmdb");
  const [termo, setTermo] = useState("");
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [importandoId, setImportandoId] = useState(null);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function buscar(e) {
    e.preventDefault();
    if (!termo.trim()) return;

    setBuscando(true);
    setErro("");

    try {
      const response = await api.get("/events/search", { params: { fonte, query: termo } });
      setResultados(response.data);
    } catch (error) {
      setErro(error.response?.data?.message || "Erro ao buscar");
    } finally {
      setBuscando(false);
    }
  }

  async function importar(item) {
    setImportandoId(item.externalId);
    setErro("");

    try {
      const response = await api.post("/events", item);
      // Vai direto para "Meus Eventos" já com o rascunho criado, pronto pra criar sessão
      navigate("/organizador/meus-eventos", { state: { eventoImportado: response.data.id } });
    } catch (error) {
      setErro(error.response?.data?.message || "Erro ao importar evento");
      setImportandoId(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
        Novo evento
      </p>
      <h1 className="mt-1 text-3xl font-black text-gray-900">Buscar filme ou show</h1>
      <p className="mt-1 text-sm text-gray-600">
        Os resultados vêm direto do TMDb ou da Ticketmaster. Escolha um item para importar.
      </p>

      {/* Seletor de fonte */}
      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setFonte("tmdb")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
            fonte === "tmdb" ? "bg-green-900 text-white" : "border border-gray-300 bg-white text-gray-600"
          }`}
        >
          Filmes (TMDb)
        </button>
        <button
          onClick={() => setFonte("ticketmaster")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
            fonte === "ticketmaster" ? "bg-green-900 text-white" : "border border-gray-300 bg-white text-gray-600"
          }`}
        >
          Eventos (Ticketmaster)
        </button>
      </div>

      {/* Busca */}
      <form onSubmit={buscar} className="mt-4 flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder={fonte === "tmdb" ? "Ex: Duna, Harry Potter..." : "Ex: nome do show ou artista"}
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={buscando}
          className="rounded-full bg-green-900 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {buscando ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {erro && <p className="mt-4 text-sm text-red-600">{erro}</p>}

      {/* Resultados */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {resultados.map((item) => (
          <div key={item.externalId} className="flex flex-col overflow-hidden rounded-2xl bg-white">
            {item.imagem && (
              <img src={item.imagem} alt={item.titulo} className="aspect-2/3 w-full object-cover" />
            )}
            <div className="flex flex-1 flex-col justify-between gap-3 p-3">
              <p className="text-sm font-bold leading-tight text-gray-900">{item.titulo}</p>
              <button
                onClick={() => importar(item)}
                disabled={importandoId === item.externalId}
                className="rounded-full bg-green-900 py-2 text-xs font-semibold text-white disabled:opacity-60"
              >
                {importandoId === item.externalId ? "Importando..." : "Importar"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {resultados.length === 0 && !buscando && (
        <p className="mt-10 text-center text-sm text-gray-400">
          Busque um título para ver os resultados.
        </p>
      )}
    </div>
  );
}