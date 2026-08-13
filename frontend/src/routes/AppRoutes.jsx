import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/organizador/Dashboard";
import CriarEvento from "../pages/organizador/CriarEvento";
import MeusEventos from "../pages/organizador/MeusEventos";
import CriarSessao from "../pages/organizador/CriarSessao";

import ListaEventos from "../pages/cliente/ListaEventos";
import DetalheEvento from "../pages/cliente/DetalheEvento";

import Layout from "../components/Layout";
import Checkout from "../pages/cliente/Checkout";
import SelecaoAssentos from "../pages/cliente/SelecaoAssentos";
import MeusIngressos from "../pages/cliente/MeusIngressos";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<Layout />}>
          <Route path="/" element={<ListaEventos />} />
          <Route path="/eventos" element={<ListaEventos />} />
          <Route path="/eventos/:id" element={<DetalheEvento />} />
          <Route path="*" element={<div>Página não encontrada</div>} />

          <Route
            path="/organizador"
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
            path="/sessoes/:sessionId/assentos"
            element={
              <ProtectedRoute rolesPermitidas={["CLIENTE"]}>
                <SelecaoAssentos />
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
            element={<ProtectedRoute rolesPermitidas={["PORTARIA"]} />}
          />
        </Route>

        <Route path="*" element={<div>Página não encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}
