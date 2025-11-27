import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router-dom";
import { HeaderLogin } from "../components/HeaderLogin";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { TrendingUp, ShieldCheck, BarChart3 } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
    const [formData, setFormData] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    password: "",
    password_confirm: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const { email, username, first_name, last_name, password, password_confirm } = formData;

    if (!email || !username || !first_name || !last_name || !password || !password_confirm) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (password !== password_confirm) {
      toast.error("As senhas não coincidem");
      return;
    }

    setIsLoading(true);
    try {
      await register(formData);
      toast.success("Conta criada com sucesso! Redirecionando...");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar a conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-gray-100 relative">

      {/* <div className="absolute top-0 left-0 w-full z-10">
        <HeaderLogin />
      </div> */}

      <main className="container mx-auto max-w-7xl px-4">
        <div className="pt-36 sm:pt-40 pb-16 md:pb-24 space-y-20 md:space-y-28">

          <section className="text-center max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-6xl font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight">
              Decisões financeiras que transformam o futuro do seu negócio
            </h1>

            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Controle total sobre lucros, gastos, riscos e fluxo de caixa com ferramentas simples,
              rápidas e acessíveis — criadas para empreendedores que querem crescer com segurança.
            </p>
          </section>

          <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            <div className="p-8 rounded-2xl bg-gray-800/50 border border-purple-600/30 shadow-lg hover:scale-[1.03] transition-transform">
              <TrendingUp className="w-10 h-10 text-purple-400 mb-5" />
              <h3 className="text-xl font-semibold mb-2">Acompanhe sua evolução</h3>
              <p className="text-gray-300 leading-relaxed">
                Visualize lucro, gastos e projeções reais em poucos segundos.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-800/50 border border-pink-600/30 shadow-lg hover:scale-[1.03] transition-transform">
              <ShieldCheck className="w-10 h-10 text-pink-400 mb-5" />
              <h3 className="text-xl font-semibold mb-2">Decisões mais seguras</h3>
              <p className="text-gray-300 leading-relaxed">
                Evite falta de capital com alertas inteligentes e visão clara do caixa.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-800/50 border border-blue-600/30 shadow-lg hover:scale-[1.03] transition-transform">
              <BarChart3 className="w-10 h-10 text-blue-400 mb-5" />
              <h3 className="text-xl font-semibold mb-2">Relatórios profissionais</h3>
              <p className="text-gray-300 leading-relaxed">
                Perfeito para crédito, parcerias, decisões estratégicas e negociações.
              </p>
            </div>

          </section>

          <section className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            <div className="text-center p-8 bg-gray-800/50 rounded-2xl shadow-lg">
              <h2 className="text-5xl font-semibold text-purple-400">37,9%</h2>
              <p className="text-gray-300 mt-2">sobrevivem após 5 anos (IBGE)</p>
            </div>

            <div className="text-center p-8 bg-gray-800/50 rounded-2xl shadow-lg">
              <h2 className="text-5xl font-semibold text-pink-400">854.150</h2>
              <p className="text-gray-300 mt-2">empresas fecharam em 2024 (Gov BR)</p>
            </div>

            <div className="text-center p-8 bg-gray-800/50 rounded-2xl shadow-lg">
              <h2 className="text-4xl font-semibold text-blue-400">Fator-chave</h2>
              <p className="text-gray-300 mt-2">gestão financeira (SEBRAE)</p>
            </div>

          </section>

          <section className="text-center max-w-2xl mx-auto space-y-6">
            <p className="text-gray-300 text-lg leading-relaxed">
              Uma plataforma criada especialmente para pequenos e médios empreendedores, com linguagem simples e foco total em resultados reais.
            </p>

            <Button
              onClick={() => document.getElementById("login-form")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 font-semibold text-white px-8 py-3 rounded-lg shadow-lg text-base"
              size="lg"
            >
              Quero melhorar meu financeiro
            </Button>
          </section>

          <section id="login-form" className="flex justify-center scroll-mt-24">
            <Card className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm border-gray-700/60 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold text-gray-100">Crie sua Conta</CardTitle>
                <CardDescription className="text-gray-300">
                  Comece a transformar seus dados em decisões.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="flex gap-4">
                    <div className="space-y-2 w-1/2">
                      <Label htmlFor="first_name" className="text-gray-300 font-semibold">Nome</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        placeholder="Seu nome"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        variant="landing"
                        required
                      />
                    </div>
                    <div className="space-y-2 w-1/2">
                      <Label htmlFor="last_name" className="text-gray-300 font-semibold">Sobrenome</Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        placeholder="Seu sobrenome"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        variant="landing"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-300 font-semibold">Usuário</Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="Escolha um nome de usuário"
                      value={formData.username}
                      onChange={handleInputChange}
                      variant="landing"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300 font-semibold">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      variant="landing"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300 font-semibold">Senha</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Crie uma senha forte"
                      value={formData.password}
                      onChange={handleInputChange}
                      variant="landing"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password_confirm" className="text-gray-300 font-semibold">Confirmar Senha</Label>
                    <Input
                      id="password_confirm"
                      name="password_confirm"
                      type="password"
                      placeholder="Confirme sua senha"
                      value={formData.password_confirm}
                      onChange={handleInputChange}
                      variant="landing"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-all text-white font-semibold disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? "Criando conta..." : "Criar Conta Gratuitamente"}
                  </Button>

                </form>
              </CardContent>

              <CardFooter className="flex justify-center">
                <p className="text-center text-gray-300 text-sm">
                  Já tem uma conta?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="text-pink-400 hover:text-pink-300 underline font-semibold"
                  >
                    Fazer login
                  </button>
                </p>
              </CardFooter>
            </Card>
          </section>

        </div>
      </main>
    </div>
  );
}
