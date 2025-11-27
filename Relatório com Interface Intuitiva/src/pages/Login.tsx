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
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-gray-100 flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-0 left-0 w-full z-10">
        <HeaderLogin />
      </div>

      <Card className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm border-gray-700/60 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-gray-100">Acesse sua Conta</CardTitle>
          <CardDescription className="text-gray-300">
            Bem-vindo de volta!
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 font-semibold">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-gray-900/50 border-gray-700 text-gray-100 focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 font-semibold">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Sua senha"
                value={formData.password}
                onChange={handleInputChange}
                className="bg-gray-900/50 border-gray-700 text-gray-100 focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-all text-white font-semibold disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-center text-gray-300 text-sm">
            Não tem uma conta?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-pink-400 hover:text-pink-300 underline font-semibold"
            >
              Criar conta
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
