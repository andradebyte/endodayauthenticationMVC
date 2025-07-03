import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function generateToken(usuario) {
    return jwt.sign({
        usuario_id: usuario.usuario_id,
        nome_completo: usuario.nome_completo,
        email: usuario.email,
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        throw new Error('Token inválido ou expirado');
    }
}