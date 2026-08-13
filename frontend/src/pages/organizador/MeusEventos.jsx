import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import ModalCriarSessao from "../../pages/organizador/CriarSessao";

export default function MeusEventos() {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [publicandoId, setPublicandoId] = useState(null);
  const [modalEvento, setModalEvento] = useState(null);
  const navigate = useNavigate();

  async function buscarEventos() {
    try {
      const response = await api.get("/events/meus");
      setEventos(response.data);
      setErro("");
    } catch (error) {
      setErro(error.response?.data?.message || error.message || "Erro ao carregar seus eventos");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    let ativo = true;

    async function carregarInicial() {
      try {
        const response = await api.get("/events/meus");
        if (ativo) {
          setEventos(response.data);
          setErro("");
        }
      } catch (error) {
        if (ativo) {
          setErro(error.response?.data?.message || error.message || "Erro ao carregar seus eventos");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarInicial();

    return () => {
      ativo = false;
    };
  }, []);

  async function publicar(id) {
    setPublicandoId(id);
    try {
      await api.patch(`/events/${id}/publish`);
      await buscarEventos();
    } catch (error) {
      setErro(error.response?.data?.message || error.message || "Erro ao publicar");
    } finally {
      setPublicandoId(null);
    }
  }

  function estatisticasDoEvento(evento) {
    let capacidade = 0;
    let vendidos = 0;

    for (const session of evento.sessions || []) {
      const assentos = session.seatMap?.layout?.assentos || [];
      capacidade += assentos.length;
      vendidos += assentos.filter((a) => a.status === "OCUPADO").length;
    }

    return { capacidade, vendidos };
  }

  function statusExibicao(evento) {
    if (evento.status === "RASCUNHO") {
      return {
        label: "Rascunho",
        cor: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
      };
    }

    const todasNoPassado =
      evento.sessions?.length > 0 &&
      evento.sessions.every((s) => new Date(s.data) < new Date());

    if (todasNoPassado) {
      return {
        label: "Encerrado",
        cor: "border-border bg-muted text-muted-foreground",
      };
    }

    return {
      label: "Publicado",
      cor: "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300",
    };
  }

  const totalVendidos = eventos.reduce(
    (soma, e) => soma + estatisticasDoEvento(e).vendidos,
    0
  );

  const totalCapacidade = eventos.reduce(
    (soma, e) => soma + estatisticasDoEvento(e).capacidade,
    0
  );

  const ocupacaoMedia =
    totalCapacidade > 0 ? Math.round((totalVendidos / totalCapacidade) * 100) : 0;

  if (carregando) {
    return (
      <p className="p-10 text-center text-sm text-muted-foreground">
        Carregando...
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Painel
          </p>
          <h1 className="mt-1 text-3xl font-black text-foreground">
            Meus eventos
          </h1>
        </div>

        <button
          onClick={() => navigate("/organizador/criar-evento")}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90"
        >
          Criar evento
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Ingressos vendidos
          </p>
          <p className="mt-1 text-2xl font-black text-foreground">
            {totalVendidos.toLocaleString("pt-BR")}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Capacidade total
          </p>
          <p className="mt-1 text-2xl font-black text-foreground">
            {totalCapacidade.toLocaleString("pt-BR")}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Ocupação média
          </p>
          <p className="mt-1 text-2xl font-black text-foreground">
            {ocupacaoMedia}%
          </p>
        </div>
      </div>

      {erro && (
        <p className="mt-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {String(erro)}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {eventos.length === 0 && (
          <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Você ainda não importou nenhum evento.
          </p>
        )}

        {eventos.map((evento) => {
          const { capacidade, vendidos } = estatisticasDoEvento(evento);
          const percentual = capacidade > 0 ? Math.round((vendidos / capacidade) * 100) : 0;
          const status = statusExibicao(evento);
          const primeiraSessao = evento.sessions?.[0];

          return (
            <div
              key={evento.id}
              className="rounded-3xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={evento.imagem}
                    alt={evento.titulo}
                    className="h-16 w-14 rounded-xl object-cover"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground">{evento.titulo}</h3>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${status.cor}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    {primeiraSessao && (
                      <p className="text-xs text-muted-foreground">
                        {formatarDataHora(primeiraSessao.data)} · {primeiraSessao.local}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setModalEvento(evento)}
                    className="rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
                  >
                    Criar sessão
                  </button>

                  {evento.status !== "PUBLICADO" && (
                    <button
                      onClick={() => publicar(evento.id)}
                      disabled={publicandoId === evento.id}
                      className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 disabled:opacity-60"
                    >
                      {publicandoId === evento.id ? "Publicando..." : "Publicar"}
                    </button>
                  )}
                </div>
              </div>

              {capacidade > 0 && (
                <div className="mt-4">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${percentual}%` }}
                    />
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {percentual}% · {vendidos} de {capacidade} ingressos
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {modalEvento && (
        <ModalCriarSessao
          evento={modalEvento}
          onFechar={() => setModalEvento(null)}
          onCriada={async () => {
            setModalEvento(null);
            setCarregando(true);
            await buscarEventos();
          }}
        />
      )}
    </div>
  );
}

function formatarDataHora(dataIso) {
  const data = new Date(dataIso);

  return (
    data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    }) +
    " · " +
    data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}