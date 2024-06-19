import { Router } from "express";
import {medico} from "../controllers/medico.js"
export const medicoRouter = Router();

//trae especialidades de los medicos 
medicoRouter.get('/especialidad', medico.getEspecialidades)
//trae especialidades de los medicos recibe codigo de especialidad
// por parametro sino todos
//ver que solo devuelva los datos necesarios
medicoRouter.get('/medico', medico.getMedicos)
medicoRouter.get('/medico:id', medico.getMedicos)
medicoRouter.get('/:id', medico.getMedicoId)
medicoRouter.post('/', medico.createMedico)
/* medicoRouter.get('/:id',paciente.getPacienteId)
medicoRouter.post('/', paciente.createPaciente)
medicoRouter.put('/:id',paciente.updatePaciente)
medicoRouter.delete('/:id',paciente.deletePaciente) */