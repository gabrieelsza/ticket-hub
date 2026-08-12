import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { sessionId, assentos } = location.state || {};

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const valorPorAssento = 30;
  const valorTotal = (assentos?.length || 0) * valorPorAssento;

  // Se a pessoa chegou aqui direto pela URL, sem ter passado pela seleção de assentos
  if (!sessionId || !assentos || assentos.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <p className="text-gray-600">Nenhum assento selecionado.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 rounded-full bg-green-900 px-5 py-2 text-sm font-semibold text-white"
        >
          Voltar para eventos
        </button>
      </div>
    );
  }

  async function confirmarCompra() {
    setCarregando(true);
    setErro("");

    try {
      const response = await api.post("/tickets", { sessionId, assentos });

      // Leva os tickets recém-criados para a tela de confirmação/ingressos
      navigate("/meus-ingressos", { state: { compraConfirmada: response.data } });
    } catch (error) {
      setErro(error.response?.data?.message || "Não foi possível concluir a compra");
      setCarregando(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
        Passo 2 de 3 · Pagamento
      </p>
      <h1 className="mt-1 text-3xl font-black text-gray-900">Confirmar compra</h1>

      <div className="mt-6 rounded-3xl bg-white p-6">
        <h2 className="text-lg font-bold text-gray-900">Resumo do pedido</h2>

        <div className="mt-4 flex flex-col gap-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="text-gray-500">Assentos</span>
            <span className="font-semibold">{assentos.join(", ")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Quantidade</span>
            <span className="font-semibold">{assentos.length}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between border-t border-gray-100 pt-4">
          <span className="font-semibold text-gray-900">Valor total</span>
          <span className="text-xl font-black text-green-900">
            {valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </span>
        </div>

        {erro && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{erro}</p>
        )}

        <button
          onClick={confirmarCompra}
          disabled={carregando}
          className="mt-5 w-full rounded-full bg-green-900 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {carregando ? "Processando..." : "Confirmar pagamento"}
        </button>

        <p className="mt-3 text-center text-xs text-gray-400">
          Simulação de pagamento — nenhuma cobrança real é feita.
        </p>
      </div>
    </div>
  );
}