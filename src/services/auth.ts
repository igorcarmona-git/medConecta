
const SECRET_KEY = process.env.SECRETKEY;
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
    SECRET_KEY,
    { expiresIn: "3h" } 
  );
}

function validateToken(token: string) {
  try {
    // Verifica e decodifica o token usando a chave secreta
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded as { id: number; username: string; email: string };
  } catch (error: any) {
    console.error("Token inválido:", error.message);
    return null;
  }
}

export { generateToken, validateToken };