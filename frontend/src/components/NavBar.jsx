import { Link, useNavigate } from "react-router-dom";
import { Heart, Search, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleBuscar(e) {
    if (e.key === "Enter" && busca.trim()) {
      navigate(`/eventos?busca=${encodeURIComponent(busca.trim())}`);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 backdrop-blur-md">
      <div className="mx-auto flex flex-row max-w-7xl justify-between items-center gap-6 px-1 py-4 md:px-10">
        <div className="flex flex-row max-w-7xl items-center gap-6 px-2 py-2 md:px-10">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight">
            tickethub
          </Link>

          <nav className="flex flex-row items-center md:flex">
            {usuario?.role === "CLIENTE" && (
              <>
                <Link to="/" className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Home
                </Link>
                <Link to="/filmes" className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Filmes
                </Link>
                <Link to="/eventos" className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Eventos
                </Link>
                <Link to="/meus-ingressos" className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Ingressos
                </Link>
              </>
            )}

            {usuario?.role === "ORGANIZADOR" && (
              <>
                <Link
                  to="/organizador/criar-evento"
                  className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Criar evento
                </Link>
                <Link
                  to="/organizador/meus-eventos"
                  className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Meus eventos
                </Link>
                <Link
                  to="/organizador/rascunhos"
                  className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Rascunhos
                </Link>
                <Link
                  to="/organizador/publicacoes"
                  className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Publicações
                </Link>
              </>
            )}
            {usuario?.role === "PORTARIA" && (
              <Link to="/portaria" className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                Validar Acesso
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-border 
          bg-card px-4 py-2 text-sm text-muted-foreground 
          transition-colors hover:border-primary/40 hover:text-foreground">
            <Search className="size-4 text-muted-foreground" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={handleBuscar}
              placeholder="Buscar filmes, shows, eventos"
              className="w-56 bg-transparent text-sm outline-none 
              placeholder:text-muted-foreground"
            />
          </div>

          {usuario?.role === "CLIENTE" && (
            <Link to="/favoritos" className="hidden sm:block">
              <Heart className="size-4" />
            </Link>
          )}

          {usuario ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full
               bg-transparente px-3 py-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                {usuario.nome?.split(" ")[0]}
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-full bg-transparente px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted-foreground/60"
            >
              <User className="h-4 w-4" />
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
