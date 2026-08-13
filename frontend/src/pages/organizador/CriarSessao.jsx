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
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-lg">
        <h2 className="text-lg font-bold text-foreground">Nova sessão</h2>
        <p className="text-sm text-muted-foreground">{evento.titulo}</p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-foreground">
              Data
            </label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full rounded-xl border border-input bg-background p-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-ring/30"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-foreground">
              Horário
            </label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full rounded-xl border border-input bg-background p-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-ring/30"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-foreground">
              Local
            </label>
            <input
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              placeholder="Ex: Cine Belas Artes — Sala 1"
              className="w-full rounded-xl border border-input bg-background p-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-ring/30"
              required
            />
          </div>

          {erro && (
            <p className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
              {erro}
            </p>
          )}

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={onFechar}
              className="flex-1 rounded-full border border-border bg-card py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={salvando}
              className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 disabled:opacity-60"
            >
              {salvando ? "Criando..." : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}