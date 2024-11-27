import { z } from "zod";

// Definição do esquema para um usuário
export const CreateUserSchema = z.object({
  username: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." })
    .transform((val) => val.toLowerCase()), 
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  email: z.string().email({ message: "Formato de e-mail inválido." }),
});

export const UpdatePasswordSchema = z.object({
  id: z.number().int("ID inválido."),
  password: z
      .string()
      .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  confirmPassword: z
      .string()
      .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export const UpdateUserSchema = z.object({
  id: z.number().int("ID inválido."),
  username: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." })
    .transform((val) => val.toLowerCase()),
  email: z.string().email({ message: "Formato de e-mail inválido." }),
})

export const UserIdSchema = z.object({
  id: z.number().int("ID inválido."),
})

export const deleteUserSchema = z.object({
  id: z.number().int("ID inválido."),
})

// Tipagem derivada do UserSchema
export type UserType = z.infer<typeof CreateUserSchema>;