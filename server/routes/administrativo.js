import { Router } from "express";
import {administrativo} from "../controllers/administrador.js"
export const administrativoRouter = Router();


administrativoRouter.get('/',administrativo.getAdministrador)
administrativoRouter.get('/:id',administrativo.getAdministradorId)//todos los turnos
administrativoRouter.post('/',administrativo.createAdministrador)//todos los turnos

