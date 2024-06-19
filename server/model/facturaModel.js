import { pool } from "../bd.js"
export class facturaModel{
  
    // Función para crear una nueva factura
static createFactura = async (facturaData) => {
    const { CodTurno, Descripcion, Fecha, Monto } = facturaData;
    const query = `
      INSERT INTO Factura (CodTurno, Descripcion, Fecha, Monto) 
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [CodTurno, Descripcion, Fecha, Monto]);
    return result.insertId;
  };
  
    
}