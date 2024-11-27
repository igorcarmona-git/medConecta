import { CreateUserSchema, deleteUserSchema, UpdatePasswordSchema, UpdateUserSchema, UserIdSchema } from "~/validations/userSchema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import bcrypt from "bcrypt";
import { LoginSchema } from "~/validations/loginSchema";

export const userRouter = createTRPCRouter({
  // Criar usuário
  create: publicProcedure
    .input(CreateUserSchema)
    .mutation(async ({ ctx, input }) => {
      // Verificar se o e-mail já está em uso
      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      });
      if (existingUser) {
        throw new Error("E-mail já está em uso.");
      }

      // Hashear a senha com salt rounds aumentados
      const hashedPassword = await bcrypt.hash(input.password, 12);

      return ctx.db.user.create({
        data: {
          username: input.username,
          password: hashedPassword,
          email: input.email,
        },
      });
    }),

  // Listar usuários (retirar informações sensíveis)
  list: protectedProcedure
  .query(async ({ ctx }) => {
    return ctx.db.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Obter um único usuário por ID (retirar informações sensíveis)
  getById: protectedProcedure
    .input(UserIdSchema)
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
        },
      });
    }),

  // Atualizar usuário
  update: protectedProcedure
    .input(UpdateUserSchema)
    .mutation(async ({ ctx, input }) => {
      // Verificar se o e-mail já está em uso por outro usuário
      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      });
      if (existingUser && existingUser.id !== input.id) {
        throw new Error("E-mail já está em uso por outro usuário.");
      }

      return ctx.db.user.update({
        where: { id: input.id },
        data: {
          username: input.username,
          email: input.email,
        },
      });
    }),

  // Atualizar senha
  updatePassword: protectedProcedure
    .input(UpdatePasswordSchema)
    .mutation(async ({ ctx, input }) => {
      // Verificar se as senhas coincidem
      if (input.password !== input.confirmPassword) {
        throw new Error("As senhas devem ser iguais.");
      }

      // Hashear a nova senha
      const hashedPassword = await bcrypt.hash(input.password, 12);

      return ctx.db.user.update({
        where: { id: input.id },
        data: { password: hashedPassword },
      });
    }),

  // Excluir usuário
  delete: protectedProcedure
    .input(deleteUserSchema)
    .mutation(async ({ ctx, input }) => {
      // Não permitir que o usuário exclua a si mesmo (se aplicável)
      if (ctx.user?.id === input.id) {
        throw new Error("Você não pode excluir sua própria conta.");
      }

      return ctx.db.user.delete({
        where: { id: input.id },
      });
    }),
  findUserByEmail: publicProcedure
    .input(LoginSchema)
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: { email: input.email },
      });
    })
});
