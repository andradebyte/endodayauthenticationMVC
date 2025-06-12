import { hashPassword } from '../utils/hash.js';
import pool from '../config/db.js';
import { mandarEmail } from '../utils/mandarEmail.js';
import { verifyToken } from '../utils/jwt.js';


export default class UsuarioModel {

    //Cadastro de usuário

    static async criar(usuario) {

        // Desestruturação do objeto usuario
        const { nome_completo, email, usuario_id, senha } = usuario;

        // Para query
        const query = 'INSERT INTO usuarios (nome_completo, email, usuario_id, senha) VALUES (?, ?, ?, ?)';

        try {
            const hashedPassword = await hashPassword(senha);
            const [result] = await pool.execute(query, [nome_completo, email, usuario_id, hashedPassword]);
            if (result.affectedRows === 0) {
                return { error: 'Erro ao cadastrar usuário' };
            }
            return { message: 'Usuário cadastrado com sucesso' };
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            return { error: 'Erro ao cadastrar usuário' };
        }
    }

    static async deleteUsuario(id) {
        const { usuario_id } = id;
        const query = 'DELETE FROM usuarios WHERE usuario_id = ?';

        try {
            const [result] = await pool.execute(query, [usuario_id])

            if (result.affectedRows === 0) {
                return { error: 'Usuário não encontrado' };
            }

            return { message: 'Conta deletada com sucesso' };
        } catch (error) {
            console.error('Erro ao deletar conta:', error);
            return { error: 'Erro ao deletar conta' };
        }
    }

    // Atualiza o nome do usuário

    static async novoNome(usuario) {

        const { usuario_id, nome_completo, token } = usuario;
        
        const tokenVerificado = verifyToken(token);

        if (!tokenVerificado) {
            console.error('Erro ao atualizar nome.');
            return { error: 'Erro ao atualizar nome.' };
        }

        const query = 'UPDATE usuarios SET nome_completo = ? WHERE usuario_id = ?';

        try {
            const [result] = await pool.execute(query, [nome_completo, usuario_id]);

            if (result.affectedRows === 0) {
                return { error: 'Usuário não encontrado ou nome já está em uso' };
            }

            return { message: 'Nome atualizado com sucesso' };
        } catch (error) {
            console.error('Erro ao atualizar nome:', error);
            return { error: 'Erro ao atualizar nome' };
        }
    }

    // Atualiza o email do usuário, verificando se o email já está em uso

    static async novaEmail(usuario) {
        const { usuario_id, email, verifyToken } = usuario;

        const query = 'UPDATE usuarios SET email = ? WHERE usuario_id = ?';

        if (!email || !usuario_id) {
            return { error: 'Email e ID do usuário são obrigatórios' };
        }

        try {

            const [result] = await pool.execute(query, [email, usuario_id]);

            if (result.affectedRows === 0) {
                return { error: 'Usuário não encontrado ou email já está em uso' };
            }

            return { message: 'Email atualizado com sucesso' };

        } catch (error) {
            console.error('Erro ao atualizar email:', error);
            return { error: 'Erro ao atualizar email' };
        }
    }

    //Quando verificar o token, verificar se o usuário existe e se a senha é válida

    static async novaSenha(usuario) {
        const { email, senha } = usuario;

        const query = 'UPDATE usuarios SET senha = ? WHERE email = ?';

        if (!senha || !email) {
            return { error: 'Problema ao alterar senha.' };
        }

        try {
            const hashedPassword = await hashPassword(senha);
            const [result] = await pool.execute(query, [hashedPassword, email]);

            if (result.affectedRows === 0) {
                return { error: 'Usuário não encontrado ou senha já está em uso' };
            }

            return { message: 'Senha atualizada com sucesso' };

        } catch (error) {
            console.error('Erro ao atualizar senha:', error);
            return { error: 'Erro ao atualizar senha' };
        }

    }

}
