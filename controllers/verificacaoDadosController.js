import VerificacaoDadosModel from "../models/VerificacaoDadosModel.js";

export const verificarEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const result = await VerificacaoDadosModel.verificarEmail(email);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(200).json({ message: result.message, exists: result.exists });
    } catch (error) {
        console.error('Erro ao verificar email:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export const verificarUsuarioID = async (req, res) => {
    const { usuario_id } = req.body;

    try {
        const result = await VerificacaoDadosModel.verificarUsuarioID(usuario_id);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(200).json({ message: result.message, exists: result.exists });
    } catch (error) {
        console.error('Erro ao verificar usuário ID:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}