import { asyncHandler } from "../utils/asyncHandler.js";
import {medicoController}from "./medico.js"
import {administradorController} from "./administrador.js"
import {createAccessToken} from "../utils/jwt.js"
import {authModel} from "../model/authModel.js"
import bcrypt from "bcryptjs"
import { token } from "morgan";
import jwt from "jsonwebtoken"

class authController {
    static register = async (req, res) => {
        try {
        const {medicoPersonal,administrativo} = req.body 
        let result ={}
        if (medicoPersonal){
            const medicoResult = await  medicoController.createMedico(medicoPersonal)   
            result.medico = medicoResult;       
        }
        if (administrativo){
             const adminResult = await administradorController.createAdministrador(administrativo)
             result.administrativo = adminResult;     
        }
        if (Object.keys(result).length === 0){
            return res.status(400).send({ error: "Bad Request" });
        }
        res.status(201).send({ result });
    } catch (error) {
        res.status(500).send({ error: error.message  });
    }
    };
    static login = async(req,res)=>{
        const {usuario, contraseña} = req.body

        if (!usuario || !contraseña) {
            return res.status(404).json({ message: 'Usuario o contraseña no proporcionados' });
        }        
        //peticion a bd para buscar el usuario
        const user = await authModel.login(usuario);

        if (!user || !user.Contraseña) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
        //encriptamos pass por seguridad
        const isPasswordValid = await bcrypt.compare(contraseña, user.Contraseña);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
        //se crea el objeto a converitr en jwt
        const tokenPayload = {
            id: user.id,
            usuario: user.Usuario,
            documento: user.Documento,
            nombre: user.Nombre,
            codEspecialidad: user.CodEspecialidad,
            role: user.role
        };

        const token = await createAccessToken(tokenPayload);

        res.cookie("token", token);
        return res.json({
            message: "Usuario logueado correctamente",
            token: token
        });
    }
    static logout = (req,res)=>{
        res.cookie('token',"",
            {
            expires: new Date(0)
        })
        return res.sendStatus(200)
    }
}
//que hacer con el sobreturno
export const auth = {
    register: asyncHandler(authController.register),
    login: asyncHandler(authController.login),
    logout: asyncHandler(authController.logout),
};


export const verifyToken = async (req,res)=>{
    const {token} = req.cookies
    if(!token){
        return res.status(401).json({message: "no autorizado"})
    }
    jwt.verify(token,"secret123", async (err, user)=>{
        if(err) {return res.status(401).json({message: "no autorizado"})}

        const userFound = await authModel.login(user.usuario)// ver si lo busco desde el modelo
        if (!userFound){ return res.status(401).json({message:"no autorizado"})}
        return res.json({
            id: userFound.id,
            usuario: userFound.Usuario,
            documento: userFound.Documento,
            nombre: userFound.Nombre,
            codEspecialidad: userFound.CodEspecialidad,
            role: userFound.role
        })
    })
}