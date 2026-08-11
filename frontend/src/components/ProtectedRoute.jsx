import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, rolesPermitidas }) {
  const { usuario, carregando } = useAuth();

  // Enquanto verifica se já tem login salvo (localStorage), não decide nada ainda
  if (carregando) {
    return <p className="text-center mt-20">Carregando...</p>;
  }

  // Não está logado -> manda pro login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Está logado, mas com role errado pra essa rota -> bloqueia
  if (rolesPermitidas && !rolesPermitidas.includes(usuario.role)) {
    return <Navigate to="/" replace />;
  }

  // Passou nas duas checagens -> libera a tela
  return children;
}
