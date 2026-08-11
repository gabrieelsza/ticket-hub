import { useEffect, useState } from "react";
import api from "../../services/api";
import EventCard from "../../components/EventCard";
import { Link } from "react-router-dom";

export default function ListaEventos() {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarEventos() {
      try {
        const response = await api.get("/events");
        setEventos(response.data);
      } catch (error) {
        setErro(error, "Não foi possível carregar os eventos");
      } finally {
        setCarregando(false);
      }
    }

    carregarEventos();
  }, []);

  const destaque = eventos[0];
  const restante = eventos.slice(1);

  if (carregando) {
    return <p className="p-10 text-center text-gray-500">Carregando eventos...</p>;
  }

  if (erro) {
    return <p className="p-10 text-center text-red-600">{erro}</p>;
  }

  if (eventos.length === 0) {
    return (
      <p className="p-10 text-center text-gray-500">
        Nenhum evento publicado no momento.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {destaque && (
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-black text-gray-900">{destaque.titulo}</h1>
            <p className="mt-3 line-clamp-3 text-gray-600">{destaque.descricao}</p>

            <div className="mt-6 flex gap-3">
              <Link
                to={`/eventos/${destaque.id}`}
                className="rounded-full bg-green-900 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Ver detalhes
              </Link>
            </div>
          </div>

          <img
            src={destaque.imagem}
            alt={destaque.titulo}
            className="aspect-video w-full rounded-3xl object-cover"
          />
        </div>
      )}

      {restante.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-black text-gray-900">Em cartaz</h2>
          <p className="text-sm text-gray-500">Eventos e filmes disponíveis agora</p>

          <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
            {restante.map((evento) => (
              <EventCard key={evento.id} evento={evento} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}