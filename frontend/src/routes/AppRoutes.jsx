import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/organizador/Dashboard";
import CriarEvento from "../pages/organizador/CriarEvento";
import MeusEventos from "../pages/organizador/MeusEventos";
import CriarSessao from "../pages/organizador/CriarSessao";
import Publicacoes from "../pages/organizador/Publicacoes";
import Rascunhos from "../pages/organizador/Rascunhos";

import ListaEventos from "../pages/cliente/ListaEventos";
import DetalheEvento from "../pages/cliente/DetalheEvento";
import Filmes from "../pages/cliente/Filmes";

import Layout from "../components/Layout";
import Checkout from "../pages/cliente/Checkout";
import SelecaoAssentos from "../pages/cliente/SelecaoAssentos";
import MeusIngressos from "../pages/cliente/MeusIngressos";
import Eventos from "../pages/cliente/Eventos";

import ValidarIngresso from "../pages/portaria/ValidarIngresso";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<Layout />}>
          <Route path="/" element={<ListaEventos />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/eventos/:id" element={<DetalheEvento />} />
          <Route
            path="*"
            element={
              <div className="w-64 mx-auto mt-10">Página não encontrada</div>
            }
          />

          <Route
            path="/organizador/publicacoes"
            element={
              <ProtectedRoute rolesPermitidas={["ORGANIZADOR"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/organizador/criar-evento"
            element={
              <ProtectedRoute rolesPermitidas={["ORGANIZADOR"]}>
                <CriarEvento />
              </ProtectedRoute>
            }
          />

          <Route
            path="/organizador/meus-eventos"
            element={
              <ProtectedRoute rolesPermitidas={["ORGANIZADOR"]}>
                <MeusEventos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/organizador/eventos/:eventId/sessoes"
            element={
              <ProtectedRoute rolesPermitidas={["ORGANIZADOR"]}>
                <CriarSessao />
              </ProtectedRoute>
            }
          />

          <Route
            path="/organizador/rascunhos"
            element={
              <ProtectedRoute rolesPermitidas={["ORGANIZADOR"]}>
                <Rascunhos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizador/publicacoes"
            element={
              <ProtectedRoute rolesPermitidas={["ORGANIZADOR"]}>
                <Publicacoes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sessoes/:sessionId/assentos"
            element={
              <ProtectedRoute rolesPermitidas={["CLIENTE"]}>
                <SelecaoAssentos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/filmes"
            element={
              <ProtectedRoute rolesPermitidas={["CLIENTE"]}>
                <Filmes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute rolesPermitidas={["CLIENTE"]}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meus-ingressos"
            element={
              <ProtectedRoute rolesPermitidas={["CLIENTE"]}>
                <MeusIngressos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/portaria"
            element={
              <ProtectedRoute rolesPermitidas={["PORTARIA"]}>
                <ValidarIngresso />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
