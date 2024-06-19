import { Router } from "express";
import {historiaC} from "../controllers/historiaC.js"
export const historiaCRouter = Router();
//controlador de paciente llamada con links a las funciones 
//(consulta, crea, actualiza, elimina)
historiaCRouter.post('/save',historiaC.CreateHistoria)
historiaCRouter.post('/',historiaC.getHistoriaDNI)//todos los turnos

