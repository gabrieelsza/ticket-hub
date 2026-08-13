import { useState } from "react";
import { CheckCircle2, XCircle, ScanLine } from "lucide-react";
import api from "../../services/api";

export default function ValidarIngresso() {
  const [codigo, setCodigo] = useState("");
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!codigo.trim()) return;

    setCarregando(true);
    setResultado(null);

    try {
      const response = await api.post("/checkin", { qrCode: codigo.trim() });
      setResultado({
        sucesso: true,
        mensagem: "Acesso liberado",
        ticket: response.data.ticket,
      });
    } catch (error) {
      setResultado({
        sucesso: false,
        mensagem: error.response?.data?.message || "Acesso negado",
      });
    } finally {
      setCodigo("");
      setCarregando(false);
    }
  }

  const resultadoClasses = resultado?.sucesso
    ? {
        box: "border-green-500/20 bg-green-500/10",
        icon: "text-green-600 dark:text-green-400",
        text: "text-green-700 dark:text-green-300",
      }
    : {
        box: "border-destructive/20 bg-destructive/10",
        icon: "text-destructive",
        text: "text-destructive",
      };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-6 py-10">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card shadow-sm">
        <ScanLine className="h-8 w-8 text-primary" />
      </div>

      <h1 className="mt-3 text-2xl font-black text-foreground">
        Validar ingresso
      </h1>

      <p className="mt-1 text-center text-sm text-muted-foreground">
        Digite ou escaneie o código do ingresso para liberar o acesso.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 w-full">
        <input
          autoFocus
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Código do ingresso"
          className="w-full rounded-2xl border border-input bg-background p-4 text-center text-lg text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-ring/30"
        />

        <button
          type="submit"
          disabled={carregando}
          className="mt-3 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 disabled:opacity-60"
        >
          {carregando ? "Verificando..." : "Validar"}
        </button>
      </form>

      {resultado && (
        <div
          role="alert"
          className={`mt-8 flex w-full flex-col items-center gap-2 rounded-3xl border p-6 text-center ${resultadoClasses.box}`}
        >
          {resultado.sucesso ? (
            <CheckCircle2 className={`h-12 w-12 ${resultadoClasses.icon}`} />
          ) : (
            <XCircle className={`h-12 w-12 ${resultadoClasses.icon}`} />
          )}

          <p className={`text-lg font-black ${resultadoClasses.text}`}>
            {resultado.mensagem}
          </p>

          {resultado.sucesso && resultado.ticket && (
            <p className="text-sm text-muted-foreground">
              Assento {resultado.ticket.assento}
            </p>
          )}
        </div>
      )}
    </div>
  );
}