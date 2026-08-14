import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { QrCode, Calendar, MapPin, Armchair } from "lucide-react";
import api from "../../services/api";
import { QRCodeSVG } from "qrcode.react";

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
    return (
      <p className="p-10 text-center text-muted-foreground">
        Carregando ingressos...
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Sua carteira
      </p>
      <h1 className="mt-1 text-3xl font-black text-foreground">Meus ingressos</h1>

      {location.state?.compraConfirmada && (
        <div className="mt-4 rounded-2xl border border-border bg-primary/30 p-4 text-sm text-card shadow-sm">
          Compra confirmada! Seus ingressos já estão disponíveis abaixo.
        </div>
      )}

      {erro && <p className="mt-4 text-sm text-destructive">{erro}</p>}

      <div className="mt-6 flex gap-2">
        {ABAS.map((aba) => {
          const ativa = aba.valor === abaAtiva;
          return (
            <button
              key={aba.valor}
              onClick={() => setAbaAtiva(aba.valor)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors border ${
                ativa
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background text-muted-foreground hover:border-border hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {aba.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {ticketsFiltrados.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Nenhum ingresso{" "}
            {ABAS.find((a) => a.valor === abaAtiva).label.toLowerCase()} no
            momento.
          </p>
        ) : (
          ticketsFiltrados.map((ticket) => (
            <div
              key={ticket.id}
              className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={ticket.session?.event?.imagem}
                  alt={ticket.session?.event?.titulo}
                  className="h-20 w-16 rounded-xl border border-border object-cover"
                />

                <div>
                  <span
                    className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
                      ticket.status === "PAGO"
                        ? "bg-primary/10 text-primary"
                        : ticket.status === "VALIDADO"
                        ? "bg-muted text-muted-foreground"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {formatarStatus(ticket.status)}
                  </span>

                  <h3 className="mt-1 font-bold text-foreground">
                    {ticket.session?.event?.titulo}
                  </h3>

                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      {formatarDataHora(ticket.session?.data)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {ticket.session?.local}
                    </span>
                    <span className="flex items-center gap-1">
                      <Armchair className="h-3.5 w-3.5 text-primary" />
                      {ticket.assento}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Código {ticket.qrCode}
                  </p>
                </div>
              </div>

              <div className="flex min-w-30 flex-col items-center gap-2">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-border bg-background p-2 shadow-sm">
                  <QRCodeSVG
                    value={ticket.qrCode}
                    size={80}
                    level="H"
                    includeMargin
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const link = `${window.location.origin}/ingresso/${ticket.shareToken}`;

                    navigator.clipboard.writeText(link);

                    alert(
                      "Link copiado! Agora é só enviar para quem vai usar o ingresso.",
                    );
                  }}
                  className="whitespace-nowrap text-xs font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
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