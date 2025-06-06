import { verifyToken } from './utils/jwt.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import authRoutes from './routes/authRoutes.js';
import questionarioRoutes from './routes/questionarioRoutes.js';
import express from 'express';
import cors from 'cors';

const PORT = 9323;

const app = express();
app.use(cors());
app.use(express.json());

app.use('/questionario', questionarioRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/auth', authRoutes);

// app.post('/verificar', (req, res) => {
//     const { token } = req.body;
//     if (!token) {
//         return res.status(400).json({ error: 'Problemas de autenticação. Faça login novamente.' });
//     }

//     try {
//         const decoded = verifyToken(token);

//         if (!decoded) {
//             return res.status(401).json({ error: 'Problemas de autenticação. Faça login novamente.' });
//         }

//         return res.status(200).json({ usuario: decoded });
//     } catch (error) {
//         console.error('Erro ao verificar token:', error);
//         return res.status(400).json({ error: 'Problema de autenticação. Faça login novamente.' });
//     }
// });

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});