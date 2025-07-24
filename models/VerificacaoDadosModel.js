import pool from "../config/db.js";

export default class VerificacaoDadosModel {
    static async verificarEmail(email) {
    if (!email) {
        return { exists: null, message: 'Email é obrigatório' };
    }

    const query = 'SELECT * FROM usuarios WHERE email = ?';

    try {
        const [rows] = await pool.execute(query, [email]);

        if (rows.length === 0) {
            return { exists: false, message: 'Email pode ser utilizado!' };
        }

        return { exists: true, message: 'Email não pode ser utilizado.' };
    } catch (error) {
        console.error("Erro ao verificar email no banco:", error);
        return { exists: null, message: 'Erro ao verificar email, tente novamente mais tarde.' };
    }
}


    static async verificarUsuarioID(usuario_id) {
        if (!usuario_id) {
            return { exists: false, message: 'ID do usuário é obrigatório.' };
        }
        const query = 'SELECT * FROM usuarios WHERE usuario_id = ?';
        try {
            const [rows] = await pool.execute(query, [usuario_id]);
            if (rows.length === 0) {
                return { exists: false, message: 'Nenhum usuário encontrado.' };
            }
            return { exists: true, message: 'Usuário encontrado com sucesso.' };
        } catch (error) {
            console.error("Erro ao verificar usuário no banco:", error);
            return { exists: false, message: 'Erro ao verificar usuário.' };
        }
    }

};