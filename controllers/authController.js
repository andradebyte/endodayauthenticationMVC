import AuthModel from '../models/authModel.js';
import { verifyToken } from '../utils/jwt.js';

export const loginAuth = async (req, res) => {
    const usuario = req.body;
    try {
        const result = await AuthModel.login(usuario);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(201).json({ usuario: result });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export const criarTokenEmailAuth = async (req, res) => {
    const usuario = req.body;
    try {
        const result = await AuthModel.criarTokenEmail(usuario);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(201).json({ message: 'Token de email criado com sucesso', token: result });
    } catch (error) {
        console.error('Erro ao criar token de email:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export const verificarTokenEmailAuth = async (req, res) => {
    const usuario = req.body;
    try {
        const result = await AuthModel.verificarTokenEmail(usuario);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(200).json({ message: 'Token de email verificado com sucesso', usuario: result });
    } catch (error) {
        console.error('Erro ao verificar token de email:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export const criarTokenSenhaAuth = async (req, res) => {
    const usuario = req.body;
    try {
        const result = await AuthModel.criarTokenSenha(usuario);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(201).json({ message: 'Token de senha criado com sucesso', token: result });
    } catch (error) {
        console.error('Erro ao criar token de senha:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export const verificarTokenSenhaAuth = async (req, res) => {
    const usuario = req.body;
    try {
        const result = await AuthModel.verificarTokenSenha(usuario);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(200).json({ message: 'Token de senha verificado com sucesso', usuario: result });
    } catch (error) {
        console.error('Erro ao verificar token de senha:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export const verificarJWT = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: 'Problemas de autenticação. Faça login novamente.' });
    }

    try {
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ error: 'Problemas de autenticação. Faça login novamente.' });
        }

        return res.status(200).json(decoded);
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        return res.status(400).json(error.error);
    }
}