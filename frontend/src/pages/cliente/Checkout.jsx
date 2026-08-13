import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { sessionId, assentos } = location.state || {};

  const [etapa, setEtapa] = useState("resumo"); // resumo | pagamento | recusado
  const [order, setOrder] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const valorTotal = (assentos?.length || 0) * 30;

  if (!sessionId || !assentos || assentos.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <p className="text-muted-foreground">Nenhum assento selecionado.</p>
        <button onClick={() => navigate("/")} className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:opacity-90">
          Voltar para eventos
        </button>
      </div>
    );
  }

  async function reservarAssentos() {
    setCarregando(true);
    setErro("");
    try {
      const response = await api.post("/tickets", { sessionId, assentos });
      setOrder(response.data.order);
      setEtapa("pagamento");
    } catch (error) {
      setErro(error.response?.data?.message || "Não foi possível reservar os assentos");
    } finally {
      setCarregando(false);
    }
  }

  async function processarPagamento(aprovado) {
    setCarregando(true);
    setErro("");
    try {
      await api.post(`/tickets/${order.id}/pagamento`, { aprovado });

      if (aprovado) {
        navigate("/meus-ingressos", { state: { compraConfirmada: true } });
      } else {
        setEtapa("recusado");
      }
    } catch (error) {
      setErro(error.response?.data?.message || "Erro ao processar pagamento");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Passo 2 de 3 · Pagamento
      </p>
      <h1 className="mt-1 text-3xl font-black text-foreground">
        {etapa === "recusado" ? "Pagamento recusado" : "Confirmar compra"}
      </h1>

      <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-md">
        {etapa === "resumo" && (
          <>
            <Resumo assentos={assentos} valorTotal={valorTotal} />
            {erro && <p className="mt-4  border border-destructive/20 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{erro}</p>}
            <button
              onClick={reservarAssentos}
              disabled={carregando}
              className="mt-5 w-full rounded-full bg-forest py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 disabled:opacity-60"
            >
              {carregando ? "Reservando..." : "Reservar assentos"}
            </button>
          </>
        )}

        {etapa === "pagamento" && (
          <>
            <Resumo assentos={assentos} valorTotal={valorTotal} />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Simulação de pagamento — escolha um resultado para continuar.
            </p>
            {erro && <p className="mt-3 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{erro}</p>}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => processarPagamento(false)}
                disabled={carregando}
                className="flex-1 rounded-full border border-destructive/30 bg-card py-3 text-sm font-semibold text-destructive shadow-sm transition-colors hover:bg-destructive/10 disabled:opacity-60"
              >
                Simular recusa
              </button>
              <button
                onClick={() => processarPagamento(true)}
                disabled={carregando}
                className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 disabled:opacity-60"
              >
                Aprovar pagamento
              </button>
            </div>
          </>
        )}

        {etapa === "recusado" && (
          <>
            <p className="text-sm text-muted-foreground">
              O pagamento não foi aprovado. Seus assentos foram liberados novamente.
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:opacity-90"
            >
              Voltar para eventos
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Resumo({ assentos, valorTotal }) {
  return (
    <>
      <h2 className="text-lg font-bold text-foreground">Resumo do pedido</h2>
      <div className="mt-4 flex flex-col gap-2 text-sm text-foreground">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Assentos</span>
          <span className="font-semibold">{assentos.join(", ")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Quantidade</span>
          <span className="font-semibold">{assentos.length}</span>
        </div>
      </div>
      <div className="mt-4 flex justify-between border-t border-border pt-4">
        <span className="font-semibold text-foreground">Valor total</span>
        <span className="text-xl font-black text-forest">
          {valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </span>
      </div>
    </>
  );
}