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

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    try {
      await login(formData);
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#050816] via-[#071028] to-[#050816] text-gray-100 flex items-center justify-center p-6">

      <Card className="relative w-full max-w-4xl bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-lg border border-gray-700/40 shadow-2xl rounded-3xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left - Illustration / welcome */}
          <div className="hidden md:flex flex-col items-start justify-center gap-6 p-10 bg-[linear-gradient(135deg,#0f172a66,_#11182733)]">
            <div className="w-full mb-4">
              <HeaderLogin />
            </div>
            <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-3 shadow-lg">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white"><path d="M12 2L15 8H9L12 2Z" fill="white"/></svg>
            </div>
            <h2 className="text-3xl font-extrabold">Bem-vindo ao RelatórioIA</h2>
            <p className="text-gray-300 leading-relaxed">Gere relatórios inteligentes com IA. Faça upload da sua planilha e obtenha insights automaticamente.</p>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• Rápido e seguro</li>
              <li>• Gráficos e previsões</li>
              <li>• Exporta em Excel</li>
            </ul>
          </div>

          {/* Right - Form */}
          <div className="p-8 md:p-12 flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Mobile/Small screens: show header above the form to avoid overlapping */}
              <div className="mb-6 md:hidden">
                <HeaderLogin />
              </div>
              <CardHeader className="text-left px-0 pb-6">
                <CardTitle className="text-2xl font-bold text-gray-100">Acesse sua Conta</CardTitle>
                <CardDescription className="text-gray-400">Entre para começar a gerar relatórios</CardDescription>
              </CardHeader>

              <CardContent className="px-0">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <Label htmlFor="email" className="text-gray-300 font-medium">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-2 bg-gray-900/40 border-gray-700 text-gray-100 focus:ring-2 focus:ring-pink-500 rounded-lg py-3 px-4"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-gray-300 font-medium">Senha</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Sua senha"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="mt-2 bg-gray-900/40 border-gray-700 text-gray-100 focus:ring-2 focus:ring-pink-500 rounded-lg py-3 px-4"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.01] transform-gpu transition-all duration-200 text-white font-semibold shadow-2xl py-3 rounded-lg disabled:opacity-60"
                    disabled={isLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>

                </form>
              </CardContent>

              <CardFooter className="mt-4 px-0">
                <p className="text-center text-gray-400 text-sm">
                  Não tem uma conta?{' '}
                  <button
                    onClick={() => navigate('/register')}
                    className="text-pink-400 hover:text-pink-300 underline font-semibold"
                  >
                    Criar conta
                  </button>
                </p>
              </CardFooter>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
