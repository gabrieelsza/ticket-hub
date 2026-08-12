import { Link, useNavigate } from "react-router-dom";
import { Heart, Search, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="flex items-center justify-between gap-6 border-b border-gray-200 bg-[#f8f6f0] px-6 py-4">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-xl font-black text-green-900">
          TicketHub
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-700 md:flex">
          <Link to="/" className="hover:text-green-900">Home</Link>
          <Link to="/" className="hover:text-green-900">Filmes</Link>
          <Link to="/" className="hover:text-green-900">Eventos</Link>

          {usuario?.role === "CLIENTE" && (
            <Link to="/" className="hover:text-green-900">Ingressos</Link>
          )}
          {usuario?.role === "ORGANIZADOR" && (
            <Link to="/" className="hover:text-green-900">Meus Eventos</Link>
          )}
          {usuario?.role === "PORTARIA" && (
            <Link to="/login" className="hover:text-green-900">Validar Acesso</Link>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-gray-400 sm:flex">
          <Search className="h-4 w-4" />
          <span>Buscar filmes, shows, eventos</span>
        </div>

        {usuario?.role === "CLIENTE" && (
          <Link to="/" className="rounded-full p-2 hover:bg-white">
            <Heart className="h-5 w-5 text-gray-600" />
          </Link>
        )}

        {usuario ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-gray-700">
              <User className="h-4 w-4" />
              {usuario.nome?.split(" ")[0]}
            </div>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-gray-500 hover:text-red-600"
            >
              Sair
            </button>
          </div>
        ) : (
          <Link
            to="/"
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            <User className="h-4 w-4" />
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}