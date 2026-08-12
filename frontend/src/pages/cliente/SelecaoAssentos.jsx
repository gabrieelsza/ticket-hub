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
        setErro("Sessão não encontrada");
      } finally {
        setCarregando(false);
      }
    }

    carregarSessao();
  }, [sessionId]);

  function alternarAssento(codigo, status) {
    if (status === "OCUPADO") return; // não deixa clicar em assento ocupado

    setAssentosSelecionados((atual) =>
      atual.includes(codigo)
        ? atual.filter((c) => c !== codigo) // já estava selecionado -> remove
        : [...atual, codigo] // não estava -> adiciona
    );
  }

  function agruparPorFileira(assentos) {
    const fileiras = {};
    for (const assento of assentos) {
      const letra = assento.codigo[0]; // "A1" -> "A"
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

  if (carregando) return <p className="p-10 text-center text-gray-500">Carregando...</p>;
  if (erro || !session) return <p className="p-10 text-center text-red-600">{erro}</p>;

  const assentos = session.seatMap?.layout?.assentos || [];
  const fileiras = agruparPorFileira(assentos);
  const valorPorAssento = 30; // mesmo valor fixo usado no backend, por enquanto

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
        Passo 1 de 3 · Assentos
      </p>
      <h1 className="mt-1 text-3xl font-black text-gray-900">{session.event?.titulo}</h1>
      <p className="text-sm text-gray-600">
        {formatarDataHora(session.data)} · {session.local}
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_320px]">
        {/* Mapa de assentos */}
        <div className="rounded-3xl bg-white p-6">
          <div className="mx-auto mb-8 h-1.5 w-3/4 rounded-full bg-gray-300" />
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
            Tela
          </p>

          <div className="flex flex-col items-center gap-2">
            {Object.entries(fileiras).map(([letra, assentosDaFileira]) => (
              <div key={letra} className="flex items-center gap-2">
                <span className="w-4 text-xs font-semibold text-gray-400">{letra}</span>
                {assentosDaFileira.map((assento) => {
                  const selecionado = assentosSelecionados.includes(assento.codigo);

                  let estilo = "border-gray-300 bg-white text-gray-600 hover:border-gray-400";
                  if (assento.status === "OCUPADO") {
                    estilo = "border-transparent bg-gray-200 text-gray-400 cursor-not-allowed";
                  } else if (selecionado) {
                    estilo = "border-transparent bg-green-900 text-white";
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

          {/* Legenda */}
          <div className="mt-8 flex justify-center gap-6 text-xs text-gray-600">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border border-gray-300 bg-white" /> Disponível
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-900" /> Selecionado
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-gray-200" /> Ocupado
            </span>
          </div>
        </div>

        {/* Resumo */}
        <div className="h-fit rounded-3xl bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">Resumo</h2>

          <div className="mt-4 flex flex-col gap-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="text-gray-500">Sessão</span>
              <span className="font-semibold">{formatarDataHora(session.data)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Local</span>
              <span className="font-semibold">{session.local}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Assentos</span>
              <span className="font-semibold">
                {assentosSelecionados.length > 0 ? assentosSelecionados.join(", ") : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Quantidade</span>
              <span className="font-semibold">{assentosSelecionados.length}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between border-t border-gray-100 pt-4">
            <span className="font-semibold text-gray-900">Valor total</span>
            <span className="text-xl font-black text-green-900">
              {(assentosSelecionados.length * valorPorAssento).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>

          <button
            onClick={irParaCheckout}
            disabled={assentosSelecionados.length === 0}
            className="mt-5 w-full rounded-full bg-green-900 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continuar
          </button>

          {assentosSelecionados.length === 0 && (
            <p className="mt-2 text-center text-xs text-gray-400">
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