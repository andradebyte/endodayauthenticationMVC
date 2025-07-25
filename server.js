import { autenticarJWT } from "./middleware/autenticarJWT.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import questionarioRoutes from "./routes/questionarioRoutes.js";
import verificacaoDadosRoutes from "./routes/verificacaoDadosRoutes.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const PORT = 9323;

const app = express();
app.use(cors());
app.use(express.json());

app.use('/questionario', questionarioRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/auth', authRoutes);
app.use('/verificacao-dados', verificacaoDadosRoutes);

app.get('/testeJWT',autenticarJWT, (req, res) => {
    res.send('Bem-vindo à API de Questionários!');
});

app.get('/teste', (req, res) => {
    res.send('Bem-vindo!');
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(process.env.MAIL_HOST);
    console.log(process.env.MAIL_USER);
    console.log(process.env.MAIL_PASSWORD);

});