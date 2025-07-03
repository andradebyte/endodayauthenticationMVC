import pool from "../config/db.js";
import conversorDificuldade from "../utils/conversorDificuldade.js";

export default class QuestionarioModel {

    static async questionario(usuario_id, caminho, dificuldade, batchSize = 5) {
        // se você ainda precisar converter “fácil”, “médio” etc. para número
        if (typeof dificuldade === 'string') {
            dificuldade = conversorDificuldade(dificuldade);
        }

        try {
            // 1) pega as não vistas
            const queryUnasked = `
        SELECT p.id
          FROM pergunta p
          LEFT JOIN usuario_pergunta up
            ON up.pergunta_id = p.id
           AND up.usuario_id = ?
         WHERE p.caminho_id = ?
           AND p.dificuldade = ?
           AND up.usuario_id IS NULL
         ORDER BY RAND()
         LIMIT ${batchSize}
      `;
            const [unaskedRows] = await pool.execute(
                queryUnasked,
                [usuario_id, caminho, dificuldade]
            );
            const unaskedIds = unaskedRows.map(r => r.id);

            let selectedIds;

            if (unaskedIds.length === batchSize) {
                selectedIds = unaskedIds;

            } else if (unaskedIds.length > 0) {
                // 2) preenche com já vistas
                const needed = batchSize - unaskedIds.length;
                const queryAsked = `
          SELECT p.id
            FROM pergunta p
            JOIN usuario_pergunta up
              ON up.pergunta_id = p.id
             AND up.usuario_id = ?
           WHERE p.caminho_id = ?
             AND p.dificuldade = ?
           ORDER BY RAND()
           LIMIT ${needed}
        `;
                const [askedRows] = await pool.execute(
                    queryAsked,
                    [usuario_id, caminho, dificuldade]
                );
                selectedIds = unaskedIds.concat(askedRows.map(r => r.id));

            } else {
                // 3) esgotou: limpa histórico e sorteia tudo de novo
                await pool.execute(
                    `DELETE up
             FROM usuario_pergunta up
             JOIN pergunta p ON p.id = up.pergunta_id
            WHERE up.usuario_id = ?
              AND p.caminho_id = ?
              AND p.dificuldade = ?`,
                    [usuario_id, caminho, dificuldade]
                );

                const queryAll = `
          SELECT p.id
            FROM pergunta p
           WHERE p.caminho_id = ?
             AND p.dificuldade = ?
           ORDER BY RAND()
           LIMIT ${batchSize}
        `;
                const [allRows] = await pool.execute(
                    queryAll,
                    [caminho, dificuldade]
                );
                selectedIds = allRows.map(r => r.id);
            }

            if (!selectedIds.length) return [];

            // 4) marca no histórico
            await Promise.all(
                selectedIds.map(id =>
                    pool.execute(
                        `INSERT IGNORE INTO usuario_pergunta (usuario_id, pergunta_id)
             VALUES (?, ?)`,
                        [usuario_id, id]
                    )
                )
            );

            // 5) busca perguntas + respostas
            const placeholders = selectedIds.map(() => '?').join(',');
            const [rows] = await pool.execute(
                `
        SELECT
          p.id,
          p.enunciado,
          p.caminho_id,
          p.dificuldade,
          JSON_ARRAYAGG(JSON_OBJECT(
            'texto', r.texto,
            'veracidade', r.veracidade
          )) AS respostas
        FROM pergunta p
        JOIN resposta r ON r.pergunta_id = p.id
        WHERE p.id IN (${placeholders})
        GROUP BY p.id
        `,
                selectedIds
            );

            return rows;

        } catch (err) {
            console.error('Erro ao gerar questionário:', err);
            throw err;
        }
    }

    static async questionarioRandom(caminho, batchSize = 5) {
        try {
            // 1) Busca todas as perguntas
            const queryPergunta = `SELECT * FROM pergunta where caminho_id = ? ORDER BY RAND() LIMIT ${batchSize};`;
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
