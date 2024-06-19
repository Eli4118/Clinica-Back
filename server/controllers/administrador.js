import { administradorModel } from "../model/administradorModel.js"
import{asyncHandler}from "../utils/asyncHandler.js"//esta es para no escribir 200 try catch
import {validateadmin,validatePartialadmin} from "../schemas/Administrativo.js"
import bcrypt from "bcryptjs"
export class administradorController{
  
    static getAdministrador = async(req,res)=>{
        const Administradores = await administradorModel.getAdministrador();
        res.status(200).json( Administradores )
    }
    //elegido un medico muestra datos y turnos 
    static getAdministradorId = async(req,res)=>{
        const Administrador = await administradorModel.getAdministradorId([req.params.id])
        if (Administrador) {
            res.status(200).json( Administrador )
        } else {
            res.status(404).json({ message: 'Administrador no encontrado' });
        }
    }
    //mostrar turnos disponibles 
    static getAdministradorDni = async(req,res)=>{
        const Documento = req.body.Documento
        const Administrador = await administradorModel.getAdministradorDni(Documento)
        if (Administrador) {
            res.status(200).json( Administrador )
        } else {
            res.status(404).json({ message: 'Administrador no encontrado' });
        }
    }
    static createAdministrador = async(req,res)=>{
        const administrativo = req.body.administrativo
        const  validateReq = validateadmin(administrativo);
        console.log(validateReq.error)
        if (validateReq.error) {
            res.status(400).json({ message:JSON.parse(validateReq.error.message) });
            }
            
        const passHash = await bcrypt.hash(validateReq.data.Contraseña, 10)
        validateReq.data.Contraseña = passHash
        // Crear el paciente
        const result = await administradorModel.createAdministrador(validateReq.data);
        if (result === null) {
            res.status(400).json({ message: '  duplicado ' });
        } else {
            res.status(201).json(result);
        }
      };
    
}
export const administrativo = {
    getAdministrador:asyncHandler(administradorController.getAdministrador),
    getAdministradorId:asyncHandler(administradorController.getAdministradorId),
    createAdministrador:asyncHandler(administradorController.createAdministrador)
}
