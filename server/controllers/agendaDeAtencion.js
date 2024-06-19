import { AgendaDeAtencionModel } from "../model/agendaAtencion.js"
import{asyncHandler}from "../utils/asyncHandler.js"//esta es para no escribir 200 try catch
export class AgendaDeAtencionController{
  
    static getAgenda = async(req,res)=>{
        const { medico, fecha } = req.body;
    try {
        const agenda = await AgendaDeAtencionModel.getAgenda(medico, fecha);
        res.json(agenda);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    }
    //elegido un medico muestra datos y turnos 
    static getAgendaByEstado = async(req,res)=>{
        const { medico, fecha, codEstado } = req.body;
    try {
        const agenda = await AgendaDeAtencionModel.getAgendaByEstado(medico, fecha, codEstado);
        res.json(agenda);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    }
    
}
export const AgendaDeAtencion = {
    getAgenda:asyncHandler(AgendaDeAtencionController.getAgenda),
    getAgendaByEstado:asyncHandler(AgendaDeAtencionController.getAgendaByEstado),
}
