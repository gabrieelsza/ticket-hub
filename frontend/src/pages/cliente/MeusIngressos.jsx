import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { QrCode, Calendar, MapPin, Armchair } from "lucide-react";
import api from "../../services/api";

const ABAS = [
  { valor: "ATIVOS", label: "Ativos" },
  { valor: "UTILIZADOS", label: "Utilizados" },
  { valor: "CANCELADOS", label: "Cancelados" },
];

export default function MeusIngressos() {
  const location = useLocation();
  const [tickets, setTickets] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState("ATIVOS");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarIngressos() {
      try {
        const response = await api.get("/tickets/me");
        setTickets(response.data);
      } catch (error) {
        setErro(error, "Não foi possível carregar seus ingressos");
      } finally {
        setCarregando(false);
      }
    }

    carregarIngressos();
  }, []);

  function pertenceAAba(ticket, aba) {
    if (aba === "ATIVOS") return ticket.status === "PAGO";
    if (aba === "UTILIZADOS") return ticket.status === "VALIDADO";
    if (aba === "CANCELADOS") return ticket.status === "CANCELADO";
    return false;
  }

  const ticketsFiltrados = tickets.filter((t) => pertenceAAba(t, abaAtiva));

  if (carregando) {
    return <p className="p-10 text-center text-gray-500">Carregando ingressos...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Sua carteira</p>
      <h1 className="mt-1 text-3xl font-black text-gray-900">Meus ingressos</h1>

      {location.state?.compraConfirmada && (
        <div className="mt-4 rounded-2xl border border-green-800/30 bg-green-50 p-4 text-sm text-green-900">
          Compra confirmada! Seus ingressos já estão disponíveis abaixo.
        </div>
      )}

      {erro && <p className="mt-4 text-sm text-red-600">{erro}</p>}

      <div className="mt-6 flex gap-2">
        {ABAS.map((aba) => {
          const ativa = aba.valor === abaAtiva;
          return (
            <button
              key={aba.valor}
              onClick={() => setAbaAtiva(aba.valor)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                ativa
                  ? "bg-green-900 text-white"
                  : "border border-gray-300 bg-white text-gray-600 hover:border-gray-400"
              }`}
            >
              {aba.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {ticketsFiltrados.length === 0 ? (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500">
            Nenhum ingresso {ABAS.find((a) => a.valor === abaAtiva).label.toLowerCase()} no momento.
          </p>
        ) : (
          ticketsFiltrados.map((ticket) => (
            <div
              key={ticket.id}
              className="flex flex-col gap-4 rounded-3xl bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={ticket.session?.event?.imagem}
                  alt={ticket.session?.event?.titulo}
                  className="h-20 w-16 rounded-xl object-cover"
                />

                <div>
                  <span
                    className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
                      ticket.status === "PAGO"
                        ? "bg-green-100 text-green-800"
                        : ticket.status === "VALIDADO"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {formatarStatus(ticket.status)}
                  </span>

                  <h3 className="mt-1 font-bold text-gray-900">{ticket.session?.event?.titulo}</h3>

                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatarDataHora(ticket.session?.data)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {ticket.session?.local}
                    </span>
                    <span className="flex items-center gap-1">
                      <Armchair className="h-3.5 w-3.5" />
                      {ticket.assento}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-gray-400">Código {ticket.qrCode}</p>
                </div>
              </div>

              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-50">
                <QrCode className="h-14 w-14 text-gray-800" />
                <button
                  onClick={() => {
                    const link = `${window.location.origin}/ingresso/${ticket.shareToken}`;
                    navigator.clipboard.writeText(link);
                    alert("Link copiado! Agora é só enviar para quem vai usar o ingresso.");
                  }}
                  className="mt-2 text-xs font-semibold text-green-800 hover:underline"
                >
                  Compartilhar ingresso
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function formatarStatus(status) {
  if (status === "PAGO") return "Ativo";
  if (status === "VALIDADO") return "Utilizado";
  if (status === "CANCELADO") return "Cancelado";
  return status;
}

function formatarDataHora(dataIso) {
  if (!dataIso) return "";
  const data = new Date(dataIso);
  return (
    data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) +
    " · " +
    data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
}