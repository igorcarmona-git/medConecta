import { useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { api } from "~/utils/api";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const loginMutation = api.auth.login.useMutation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await loginMutation.mutateAsync(formData);

      setSuccessMessage(result.message || "Login bem-sucedido!");
      setIsModalOpen(true);

      // Redireciona após fechar o modal de sucesso
      setTimeout(() => {
        setIsModalOpen(false);
        router.push("/modules");
      }, 3000);
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message || "Erro ao fazer login. Tente novamente."
      );
      setIsModalOpen(true);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      {/* Modal de Feedback */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{errorMessage ? "Erro" : "Sucesso"}</DialogTitle>
          </DialogHeader>
          <p className="text-sm">
            {errorMessage ? (
              <span className="text-red-500">{errorMessage}</span>
            ) : (
              <span className="text-green-500">{successMessage}</span>
            )}
          </p>
          <Button
            className="mt-4"
            onClick={() => setIsModalOpen(false)}
            variant={errorMessage ? "destructive" : "default"}
          >
            Fechar
          </Button>
        </DialogContent>
      </Dialog>

      {/* Formulário de Login */}
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button
              type="submit"
              className="flex w-2/3 mx-auto py-3"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Não tem uma conta?{" "}
            <Link href={"/register"}
              className="font-semibold text-blue-500 hover:underline cursor-pointer"
            >
              Registre-se
            </Link>
          </p>
          <p className="mt-8 text-center text-xs text-gray-600">
            Esqueceu sua senha?{" "}
            <Link href="/forgotPassword" className="font-semibold text-blue-500 hover:underline cursor-pointer">
              Clique aqui
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
