import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

const categorias = [
  "Todos",
  "Music",
  "Sports",
  "Arts & Theatre",
  "Film",
  "Miscellaneous",
];

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarEventos() {
      try {
        setCarregando(true);
        setErro("");

        const response = await api.get("/events/search", {
          params: {
            fonte: "ticketmaster",
            query: "show",
          },
        });

        if (ativo) {
          setEventos(response.data);
        }
      } catch (error) {
        if (ativo) {
          setErro(error.response?.data?.message || "Erro ao carregar eventos");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarEventos();

    return () => {
      ativo = false;
    };
  }, []);

  const eventosFiltrados = useMemo(() => {
    if (categoriaAtiva === "Todos") return eventos;

    return eventos.filter((evento) => {
      const categoria = evento.segmento || evento.categoria || "";
      return categoria === categoriaAtiva;
    });
  }, [eventos, categoriaAtiva]);

  if (carregando) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm text-muted-foreground">Carregando eventos...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {erro}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
        Explore
      </p>

      <h1 className="mt-3 text-4xl font-black tracking-tight text-foreground sm:text-6xl">
        Todos os eventos
      </h1>

      <div className="mt-8 flex flex-wrap gap-3">
        {categorias.map((categoria) => {
          const ativa = categoriaAtiva === categoria;

          return (
            <button
              key={categoria}
              onClick={() => setCategoriaAtiva(categoria)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                ativa
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {categoria}
            </button>
          );
        })}
      </div>

      {eventosFiltrados.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Nenhum evento encontrado.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {eventosFiltrados.map((evento) => (
            <article key={evento.externalId} className="group">
              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <img
                  src={evento.imagem}
                  alt={evento.titulo}
                  className="aspect-3/4 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>

              <div className="mt-3">
                <h2 className="line-clamp-1 text-base font-bold text-foreground">
                  {evento.titulo}
                </h2>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}