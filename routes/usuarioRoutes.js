import express from 'express';
import { criarUsuario, deletarUsuario, novoNomeUsuario, novoEmailUsuario, novaSenhaUsuario, verificarEmail } from '../controllers/usuarioController.js';
import { autenticarJWT } from '../middleware/autenticarJWT.js';

const router = express.Router();

router.post('/cadastrar', criarUsuario);
router.delete('/:usuario_id', autenticarJWT, deletarUsuario);
router.put('/nome', autenticarJWT, novoNomeUsuario);
router.put('/email', novoEmailUsuario);
router.put('/senha', novaSenhaUsuario);
router.get('/verificar-email/:email', verificarEmail);

export default router;