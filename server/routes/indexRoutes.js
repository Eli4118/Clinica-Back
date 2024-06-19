import { Router } from "express";
import {pool} from "../bd.js"
import{pacienteRouter} from "./paciente.js"
import{medicoRouter} from "./medico.js"
import{turnoRouter} from "./turno.js"
import{authRouter} from "./auth.js"
import { facturaRouter } from "./factura.js";
import { administrativoRouter } from "./administrativo.js";
import { historiaCRouter } from "./historiaC.js";
import {AgendaDeAtencionRouter} from "./agendaAtencion.js"

const router = Router();
router.use('/apiAuth',authRouter)
router.use('/paciente',pacienteRouter);//llama al router de pacientes 
router.use('/medico',medicoRouter);//llama al router de medico 
router.use('/turno',turnoRouter);//llama al router de turno 
router.use('/factura',facturaRouter);//llama al router de turno 
router.use('/administrativo',administrativoRouter);//llama al router de turno 
router.use('/Historiaclinica',historiaCRouter);//llama al router de turno 
router.use('/AgendaDeAtencion',AgendaDeAtencionRouter);//llama al router de turno 


//ejemplo para ver si anda el servidor 
router.get('/', async (req,res)=>{
   const [rows]= await pool.query('select 1 + 1 as result')
    console.log(rows);
    res.json("pong")
})

export default router;