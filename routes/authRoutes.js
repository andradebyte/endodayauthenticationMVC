import express from 'express';
import { loginAuth, verificarTokenEmailAuth, verificarTokenSenhaAuth, criarTokenEmailAuth, criarTokenSenhaAuth } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginAuth);
router.post('/criar-token-email', criarTokenEmailAuth);
router.post('/verificar-token-email', verificarTokenSenhaAuth);
router.post('/criar-token-senha', criarTokenSenhaAuth);
router.post('/verificar-token-senha', verificarTokenEmailAuth);

export default router;