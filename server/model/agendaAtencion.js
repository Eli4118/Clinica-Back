import { pool } from "../bd.js"
export class AgendaDeAtencionModel{

    static    getAgenda = async (medico, fecha) => {
        const [rows] = await pool.query(
            `SELECT a.*, p.Nombre as PacienteNombre, p.Apellido as PacienteApellido, t.* 
            FROM AgendaDeAtencion a 
            JOIN Turno t ON a.CodTurno = t.CodTurno 
            JOIN Paciente p ON t.CodPaciente = p.CodPaciente 
            WHERE a.CodMedPersonal = ? AND t.Fecha = ?`,
            [medico, fecha]
        );
        return rows;
    }
    
static  getAgendaByEstado = async (medico, fecha, codEstado) => {
        const [rows] = await pool.query(
            `SELECT a.*, p.Nombre as PacienteNombre, p.Apellido as PacienteApellido, t.* 
            FROM AgendaDeAtencion a 
            JOIN Turno t ON a.CodTurno = t.CodTurno 
            JOIN Paciente p ON t.CodPaciente = p.CodPaciente 
            WHERE a.CodMedPersonal = ? AND t.Fecha = ? AND t.CodEstado = ?`,
            [medico, fecha, codEstado]
        );
        return rows;
    }
};