import UsuarioModel from '../models/UsuarioModel.js';
import { mandarEmail } from '../utils/mandarEmail.js';

export const criarUsuario = async (req, res) => {
    const usuario = req.body;
    try {
        const result = await UsuarioModel.criar(usuario);

        if (result.error) {
            return res.status(400).json({ error: result.error });
        }

        // Enviar email de confirmação
        await mandarEmail(usuario.email, 'Cadastro realizado com sucesso!',
            `<h1>Bem-vindo ao Endoday!</h1><p>Olá ${usuario.nome_completo}, seu cadastro foi um sucesso!</p>`
        ).catch((err) => {
            console.warn('⚠️ Falha ao enviar e-mail:', err.message);
        });


        return res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export const deletarUsuario = async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const result = await UsuarioModel.deleteUsuario({ usuario_id });
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export const novoNomeUsuario = async (req, res) => {
    const usuario = req.body;
    try {
        const result = await UsuarioModel.novoNome(usuario);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error('Erro ao atualizar nome:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export const novoEmailUsuario = async (req, res) => {
    const usuario = req.body;
    try {
        const result = await UsuarioModel.novaEmail(usuario);

        if (result.error) {
            return res.status(400).json({ error: result.error });
        }

        // Enviar email de confirmação
        await mandarEmail(usuario.email, 'Email redefinido com sucesso!',
            `<h1>Email redefinido com sucesso!</h1><p>Olá, seu email foi redefinido com sucesso!</p>`
        ).catch((err) => {
            console.warn('⚠️ Falha ao enviar e-mail:', err.message);
        });

        return res.status(200).json({ message: 'Email atualizada com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar email:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export const novaSenhaUsuario = async (req, res) => {
    const usuario = req.body;
    try {
        const result = await UsuarioModel.novaSenha(usuario);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(200).json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar senha:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

export const verificarEmail = async (req, res) => {
    const { email } = req.params;

    if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório' });
    }

    try {

        const usuario = await UsuarioModel.emailExiste(email);

        return res.status(200).json({ exists: !!usuario });

    } catch (error) {
        console.error('Erro ao verificar email:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}