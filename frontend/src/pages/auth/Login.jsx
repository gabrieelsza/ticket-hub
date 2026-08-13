import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Ticket, LayoutGrid, ScanLine } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const PERFIS = [
  {
    valor: "CLIENTE",
    label: "Cliente",
    icone: Ticket,
    descricao: "Encontre filmes, shows e eventos.",
  },
  {
    valor: "ORGANIZADOR",
    label: "Organizador",
    icone: LayoutGrid,
    descricao: "Crie e gerencie seus eventos.",
  },
  {
    valor: "PORTARIA",
    label: "Portaria",
    icone: ScanLine,
    descricao: "Valide ingressos e controle acessos.",
  },
];

export default function Login() {
  const [perfilSelecionado, setPerfilSelecionado] = useState("CLIENTE");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const usuario = await login(email, senha);

      if (usuario.role !== perfilSelecionado) {
        setErro(
          `Essa conta é de ${formatarRole(usuario.role)}, não de ${formatarRole(perfilSelecionado)}. Selecione o perfil correto.`
        );
        setCarregando(false);
        return;
      }

      if (usuario.role === "ORGANIZADOR") navigate("/organizador");
      else if (usuario.role === "PORTARIA") navigate("/portaria");
      else navigate("/");
    } catch (error) {
      setErro(error, "Email ou senha inválidos");
      setCarregando(false);
    }
  }

  function formatarRole(role) {
    const encontrado = PERFIS.find((p) => p.valor === role);
    return encontrado ? encontrado.label : role;
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-12 px-6 py-12 md:flex-row md:items-center md:justify-center">
        <div className="animate-in fade-in bg-card slide-in-from-bottom-4 duration-500 surface mx-auto w-full max-w-md p-7 sm:p-9 rounded-xl shadow-sm">
          <h2 className="text-2xl font-black text-card-foreground">Entrar no TicketHub</h2>
          <p className="mt-1 text-sm text-muted-foreground/80">Escolha seu perfil e acesse a plataforma.</p>

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
                  onClick={() => {
                    setPerfilSelecionado(perfil.valor);
                    setErro("");
                  }}
                  className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                    ativo
                      ? "border-primary bg-accent/20"
                      : "border-input bg-card hover:border-border"
                  }`}
                >
                  <Icone className="h-5 w-5 text-muted-foreground" />
                  <span>
                    <span className="block text-sm font-bold text-card-foreground">{perfil.label}</span>
                    <span className="block text-xs text-muted-foreground">{perfil.descricao}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {erro && (
            <p className="mt-4 rounded-xl bg-destructive/50 p-3 text-sm text-destructive">{erro}</p>
          )}

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-card-foreground">
                Endereço de e-mail
              </label>
              <input
                type="email"
                placeholder="voce@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted-foreground/30 p-3 text-sm outline-none focus:border-accent"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-card-foreground">Senha</label>
              <input
                type="password"
                placeholder="••••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted-foreground/30 p-3 text-sm outline-none focus:border-accent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="mt-2 rounded-xl bg-forest p-3 uppercase text-sm font-bold text-card transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-5 text-sm text-card-foreground">
            Ainda não tem conta?{" "}
            <Link to="/register" className="font-bold text-forest">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}