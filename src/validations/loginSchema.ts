import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email({ message: "Formato de e-mail inválido." }),
    password: z
        .string()
        .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});
