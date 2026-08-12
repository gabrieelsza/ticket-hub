import { useState } from "react";
import api from "../../services/api";

export default function ModalCriarSessao({ evento, onFechar, onCriada }) {
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [local, setLocal] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSalvando(true);
    setErro("");

    try {
      await api.post(`/sessions/evento/${evento.id}`, { data, hora, local });
      onCriada();
    } catch (error) {
      setErro(error.response?.data?.message || "Erro ao criar sessão");
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6">
        <h2 className="text-lg font-bold text-gray-900">Nova sessão</h2>
        <p className="text-sm text-gray-500">{evento.titulo}</p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">Data</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-sm outline-none focus:border-green-700"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">Horário</label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-sm outline-none focus:border-green-700"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">Local</label>
            <input
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              placeholder="Ex: Cine Belas Artes — Sala 1"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-sm outline-none focus:border-green-700"
              required
            />
          </div>

          {erro && <p className="text-xs text-red-600">{erro}</p>}

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={onFechar}
              className="flex-1 rounded-full border border-gray-300 py-2.5 text-sm font-semibold text-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 rounded-full bg-green-900 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {salvando ? "Criando..." : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}