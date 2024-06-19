import { Router } from "express";
import {auth} from "../controllers/auth.js"
export const authRouter = Router();
import {verifyToken} from "../controllers/auth.js"
//controlador de paciente llamada con links a las funciones 
//(consulta, crea, actualiza, elimina)
authRouter.post('/register',auth.register)
authRouter.post('/login',auth.login)//todos los turnos
authRouter.post('/logout',auth.logout)//todos los turnos
authRouter.get('/verify',verifyToken)//todos los turnos

