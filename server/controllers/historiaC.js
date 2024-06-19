import { historiaCModel } from "../model/historiaCModel.js";
import{asyncHandler}from "../utils/asyncHandler.js"//esta es para no escribir 200 try catch

 class historiaController{
     // Crear Historia
      static CreateHistoria = async (req, res) => {
        const { CodPaciente, CodMedPersonal, Fecha, Diagnostico } = req.body;
        try {
          const CodHistoria = await historiaCModel.createHistoria(CodPaciente, CodMedPersonal, Fecha, Diagnostico);
          res.status(201).json({ message: 'Historia creada', CodHistoria });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      };
      
      // Obtener Historias por DNI
      static getHistoriaDNI = async (req, res) => {
        const { Documento } = req.body;
        try {
          const paciente = await historiaCModel.getPacienteByDocumento(Documento);
      
          if (!paciente) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
          }
      
          const { CodPaciente, Nombre, Apellido } = paciente;
          const historias = await historiaCModel.getHistoriasByCodPaciente(CodPaciente);
      
          res.status(200).json({
            CodPaciente,
            Nombre,
            Apellido,
            Historias: historias,
          });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      };
     

}
export const historiaC = {
    CreateHistoria:asyncHandler(historiaController.CreateHistoria),
    getHistoriaDNI:asyncHandler(historiaController.getHistoriaDNI),
    
}