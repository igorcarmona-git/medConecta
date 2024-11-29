import Head from "next/head";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/login"); // Redireciona para a página de login
  };

  return (
    <>
      <Head>
        <title>Med Conecta</title>
        <meta name="description" content="Med Conecta App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col">
        {/* Conteúdo Principal */}
        <main className="flex items-center justify-center">
          <Card className="w-full max-w-2xl p-2 shadow-lg border border-blue-500">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-extrabold text-blue-600 animate-pulse">
                Bem-vindo ao MedConecta
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-gray-600 mb-8 mt-8">
                Conectamos profissionais da saúde com pacientes de forma simples e eficaz.
              </p>
              <Button
                variant="default"
                className="px-6 py-4 text-lg font-bold w-full max-w-sm mx-auto"
                onClick={handleStart}
              >
                Iniciar
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
