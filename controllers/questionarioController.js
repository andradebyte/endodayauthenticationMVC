// controllers/questionarioController.js
import QuestionarioModel from "../models/QuestionarioModel.js";

export const questionario = async (req, res) => {
    const { caminho, dificuldade, usuario_id } = req.params;

    if (!caminho || !dificuldade || !usuario_id) {
        return res.status(400).json({ error: 'Caminho ou dificuldade não fornecidos.' });
    }

    try {
        const rows = await QuestionarioModel.questionario(usuario_id, caminho, dificuldade);

        if (rows.error) {
            return res.status(500).json({ error: rows.error });
        }

        // Se o array vier vazio, nenhuma combinação foi encontrada
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Nenhuma pergunta ou resposta encontrada.' });
        }

        // Caso contrário, devolvemos o array completo (cada elemento terá campos de p.* e de r.*)
        return res.status(200).json(rows);
    } catch (error) {
        console.error('Erro no controller questionario:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
};


export const questionarioRandom = async (req, res) => {

    const caminho = req.params.caminho;

    if (!caminho) {
        return res.status(400).json({ error: 'Caminho não fornecido.' });
    }

    try {
        const rows = await QuestionarioModel.questionarioRandom(caminho);

        if (rows.error) {
            return res.status(500).json({ error: rows.error });
        }

        // Se o array vier vazio, nenhuma combinação foi encontrada
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Nenhuma pergunta ou resposta encontrada.' });
        }

        // Caso contrário, devolvemos o array completo (cada elemento terá campos de p.* e de r.*)
        return res.status(200).json(rows);
    } catch (error) {
        console.error('Erro no controller questionarioRandom:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
};