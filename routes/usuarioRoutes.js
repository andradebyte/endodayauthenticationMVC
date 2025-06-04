import express from 'express';
import { criarUsuario, deletarUsuario, novoNomeUsuario, novoEmailUsuario, novaSenhaUsuario } from '../controllers/usuarioController.js';

const router = express.Router();

router.post('/cadastrar', criarUsuario);
router.delete('/:usuario_id', deletarUsuario);
router.put('/nome', novoNomeUsuario);
router.put('/email', novoEmailUsuario);
router.put('/senha', novaSenhaUsuario);

export default router;