import { pool } from "../bd.js"
export class historiaCModel{
   
    // Crear Historia
    static createHistoria = async (CodPaciente, CodMedPersonal, Fecha, Diagnostico) => {
      const [result] = await pool.query(
        'INSERT INTO HistoriaClinica (CodPaciente, CodMedPersonal, Fecha, Diagnostico) VALUES (?, ?, ?, ?)',
        [CodPaciente, CodMedPersonal, Fecha, Diagnostico]
      );
      return result.insertId;
    };
    
    // Obtener Historias por CodPaciente
    static getHistoriasByCodPaciente = async (CodPaciente) => {
      const [historias] = await pool.query(
        'SELECT CodHistoria, CodMedPersonal, Fecha, Diagnostico FROM HistoriaClinica WHERE CodPaciente = ?',
        [CodPaciente]
      );
      return historias;
    };
    
    // Obtener Paciente por Documento
    static getPacienteByDocumento = async (Documento) => {
      const [paciente] = await pool.query(
        'SELECT CodPaciente, Nombre, Apellido FROM Paciente WHERE Documento = ?',
        [Documento]
      );
      return paciente[0];
    };
    

}