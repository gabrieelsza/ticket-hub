import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import Carousel from "../../components/Carousel";

export default function ListaEventos() {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [searchParams] = useSearchParams();

  const busca = searchParams.get("busca") || "";

  useEffect(() => {
    async function carregarEventos() {
      try {
        const response = await api.get("/events");
        setEventos(response.data);
      } catch (error) {
        setErro(error?.response?.data?.message || "Não foi possível carregar os eventos");
      } finally {
        setCarregando(false);
      }
    }

    carregarEventos();
  }, []);

  if (carregando) {
    return <p className="p-10 text-center text-muted-foreground">Carregando eventos...</p>;
  }

  if (erro) {
    return <p className="p-10 text-center text-destructive">{erro}</p>;
  }

  if (eventos.length === 0) {
    return (
      <p className="p-10 text-center text-muted-foreground">
        Nenhum evento publicado no momento.
      </p>
    );
  }

  const eventosFiltrados = eventos.filter((evento) =>
    evento.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  if (eventosFiltrados.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-muted-foreground">
            Nenhum resultado encontrado para: <strong className="text-foreground">{busca}</strong>
          </p>
        </div>
      </div>
    );
  }

  const ordenados = [...eventosFiltrados].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const destaque = ordenados[0];
  const filmes = ordenados.filter((e) => e.tipo === "FILME");
  const shows = ordenados.filter((e) => e.tipo === "SHOW");

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {destaque.tipo === "FILME" ? "Filme" : "Evento"} em destaque
          </p>

          <h1 className="mt-1 text-4xl font-black text-foreground">
            {destaque.titulo}
          </h1>

          <p className="mt-3 line-clamp-3 text-muted-foreground">
            {destaque.descricao}
          </p>

          <Link
            to={`/eventos/${destaque.id}`}
            className="mt-6 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90"
          >
            Ver detalhes
          </Link>
        </div>

        <img
          src={destaque.imagem}
          alt={destaque.titulo}
          className="aspect-video w-full rounded-3xl border border-border object-cover shadow-md"
        />
      </div>

      <Carousel
        titulo="Filmes em cartaz"
        subtitulo="Filmes disponíveis para sessões"
        eventos={filmes}
      />

      <Carousel
        titulo="Shows e eventos"
        subtitulo="Programação de shows e eventos ao vivo"
        eventos={shows}
      />
    </div>
  );
}