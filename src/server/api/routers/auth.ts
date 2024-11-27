import { LoginSchema } from "~/validations/loginSchema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import bcrypt from "bcrypt";
import { generateToken } from "~/services/auth";
import { User } from "@prisma/client";

// Auth Router
export const authRouter = createTRPCRouter({
  // Rota de login
  login: publicProcedure
    .input(LoginSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      // Verifica se o usuário existe
      const user: User | null = await ctx.db.user.findUnique({
        where: {
          email,
        },
      });

      
      const errorMessage = "Credenciais inválidas.";
      if (!user) {
        throw new Error(errorMessage);
      }

      // Compara a senha com o hash armazenado
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error(errorMessage);
      }

      // Gera um token de autenticação
      const token = generateToken({
        id: user.id,
        username: user.username,
        email: user.email,
      });

      return {
        message: "Login bem-sucedido!",
        token,
      };
    }),
});
