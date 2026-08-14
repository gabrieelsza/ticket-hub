import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

const generos = [
  "Todos",
  "Ação",
  "Aventura",
  "Animação",
  "Comédia",
  "Crime",
  "Documentário",
  "Drama",
  "Família",
  "Fantasia",
  "História",
  "Terror",
  "Música",
  "Mistério",
  "Romance",
  "Ficção científica",
  "Cinema TV",
  "Thriller",
  "Guerra",
  "Faroeste",
];

export default function Filmes() {
  const [filmes, setFilmes] = useState([]);
  const [generoAtivo, setGeneroAtivo] = useState("Todos");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarFilmes() {
      try {
        setCarregando(true);
        setErro("");

        const response = await api.get("/events"); 
        if (ativo) {
          setFilmes(response.data);
        }
      } catch (error) {
        if (ativo) {
          setErro(error.response?.data?.message || "Erro ao carregar filmes");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarFilmes();

    return () => {
      ativo = false;
    };
  }, []);

  const filmesFiltrados = useMemo(() => {
    if (generoAtivo === "Todos") return filmes;

    return filmes.filter((filme) => {
      const listaGeneros = filme.tipo || [];
      return listaGeneros.includes(generoAtivo);
    });
  }, [filmes, generoAtivo]);

  if (carregando) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm text-muted-foreground">Carregando filmes...</p>
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
        Toda a coleção
      </h1>

      <div className="mt-8 flex flex-wrap gap-3">
        {generos.map((genero) => {
          const ativo = generoAtivo === genero;

          return (
            <button
              key={genero}
              onClick={() => setGeneroAtivo(genero)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                ativo
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {genero}
            </button>
          );
        })}
      </div>

      {filmesFiltrados.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Nenhum filme encontrado.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {filmesFiltrados.map((filme) => (
            <article key={filme.id} className="group">
              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <img
                  src={filme.imagem}
                  alt={filme.titulo}
                  className="aspect-3/4 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>

              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-bold text-foreground">
                    {filme.titulo}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {filme.ano}
                  </p>
                </div>

                {filme.nota && (
                  <span className="shrink-0 text-sm font-semibold text-muted-foreground">
                    ★ {filme.nota}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}