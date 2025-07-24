import express from "express";
import { verificarEmail, verificarUsuarioID } from "../controllers/verificacaoDadosController.js";

const router = express.Router();

router.get('/verificar-email', verificarEmail);
router.get('/verificar-usuario-id', verificarUsuarioID);

export default router;