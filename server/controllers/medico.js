import { medicoModel } from "../model/medicoModel.js"
import{asyncHandler}from "../utils/asyncHandler.js"//esta es para no escribir 200 try catch
import {validateMedicoPersonalSchema,validateMedicoPartialPersonalSchema} from "../schemas/MedicoPersonal.js"
import bcrypt from "bcryptjs"

export class medicoController{
    //trae las especialidades
    static getEspecialidades = async(req,res)=>{
        const Especialidades = await medicoModel.getEspecialidades();
        res.status(200).json( Especialidades )
    }
    
    static getMedicos = async(req,res)=>{
        const codEspecialidad = req.params.id;
        let medicos = []
        if (codEspecialidad){
             medicos = await medicoModel.getMedicosEspec(codEspecialidad);
        }else{
             medicos = await medicoModel.getMedicos();
        }
       // const Especialidades = await medicoModel.getEspecialidades();
        res.status(200).json( medicos )
    }
    //elegido un medico muestra datos y turnos 
    static getMedicoId = async(req,res)=>{
        const medico = await medicoModel.getMedicoId([req.params.id])
        if (medico) {
            res.status(200).json( medico )
        } else {
            res.status(404).json({ message: 'Medico no encontrado' });
        }
    }
    //mostrar turnos disponibles 
    static getMedicoId = async(req,res)=>{
        const codMedPersonal = req.body.codMedPersonal
        const dia = req.body.dia

        const medico = await medicoModel.getMedicoId([req.params.id])
        if (medico) {
            res.status(200).json( medico )
        } else {
            res.status(404).json({ message: 'Medico no encontrado' });
        }
    }

    //traer los medicos segun especialidad si no trae todos

/* 
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
    }*/
    //crea un medico
    
        static createMedico = async(req,res)=>{
            const medico = req.body.medicopersonal
            console.log(medico)
            const  validateReq = validateMedicoPersonalSchema(medico);
            console.log(validateReq.error)
            if (validateReq.error) {
                res.status(400).json({ message:JSON.parse(validateReq.error.message) });
                }
                
            const passHash = await bcrypt.hash(validateReq.data.Contraseña, 10)
            validateReq.data.Contraseña = passHash
            // Crear el paciente
            const result = await medicoModel.createMedico(validateReq.data);
            if (result === null) {
                res.status(400).json({ message: '  duplicado ' });
            } else {
                res.status(201).json(result);
            }
          };
        //(mandar los datos verificados para el insert)
        //const result = await pacienteModel.createPaciente(validateReq.data)
       // console.log(result)
        //res.send(result)
    
    /*
    //actualiza un paciente
    static updatePaciente = async(req,res)=>{
        const id = req.params.id
        //verificar los datos
        const validateReq = validateMedicoPartialPersonalSchema(req.body)
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
    } */
}
export const medico = {
    getEspecialidades:asyncHandler(medicoController.getEspecialidades),
    getMedicos:asyncHandler(medicoController.getMedicos),
    getMedicos:asyncHandler(medicoController.getMedicos),
    getMedicoId:asyncHandler(medicoController.getMedicoId),
    createMedico:asyncHandler(medicoController.createMedico),
}
