import { initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "~/server/db";
import { validateToken } from "~/services/auth";

/**
 * 1. CONTEXTO
 *
 * Esta seção define os "contextos" que estão disponíveis na API backend.
 * Estes permitem que você acesse informações ao processar uma requisição, como o banco de dados, a sessão, etc.
 */
type CreateContextOptions = {
  req: CreateNextContextOptions["req"];
  res: CreateNextContextOptions["res"];
}

/**
 * Este helper gera os "internos" para um contexto tRPC. Se necessário, você pode exportá-lo
 * daqui.
 *
 * Exemplos de situações em que você pode precisar dele:
 * - testes, para que não precisemos simular o req/res do Next.js
 * - `createSSGHelpers` do tRPC, onde não temos req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
const createInnerTRPCContext = (_opts: CreateContextOptions) => {
  return {
    db,
    req: _opts.req,
    res: _opts.res,
  };
};

/**
 * Este é o contexto real que você usará no seu router. Ele será utilizado para processar
 * cada requisição que passar pelo seu endpoint tRPC.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = (_opts: CreateNextContextOptions) => {
  return createInnerTRPCContext({
    // Se vocé quiser passar algo para o contexto, vocé pode fazer isso aqui
    req: _opts.req,
    res: _opts.res,
  });
};

/**
 * 2. INICIALIZAÇÃO
 *
 * Aqui é onde a API tRPC é inicializada, conectando o contexto e o transformer. Também tratamos
 * os ZodErrors para que você tenha segurança de tipos no frontend caso o seu procedimento falhe 
 * devido a erros de validação no backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROTEADOR & PROCEDIMENTO (A PARTE IMPORTANTE)
 *
 * Estes são os componentes que você usa para construir sua API tRPC. Você deve importá-los com frequência no
 * diretório "/src/server/api/routers".
 */

/**
 * Assim é como você cria novos roteadores e sub-roteadores na sua API tRPC.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware para medir o tempo de execução do procedimento e adicionar um atraso artificial no desenvolvimento.
 *
 * Você pode remover isso se não gostar, mas pode ajudar a identificar efeitos indesejados de waterfall simulando
 * a latência de rede que ocorreria em produção, mas não no desenvolvimento local.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // atraso artificial no dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} levou ${end - start}ms para executar`);

  return result;
});

/**
 * Middleware para verificar a autenticação.
 * Verifica se o token JWT é válido.
 */
const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  const token = ctx.req.headers["authorization"]?.split(" ")[1]; // Obtém o token do header Authorization
  if (!token) {
    throw new Error("Token não fornecido.");
  }

  const sessionUser = validateToken(token); // Valida o token
  if (!sessionUser) {
    throw new Error("Usuário não autenticado.");
  }

  // Adiciona o usuário ao contexto para uso posterior
  ctx.user = sessionUser;
  return next();
});

/**
 * Procedimento Público (não autenticado)
 *
 * Este é o componente base que você usa para criar novas consultas e mutações na sua API tRPC. Ele não
 * garante que o usuário que está fazendo a consulta está autorizado, mas você ainda pode acessar os dados da
 * sessão do usuário se ele estiver logado.
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * 2. PROCEDIMENTO PROTEGIDO (REQUIRIDO PARA AUTENTICAÇÃO)
 * Este procedimento será usado nas rotas que exigem autenticação.
 */
export const protectedProcedure = t.procedure.use(isAuthenticated);
