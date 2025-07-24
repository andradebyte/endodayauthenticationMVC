import AuthModel from "../models/AuthModel.js";

export const loginAuth = async (req, res) => {
    const usuario = req.body;
    try {
        const result = await AuthModel.login(usuario);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }

        return res.status(201).json({ result });
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
        return res.status(201).json({ message: result, ok: true });
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
        return res.status(200).json({ message: result.message, ok: result.ok });
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
        return res.status(200).json({message: result.message, ok: result.ok});
    } catch (error) {
        console.error('Erro ao verificar token de senha:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export const validarToken = (req, res) => {
    res.sendStatus(200);
};
