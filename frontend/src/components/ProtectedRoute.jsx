import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, rolesPermitidas }) {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <p className="text-center mt-20">Carregando...</p>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidas && !rolesPermitidas.includes(usuario.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
