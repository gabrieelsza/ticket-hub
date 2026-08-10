const TMDB_BASE_URL = "https://api.themoviedb.org/3";

class TmdbService {
  async buscarFilmes(query) {
    const url = `${TMDB_BASE_URL}/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao buscar filmes no TMDb: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return data.results.map((filme) => ({
      externalId: String(filme.id),
      titulo: filme.title,
      descricao: filme.overview,
      imagem: filme.poster_path
        ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
        : null,
      tipo: "FILME",
      sourceApi: "TMDB",
    }));
  }
}

export default new TmdbService();