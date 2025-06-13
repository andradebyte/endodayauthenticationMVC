import { verifyToken } from '../utils/jwt.js';

export const autenticarJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido ou mal formatado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.usuario = decoded; // anexa os dados do token no request
    next(); // segue para a rota protegida
  } catch (error) {
    console.error('Erro ao verificar token:', error.message);
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
};
