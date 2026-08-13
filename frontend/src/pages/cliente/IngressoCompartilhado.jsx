import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, MapPin, Armchair, QrCode } from "lucide-react";
import api from "../../services/api";

export default function IngressoCompartilhado() {
  const { shareToken } = useParams();
  const [ticket, setTicket] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const response = await api.get(`/tickets/share/${shareToken}`);
        setTicket(response.data);
      } catch (error) {
        setErro(error, "Este link de ingresso é inválido ou expirou");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [shareToken]);

  if (carregando) return <p className="p-10 text-center text-gray-500">Carregando...</p>;
  if (erro || !ticket) return <p className="p-10 text-center text-red-600">{erro}</p>;

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-3xl bg-white p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Ingresso compartilhado
        </p>
        <h1 className="mt-1 text-2xl font-black text-gray-900">{ticket.session?.event?.titulo}</h1>

        <div className="mt-4 flex justify-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" /> {formatarDataHora(ticket.session?.data)}
          </span>
          <span className="flex items-center gap-1">
            <Armchair className="h-4 w-4" /> {ticket.assento}
          </span>
        </div>
        <p className="mt-1 flex items-center justify-center gap-1 text-sm text-gray-600">
          <MapPin className="h-4 w-4" /> {ticket.session?.local}
        </p>

        <div className="mx-auto mt-6 flex h-40 w-40 items-center justify-center rounded-2xl bg-gray-50">
          <QrCode className="h-24 w-24 text-gray-800" />
        </div>

        <p className="mt-3 text-xs text-gray-400">Código {ticket.qrCode}</p>
      </div>
    </div>
  );
}

function formatarDataHora(dataIso) {
  if (!dataIso) return "";
  const data = new Date(dataIso);
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) + " · " +
    data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}