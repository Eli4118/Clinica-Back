import { pacienteModel } from "../model/pacienteModel.js"
import {validatePaciente,validatePartialPaciente} from "../schemas/Paciente.js"
import{asyncHandler}from "../utils/asyncHandler.js"//esta es para no escribir 200 try catch
//en esta parte se hace la logica para insertar o para mostrar los datos
export class pacienteController{
    //este no se si vamos a usar 
    //debuelve todos los pacientes 
    static getPacientes = async(req,res)=>{
        const Pacientes = await pacienteModel.getPacientes();
        res.status(200).json( Pacientes )
    }
    //debuelve 1 paciente segun id 
    static getPacienteId = async(req,res)=>{
        const paciente = await pacienteModel.getPacienteId([req.params.id])
        if (paciente) {
            res.status(200).json( paciente )
        } else {
            res.status(404).json({ message: 'Paciente no encontrado' });
        }
    }
    //debuelve 1 paciente segun dni 
    static getPacienteDniHandler = async(req,res)=>{
        const paciente = await pacienteController.getPacienteDni(req.params.dni)
        if (paciente) {
            res.status(200).json( paciente )
        } else {
            res.status(404).json({ message: ' Paciente no encontrado' });
        }
    }
    static async getPacienteDni(dni) {
        try {
            const paciente = await pacienteModel.getPacienteDni(dni);
            return paciente;
        } catch (error) {
            throw new Error('Error al buscar paciente');
        }
    }
    static createPaciente = async (paciente) => {
        const validateReq = validatePaciente(paciente);
        if (validateReq.error) {
          return { error: true, message: JSON.parse(validateReq.error.message) };
        }
    
        // Crear el paciente
        const result = await pacienteModel.createPaciente(validateReq.data);
        return  result ;
      };
    //crea un paciente
    static createPacienteHandler = async(req,res)=>{
        //verifica los datos
        const { error, message, result } = await pacienteController.validateAndCreatePaciente(req.body);
        if (error) {
          return res.status(400).json({ error: true, message });
        }
        res.status(201).json( result );

        //(mandar los datos verificados para el insert)
        //const result = await pacienteModel.createPaciente(validateReq.data)
       // console.log(result)
        //res.send(result)
    }
    //actualiza un paciente
    static updatePaciente = async(req,res)=>{
        const id = req.params.id
        //verificar los datos
        const validateReq = validatePartialPaciente(req.body)
        //(mandar los datos verificados para el insert)
        const affectedRows = await pacienteModel.updatePaciente(validateReq.data,id);
        if (affectedRows > 0) {
            res.status(200).json({ message: 'Paciente actualizado' });
        } else {
            res.status(404).json({ message: 'Paciente no encontrado' });
        }

      //  const result = await pacienteModel.updatePaciente(validateReq,id)
      //  res.send(result)
    }
    //elimina un paciente
    static deletePaciente = async(req,res)=>{
        //verificar si esxiste
        const id = req.params.id

        const response = await pacienteModel.deletePaciente(id)
        if (response > 0) {
            res.status(200).json({ message: 'Paciente eliminado' });
        } else {
            res.status(404).json({ message: 'Paciente no encontrado' });
        }
    }
}
export const Paciente = {
    getPacientes:asyncHandler(pacienteController.getPacientes),
    getPacienteId:asyncHandler(pacienteController.getPacienteId),
    getPacienteDniHandler:asyncHandler(pacienteController.getPacienteDniHandler),
    createPacienteHandler:asyncHandler(pacienteController.createPacienteHandler),
    updatePaciente:asyncHandler(pacienteController.updatePaciente),
    deletePaciente:asyncHandler(pacienteController.deletePaciente),
}
