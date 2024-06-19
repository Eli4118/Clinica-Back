import { Router } from "express";
import {Paciente} from "../controllers/paciente.js"
export const pacienteRouter = Router();

//controlador de paciente llamada con links a las funciones 
//(consulta, crea, actualiza, elimina)
pacienteRouter.get('/',Paciente.getPacientes)
pacienteRouter.get('/dni:dni',Paciente.getPacienteDniHandler)
pacienteRouter.get('/:id',Paciente.getPacienteId)
pacienteRouter.post('/', Paciente.createPacienteHandler)
pacienteRouter.put('/:id',Paciente.updatePaciente)
pacienteRouter.delete('/:id',Paciente.deletePaciente)