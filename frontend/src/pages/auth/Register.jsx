import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Ticket, LayoutGrid, ScanLine } from "lucide-react";
import api from "../../services/api";

const PERFIS = [
  {
    valor: "CLIENTE",
    label: "Cliente",
    icone: Ticket,
    descricaoTitulo: "Perfil Cliente",
    descricaoTexto: "Compre ingressos e guarde seus QR Codes.",
  },
  {
    valor: "ORGANIZADOR",
    label: "Organizador",
    icone: LayoutGrid,
    descricaoTitulo: "Perfil Organizador",
    descricaoTexto: "Crie eventos, sessões e acompanhe suas vendas.",
  },
  {
    valor: "PORTARIA",
    label: "Portaria",
    icone: ScanLine,
    descricaoTitulo: "Perfil Portaria",
    descricaoTexto: "Valide o acesso dos clientes na entrada.",
  },
];

export default function Register() {
  const [perfilSelecionado, setPerfilSelecionado] = useState("CLIENTE");
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const perfilAtual = PERFIS.find((p) => p.valor === perfilSelecionado);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      await api.post("/auth/register", { ...form, role: perfilSelecionado });
      navigate("/login");
    } catch (error) {
      setErro(error.response?.data?.message || "Erro ao cadastrar");
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-12 px-6 py-12 md:flex-row md:items-center md:justify-center">
        <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-sm">
          <h2 className="text-2xl font-black text-card-foreground">Criar conta no TicketHub</h2>
          <p className="mt-1 text-sm text-muted-foreground/80">Escolha seu perfil e comece a usar a plataforma.</p>

          <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Perfil de acesso
          </p>

          <div className="mt-3 flex flex-col gap-2">
            {PERFIS.map((perfil) => {
              const Icone = perfil.icone;
              const ativo = perfil.valor === perfilSelecionado;

              return (
                <button
                  key={perfil.valor}
                  type="button"
                  onClick={() => setPerfilSelecionado(perfil.valor)}
                  className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                    ativo
                      ? "border-primary bg-accent/20"
                      : "border-input bg-card hover:border-border"
                  }`}
                >
                  <Icone className="h-5 w-5 text-muted-foreground" />
                  <span>
                    <span className="block text-sm font-bold text-card-foreground">{perfil.label}</span>
                    <span className="block text-xs text-muted-foreground">{perfil.descricaoTexto}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-dashed border-forest bg-accent/10 p-3">
            <p className="flex items-center gap-2 text-sm font-bold text-forest">
              {perfilAtual.descricaoTitulo}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{perfilAtual.descricaoTexto}</p>
          </div>

          {erro && (
            <p className="mt-4 rounded-xl bg-destructive/50 p-3 text-sm text-destructive">{erro}</p>
          )}

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-card-foreground">
                Nome completo
              </label>
              <input
                name="nome"
                placeholder="Como devemos te chamar"
                value={form.nome}
                onChange={handleChange}
                className="w-full rounded-xl border border-input bg- p-3 text-sm outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold card-foreground">
                Endereço de e-mail
              </label>
              <input
                name="email"
                type="email"
                placeholder="voce@email.com"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-input bg- p-3 text-sm outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-card-foreground0">Senha</label>
              <input
                name="senha"
                type="password"
                placeholder="••••••••••"
                value={form.senha}
                onChange={handleChange}
                className="w-full rounded-xl border border-input bg- p-3 text-sm outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="mt-2 rounded-xl bg-forest p-3 text-sm font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {carregando ? "Criando conta..." : `Criar conta de ${perfilAtual.label}`}
            </button>
          </form>

          <p className="mt-5 text-sm text-card-foreground">
            Já tem conta?{" "}
            <Link to="/login" className="font-bold text-forest">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}