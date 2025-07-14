import pool from "../config/db.js";

export default class VerificacaoDadosModel {
    static async verificarEmail(email) {

        if (!email) {
            return { error: 'Email é obrigatório' };
        }

        const query = 'SELECT * FROM usuarios WHERE email = ?';

        try {
            const [rows] = await pool.execute(query, [email]);

            if (rows.length === 0) {
                return { error: 'Email não encontrado.' };
            }

            return { message: 'Email verificado com sucesso.', exists: true };

        } catch (error) {
            return { error: 'Erro ao verificar email', exists: false  };
        }
    }

    static async verificarUsuarioID(usuario_id){
        const query = 'SELECT * FROM usuarios WHERE usuario_id = ?';

        try {
            const [rows] = await pool.execute(query, [usuario_id]);

            if (rows.length === 0) {
                return { error: 'Nenhum usuário encontrado.' };
            }

            return { message: 'Email verificado com sucesso.', exists: true };

        } catch (error) {
            return { error: 'Erro ao verificar email', exists: false  };
        }
    }
};