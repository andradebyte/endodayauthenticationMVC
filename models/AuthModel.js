import pool from "../config/db.js";
import bcrypt from "bcrypt";
import { isPasswordValid } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { gerarSenha } from "../utils/geradorSenha.js"; // ou onde estiver
import { mandarEmail } from "../utils/mandarEmail.js"; // seu util de e-mail

export default class AuthModel {

    static async login(usuario) {
        const { email, senha } = usuario;

        if (!email || !senha) {
            return { error: 'Email e senha são obrigatórios' }
        }

        const query = 'SELECT * FROM usuarios WHERE email = ?';

        try {
            const [rows] = await pool.execute(query, [email])

            if (rows.length === 0) {
                return { error: 'Erro ao buscar usuário.' };
            }

            const usuario = rows[0];
            const isSenhaValida = await isPasswordValid(senha, usuario.senha);

            if (!isSenhaValida) {
                return { error: 'Senha incorreta. Tente novamente ou clique em "Esqueceu a senha?" para escolher outra.' };
            }

            // Gerar token de autenticação

            const token = await generateToken(usuario);
            if (!token) {
                return { error: 'Erro ao gerar token.' };
            }

            return {
                usuario_id: usuario.usuario_id,
                nome_completo: usuario.nome_completo,
                email: usuario.email,
                token,
            };

        } catch (error) {
            console.error('Erro ao realizar login:', error);
            return { error: 'Erro ao realizar login' };
        }
    }

    // Responsável por criar o token de email e enviar o email com o token

    static async criarTokenEmail(usuario) {
        //Responsavel por enviar o email com o token para troca de email com o novo email
        const { novoEmail } = usuario;

        const token = await gerarSenha();
        const tokenCriptografado = await bcrypt.hash(token, 10); // Criptografa o token gerado
        const html = `<b>Token gerada: ${token}</b>`;
        const subject = 'Alterar Email';

        const expires_at = new Date(Date.now() + 30 * (60 * 1000)); // 5 minutos

        try {
            // Atualiza o token e a data de expiração no banco de dados
            await pool.execute('INSERT INTO emails_token (email, token, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token = ?, expires_at = ?', [novoEmail, tokenCriptografado, expires_at, tokenCriptografado, expires_at]);

            await mandarEmail(novoEmail, subject, html);
            return 'Email enviado com sucesso!';
        } catch (error) {
            console.error('Erro ao enviar e-mail:', error);
            return { error: 'Erro ao enviar e-mail' };
        }

    }

    // Verifica o token de email

    static async verificarTokenEmail(usuario) {
        const { novoEmail, token } = usuario;

        try {
            const [rows] = await pool.execute('SELECT token FROM emails_token WHERE email = ? AND expires_at > NOW()', [novoEmail]);

            if (rows.length === 0) {
                return { ok: false, error: 'Token inválido ou expirado' };
            }

            const tokenCriptografado = rows[0].token;
            const isTokenValido = await bcrypt.compare(token, tokenCriptografado);

            if (rows.length === 0) {
                return { error: 'Token inválido ou expirado' };
            }

            if (!isTokenValido) {
                return { error: 'Token inválido ou expirado' };
            }

            // Deleta o token após uso
            // await pool.execute('DELETE FROM emails_token WHERE email = ?', [novoEmail]);

            // Se o token for válido, leve-o para a página de redefinição de senha
            return { mensagem: 'Token válido', ok: true, token: token };
        } catch (error) {
            console.error(error);
            return { error: 'Erro no servidor, tente novamente.' };
        }
    }

    // Responsável por criar o token de redefinição de senha e enviar o email com o token

    static async criarTokenSenha(usuario) {
        const { email } = usuario;
    
        const token = await gerarSenha();
        const html = `<b>Token gerada: ${token}</b>`;
        const subject = 'Resetar Senha';
    
        const expires_at = new Date(Date.now() + 60 * 60 * 1000) // 1 hora
            .toISOString()
            .slice(0, 19)
            .replace('T', ' '); // formato compatível com DATETIME no MySQL
    
        try {
            await pool.execute(
                `INSERT INTO senhas_token (email, token, expires_at)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE token = ?, expires_at = ?`,
                [email, token, expires_at, token, expires_at]
            );
    
            await mandarEmail(email, subject, html);
            return { ok: true, mensagem: 'Email enviado com sucesso!' };
        } catch (error) {
            console.error('Erro ao enviar e-mail:', error);
            return { error: 'Erro ao enviar e-mail' };
        }
    }

    // Verifica o token de redefinição de senha

    static async verificarTokenSenha(usuario) {
        const { email, token } = usuario;
    
        if (!token) return { error: 'Token inválido ou expirado' };
    
        try {
            const [rows] = await pool.execute(
                'SELECT token FROM senhas_token WHERE email = ? AND expires_at > NOW() ORDER BY expires_at DESC LIMIT 1',
                [email]
            );
    
            if (rows.length === 0) {
                return { error: 'Token inválido ou expirado' };
            }
    
            const tokenSalvo = rows[0].token;
    
            if (token !== tokenSalvo) {
                return { error: 'Token inválido ou expirado' };
            }
    
            // Deleta o token após uso
            await pool.execute('DELETE FROM senhas_token WHERE email = ?', [email]);
    
            return { mensagem: 'Token válido', ok: true };
        } catch (error) {
            console.error(error);
            return { error: 'Erro no servidor, tente novamente.' };
        }
    }
    
}