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
      <div className="min-h-screen flex flex-col">
        {/* Menu */}
        <header className="bg-white">
          <div className="flex justify-center items-center h-32">
            <div className="w-80 h-40 flex items-center justify-center">
              <Image
                src="/images/medconecta.png"
                alt="Med Conecta imagem"
                width={400}
                height={400}
                className="object-contain"
              />
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="flex-grow flex items-center justify-center">
          <Card className="w-full max-w-2xl p-8 shadow-lg border border-blue-500">
            <CardHeader className="text-center">
              <CardTitle className="text-5xl font-extrabold text-blue-600 animate-pulse">
                Bem-vindo ao MedConecta
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-gray-600 mb-8">
                Conectamos profissionais da saúde com pacientes de forma simples e eficaz.
              </p>
              <Button
                variant="default"
                className="px-6 py-3 text-lg font-bold w-full max-w-sm mx-auto"
                onClick={handleStart}
              >
                Iniciar
              </Button>
            </CardContent>
          </Card>
        </main>

        {/* Rodapé */}
        <footer className="bg-gray-100 py-6">
          <div className="container mx-auto text-center text-gray-600">
            &copy; {new Date().getFullYear()} Med Conecta. Todos os direitos reservados.
          </div>
        </footer>
      </div>
    </>
  );
}
