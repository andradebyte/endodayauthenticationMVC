import express from "express";
import { verificarEmail, verificarUsuarioID } from "../controllers/verificacaoDadosController.js";

const router = express.Router();

router.post('/verificar-email', verificarEmail);
router.post('/verificar-usuario-id', verificarUsuarioID);

export default router;