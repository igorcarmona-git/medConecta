import { env } from "~/env";
import jwt from "jsonwebtoken";

/**
 * Gera um token JWT para o usuário.
 * @param user - Dados do usuário, como ID, nome e e-mail.
 * @returns Um token JWT válido.
 */
function generateToken(user: { id: number; username: string; email: string }) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    env.SECRETKEY,
    { expiresIn: "1m" }
  );
}

/**
 * Valida o token JWT.
 * @param token - O token JWT enviado pela requisição.
 * @returns Os dados do usuário se o token for válido, ou null se inválido.
 */
function validateToken(token: string) {
  try {
    // Verifica e decodifica o token usando a chave secreta
    const decoded = jwt.verify(token, env.SECRETKEY);
    console.log("Token decodificado:", decoded);
    return decoded as { id: number; username: string; email: string };
  } catch (error: any) {
    console.error("Token inválido:", error.message);
    return null;
  }
}

export { generateToken, validateToken };
