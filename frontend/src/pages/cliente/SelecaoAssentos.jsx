import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function SelecaoAssentos() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [assentosSelecionados, setAssentosSelecionados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarSessao() {
      try {
        const response = await api.get(`/sessions/${sessionId}`);
        setSession(response.data);
      } catch (error) {
        setErro(error?.response?.data?.message || "Sessão não encontrada");
      } finally {
        setCarregando(false);
      }
    }

    carregarSessao();
  }, [sessionId]);

  function alternarAssento(codigo, status) {
    if (status === "OCUPADO") return;

    setAssentosSelecionados((atual) =>
      atual.includes(codigo)
        ? atual.filter((c) => c !== codigo)
        : [...atual, codigo]
    );
  }

  function agruparPorFileira(assentos) {
    const fileiras = {};
    for (const assento of assentos) {
      const letra = assento.codigo[0];
      if (!fileiras[letra]) fileiras[letra] = [];
      fileiras[letra].push(assento);
    }
    return fileiras;
  }

  function irParaCheckout() {
    if (assentosSelecionados.length === 0) return;

    navigate("/checkout", {
      state: { sessionId, assentos: assentosSelecionados },
    });
  }

  if (carregando) {
    return <p className="p-10 text-center text-muted-foreground">Carregando...</p>;
  }

  if (erro || !session) {
    return <p className="p-10 text-center text-destructive">{erro || "Sessão não encontrada"}</p>;
  }

  const assentos = session.seatMap?.layout?.assentos || [];
  const fileiras = agruparPorFileira(assentos);
  const valorPorAssento = 30;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Passo 1 de 3 · Assentos
      </p>

      <h1 className="mt-1 text-3xl font-black text-foreground">
        {session.event?.titulo}
      </h1>

      <p className="text-sm text-muted-foreground">
        {formatarDataHora(session.data)} · {session.local}
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-md">
          <div className="mx-auto mb-8 h-1.5 w-3/4 rounded-full bg-muted" />
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground/80">
            Tela
          </p>

          <div className="flex flex-col items-center gap-2">
            {Object.entries(fileiras).map(([letra, assentosDaFileira]) => (
              <div key={letra} className="flex items-center gap-2">
                <span className="w-4 text-xs font-semibold text-muted-foreground/80">
                  {letra}
                </span>

                {assentosDaFileira.map((assento) => {
                  const selecionado = assentosSelecionados.includes(assento.codigo);

                  let estilo =
                    "border-border bg-background text-muted-foreground hover:border-primary/50 hover:bg-muted";
                  if (assento.status === "OCUPADO") {
                    estilo =
                      "cursor-not-allowed border-transparent bg-muted text-muted-foreground/50";
                  } else if (selecionado) {
                    estilo =
                      "border-transparent bg-primary text-primary-foreground shadow-sm";
                  }

                  return (
                    <button
                      key={assento.codigo}
                      onClick={() => alternarAssento(assento.codigo, assento.status)}
                      disabled={assento.status === "OCUPADO"}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${estilo}`}
                    >
                      {assento.codigo.slice(1)}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border border-border bg-background" />
              Disponível
            </span>

            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-primary" />
              Selecionado
            </span>

            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-muted" />
              Ocupado
            </span>
          </div>
        </div>

        <div className="h-fit rounded-3xl border border-border bg-card p-6 shadow-md">
          <h2 className="text-lg font-bold text-foreground">Resumo</h2>

          <div className="mt-4 flex flex-col gap-2 text-sm text-foreground">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sessão</span>
              <span className="font-semibold">{formatarDataHora(session.data)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Local</span>
              <span className="font-semibold">{session.local}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Assentos</span>
              <span className="font-semibold">
                {assentosSelecionados.length > 0 ? assentosSelecionados.join(", ") : "—"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantidade</span>
              <span className="font-semibold">{assentosSelecionados.length}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between border-t border-border pt-4">
            <span className="font-semibold text-foreground">Valor total</span>
            <span className="text-xl font-black text-primary">
              {(assentosSelecionados.length * valorPorAssento).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>

          <button
            onClick={irParaCheckout}
            disabled={assentosSelecionados.length === 0}
            className="mt-5 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continuar
          </button>

          {assentosSelecionados.length === 0 && (
            <p className="mt-2 text-center text-xs text-muted-foreground/80">
              Selecione ao menos um assento.
            </p>
          )}
        </div>
      </div>
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