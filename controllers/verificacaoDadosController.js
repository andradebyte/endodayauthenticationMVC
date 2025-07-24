import VerificacaoDadosModel from "../models/VerificacaoDadosModel.js";

export const verificarEmail = async (req, res) => {
    const { email } = req.query;
    try {
        const result = await VerificacaoDadosModel.verificarEmail(email);
        if (result.exists === null) {
            return res.status(400).json({ exists: null, message: result.message });
        }
        if (result.exists) {
            return res.status(409).json({ exists: true, message: result.message });
        }
        return res.status(200).json({ exists: false, message: result.message });
    } catch (error) {
        console.error('Erro ao verificar email:', error);
        return res.status(500).json({ exists: null, message: 'Erro interno do servidor' });
    }
};

export const verificarUsuarioID = async (req, res) => {
    const { usuario_id } = req.query;
    try {
        const result = await VerificacaoDadosModel.verificarUsuarioID(usuario_id);
        if (result.exists === false) {
            return res.status(404).json({ exists: false, message: result.message });
        }
        return res.status(200).json({ exists: true, message: result.message });
    } catch (error) {
        console.error('Erro ao verificar usuário ID:', error);
        return res.status(500).json({ exists: false, message: 'Erro interno do servidor' });
    }
};