import pool from '../config/db.js';
import conversorDificuldade from '../utils/conversorDificuldade.js';

export default class QuestionarioModel {

    static async questionario(caminho, dificuldade) {

        const dcn = conversorDificuldade(dificuldade);

        if (!caminho || !dcn) {
            return { error: 'Caminho ou dificuldade não fornecidos.' };
        }

        try {
            // 1) Busca todas as perguntas
            const queryPergunta = `SELECT * FROM pergunta where caminho_id = ? and dificuldade = ?;`;
            const [rowsPerguntas] = await pool.execute(queryPergunta, [caminho, dcn]);

            // Se não houver nenhuma pergunta, retorna array vazio logo
            if (rowsPerguntas.length === 0) {
                return [];
            }

            const perguntasComRespostas = await Promise.all(
                rowsPerguntas.map(async (pergunta) => {
                    const queryResposta = `
            SELECT * 
            FROM resposta 
            WHERE pergunta_id = ?;
          `;
                    // busca respostas desta pergunta
                    const [rowsRespostas] = await pool.execute(queryResposta, [pergunta.id]);

                    // devolve um novo objeto que “anexa” a chave 'respostas' à pergunta
                    return {
                        ...pergunta,
                        respostas: rowsRespostas
                    };
                })
            );

            return perguntasComRespostas;

        } catch (error) {
            console.error('Erro ao acessar banco de questões:', error);
            return { error: 'Erro ao acessar banco de questões' };
        }

    }



    static async questionarioRandom(caminho) {
        try {
            // 1) Busca todas as perguntas
            const queryPergunta = `SELECT * FROM pergunta where caminho_id = ?;`;
            const [rowsPerguntas] = await pool.execute(queryPergunta, [caminho]);

            // Se não houver nenhuma pergunta, retorna array vazio logo
            if (rowsPerguntas.length === 0) {
                return [];
            }

            const perguntasComRespostas = await Promise.all(
                rowsPerguntas.map(async (pergunta) => {
                    const queryResposta = `
            SELECT * 
            FROM resposta 
            WHERE pergunta_id = ?;
          `;
                    // busca respostas desta pergunta
                    const [rowsRespostas] = await pool.execute(queryResposta, [pergunta.id]);

                    // devolve um novo objeto que “anexa” a chave 'respostas' à pergunta
                    return {
                        ...pergunta,
                        respostas: rowsRespostas
                    };
                })
            );

            return perguntasComRespostas;
        } catch (error) {
            console.error('Erro ao acessar banco de questões:', error);
            return { error: 'Erro ao acessar banco de questões' };
        }
    }
}
