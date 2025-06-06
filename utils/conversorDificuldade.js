export default function conversorDificuldade(dificuldade) {
    dificuldade = dificuldade.toLowerCase();
    if (dificuldade === 'easy' || dificuldade === 'facil' || dificuldade === 'fácil') {
        return 0;
    } else if (dificuldade === 'regular' || dificuldade === 'medio' || dificuldade === 'médio') {
        return 1;
    } else if (dificuldade === 'hard' || dificuldade === 'dificil' || dificuldade === 'difícil') {
        return 2;
    } else {
        throw new Error('Dificuldade inválida. Use "easy", "regular" ou "hard".');
    }
}