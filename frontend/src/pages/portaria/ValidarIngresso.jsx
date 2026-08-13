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
      setResultado({ sucesso: true, mensagem: "Acesso liberado", ticket: response.data.ticket });
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

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-6 py-10">
      <ScanLine className="h-10 w-10 text-green-900" />
      <h1 className="mt-3 text-2xl font-black text-gray-900">Validar ingresso</h1>
      <p className="mt-1 text-center text-sm text-gray-500">
        Digite ou escaneie o código do ingresso para liberar o acesso.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 w-full">
        <input
          autoFocus
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Código do ingresso"
          className="w-full rounded-2xl border border-gray-300 bg-white p-4 text-center text-lg outline-none focus:border-green-700"
        />
        <button
          type="submit"
          disabled={carregando}
          className="mt-3 w-full rounded-full bg-green-900 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {carregando ? "Verificando..." : "Validar"}
        </button>
      </form>

      {resultado && (
        <div
          className={`mt-8 flex w-full flex-col items-center gap-2 rounded-3xl p-6 text-center ${
            resultado.sucesso ? "bg-green-50" : "bg-red-50"
          }`}
        >
          {resultado.sucesso ? (
            <CheckCircle2 className="h-12 w-12 text-green-700" />
          ) : (
            <XCircle className="h-12 w-12 text-red-600" />
          )}
          <p className={`text-lg font-black ${resultado.sucesso ? "text-green-800" : "text-red-700"}`}>
            {resultado.mensagem}
          </p>
          {resultado.sucesso && resultado.ticket && (
            <p className="text-sm text-gray-600">Assento {resultado.ticket.assento}</p>
          )}
        </div>
      )}
    </div>
  );
}