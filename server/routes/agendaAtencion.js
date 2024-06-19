import { Router } from "express";
import {AgendaDeAtencion} from "../controllers/agendaDeAtencion.js"
export const AgendaDeAtencionRouter = Router();


AgendaDeAtencionRouter.post('/',AgendaDeAtencion.getAgenda)//todos los turnos
AgendaDeAtencionRouter.post('/estado',AgendaDeAtencion.getAgendaByEstado)//todos los turnos

