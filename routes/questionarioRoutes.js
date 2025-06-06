import express from 'express';
import { questionarioRandom, questionario } from '../controllers/questionarioController.js';

const router = express.Router();

router.get('/random/:caminho', questionarioRandom);
router.get('/:dificuldade/:caminho', questionario);

export default router;