import { ReactNode } from "react";
import Link from "next/link";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-400 shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="container flex justify-between items-center py-2 px-8">
          {/* Logo */}
          <div className="text-2xl font-bold text-white">
            <Link href="/">MedConecta</Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex items-center justify-center">
        {/* Garantir que o conteúdo esteja centralizado e sem overflow */}
        <div className="container mx-auto max-h-full overflow-auto p-2">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-600 to-blue-400 text-white fixed bottom-0 left-0 right-0">
        <div className="container mx-auto py-2 text-center">
          <p className="text-lg font-medium">MedConecta - Conectando a Saúde</p>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} MedConecta. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
