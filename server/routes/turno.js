import { Router } from "express";
import {turno} from "../controllers/turno.js"
import {authRequired,authAdminRequired,authMedPersRequired} from "../middlewares/validateToken.js"

export const turnoRouter = Router();

//controlador de paciente llamada con links a las funciones 
//(consulta, crea, actualiza, elimina)
//authAdminRequired autenticado solo admin*
//authMedPersRequired,
turnoRouter.post('/libre',turno.getTurnolibre)//todos los turnos autenticado solo admin*
turnoRouter.get('/',authRequired,turno.getTurnos)//todos los turnos autenticado *
turnoRouter.post('/DNI',turno.getTurnoDni)//todos los turnos autenticado solo medico 
turnoRouter.post('/ID',turno.getTurnoId)//todos los turnos autenticado solo medico 
turnoRouter.post('/',turno.createTurno)
turnoRouter.delete('/:CodTurno',turno.deleteTurno)
