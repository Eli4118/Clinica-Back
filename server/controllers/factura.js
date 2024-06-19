import {facturaModel} from "../model/facturaModel.js"
import{asyncHandler}from "../utils/asyncHandler.js"//esta es para no escribir 200 try catch
import{turnoModel} from"../model/turnoModel.js"

export class facturaController{

    static createFactura = async (req, res) => {
  try {
    const { CodTurno, Descripcion, Fecha, Monto } = req.body.factura;
    
    // Validar los datos de entrada
    if (!CodTurno || !Descripcion || !Fecha || !Monto) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    
    const newFacturaId = await facturaModel.createFactura({ CodTurno, Descripcion, Fecha, Monto });
    //actualizar estado turno
    await turnoModel.updateTurnoEstado(CodTurno, 2);

    res.status(201).json({ message: 'Factura creada con éxito', CodFactura: newFacturaId });
  } catch (error) {
    console.error('Error al crear la factura:', error);
    res.status(500).json({ error: 'Error al crear la factura' });
  }
};
}
export const Factura = {
    createFactura:asyncHandler(facturaController.createFactura),
}