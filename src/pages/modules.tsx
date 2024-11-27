// pages/index.tsx

import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function Modules() {
  const router = useRouter();

  const modules = [
    {
      name: "Agendamento de Consultas",
      icon: "🗓️",
      route: "/modules/agendamento",
    },
    {
      name: "Painel de Atendimento",
      icon: "📋",
      route: "/modules/painel",
    },
    {
      name: "Relatórios",
      icon: "📊",
      route: "/modules/relatorios",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-900">Bem-vindo ao Sistema</h1>
        <p className="text-blue-700">Selecione um módulo para continuar</p>
      </div>

      {/* Módulos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <Card
            key={index}
            className="w-56 h-56 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(module.route)}
          >
            <CardHeader className="flex flex-col items-center justify-center">
              <div className="text-4xl">{module.icon}</div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-center text-blue-900 font-semibold">
                {module.name}
              </CardTitle>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
