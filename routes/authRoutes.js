import express from "express";
import { loginAuth, verificarTokenEmailAuth, verificarTokenSenhaAuth, criarTokenEmailAuth, criarTokenSenhaAuth } from '../controllers/authController.js';
import { autenticarJWT } from "../middleware/autenticarJWT.js";

const router = express.Router();

router.post('/login', loginAuth);
router.post('/criar-token-email',autenticarJWT, criarTokenEmailAuth);
router.post('/verificar-token-email',autenticarJWT, verificarTokenEmailAuth);
router.post('/criar-token-senha', criarTokenSenhaAuth);
router.post('/verificar-token-senha', verificarTokenSenhaAuth);

export default router;