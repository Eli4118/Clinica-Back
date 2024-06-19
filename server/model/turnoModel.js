import { pool } from "../bd.js"
export class turnoModel{
        //todos los turnos tomados 
    static  async getTurno (){
        let [result] = await pool.query(
            "SELECT p.Nombre, p.Apellido, p.Documento, p.FechaNacimiento,p.ObraSocial,t.CodTurno,t.Horario,e.Estado,a.tipo  from turno t "+
            " inner join paciente p on t.CodPaciente = p.CodPaciente" + 
            " inner join tipodeatencion a on a.CodTipAtencion = t.CodTipAtencion" +
            " inner join estadodelturno e on e.CodEstado = t.CodEstado;" 
            );        
        return result       
    }
    //agenda del medico deberia estar en medico .....
    //to do
    static  async getTurnoLibre (codMedPersonal){
        let [result] = await pool.query(
            "SELECT a.lunes,a.martes,a.miercoles,a.jueves,a.viernes,a.TurnoTarde,a.TurnoMañana,a.TurnoCompleto,a.HorarioM,a.HorarioT,e.Jornada,e.TiempoTurno "+
            " FROM medicopersonal m inner join agendaparticular a on m.CodMedPersonal = a.CodMedPersonal "+
            " inner join especialidad e on m.CodEspecialidad = e.CodEspecialidad "+
            " where m.CodMedPersonal = ?", codMedPersonal );        
        return result       
    }


    static updateTurnoEstado = async (CodTurno, CodEstado) => {
        const query = `
          UPDATE Turno 
          SET CodEstado = ? 
          WHERE CodTurno = ?
        `;
        const [result] = await pool.execute(query, [CodEstado, CodTurno]);
        return result;
      };




    //un turno segun dni 
static async getTurnoDni(dni) {
    const [result] = await pool.query(
        "SELECT p.Nombre, p.Apellido, p.Documento, p.FechaNacimiento, p.ObraSocial, t.CodTurno, t.Horario, e.Estado, a.tipo, m.Costo AS Monto " +
        "FROM Turno t " +
        "INNER JOIN Paciente p ON t.CodPaciente = p.CodPaciente " +
        "INNER JOIN TipoDeAtencion a ON a.CodTipAtencion = t.CodTipAtencion " +
        "INNER JOIN EstadoDelTurno e ON e.CodEstado = t.CodEstado " +
        "INNER JOIN AgendaDeAtencion ad ON ad.CodTurno = t.CodTurno " +
        "INNER JOIN MedicoPersonal m ON m.CodMedPersonal = ad.CodMedPersonal " +
        "WHERE p.Documento = ?", [dni]
    );
    return result[0];
}

static async getTurnoId(CodTurno) {
    const [result] = await pool.query(
        "SELECT p.Nombre, p.Apellido, p.Documento, p.FechaNacimiento, p.ObraSocial, t.CodTurno, t.Horario, e.Estado, a.tipo, m.Costo AS Monto " +
        "FROM Turno t " +
        "INNER JOIN Paciente p ON t.CodPaciente = p.CodPaciente " +
        "INNER JOIN TipoDeAtencion a ON a.CodTipAtencion = t.CodTipAtencion " +
        "INNER JOIN EstadoDelTurno e ON e.CodEstado = t.CodEstado " +
        "INNER JOIN AgendaDeAtencion ad ON ad.CodTurno = t.CodTurno " +
        "INNER JOIN MedicoPersonal m ON m.CodMedPersonal = ad.CodMedPersonal " +
        "WHERE t.CodTurno = ?", [CodTurno]
    );
    return result[0];
}


    static async createTurno(req) {
        const {
            CodPaciente,
            Fecha,
            Horario,
            CodEstado,
            CodTipAtencion,
            CodMedPersonal
        } = req;
    
        const connection = await pool.getConnection();
    
        try {
            await connection.beginTransaction();
    
            const [turnoResult] = await connection.query(
                'INSERT INTO Turno (CodPaciente, Fecha, Horario, CodEstado, CodTipAtencion) ' +
                'SELECT ?, ?, ?, ?, ? FROM dual ' +
                'WHERE NOT EXISTS (SELECT 1 FROM Turno WHERE CodPaciente = ? AND Fecha = ? AND Horario = ?)', 
                [CodPaciente, Fecha, Horario, CodEstado, CodTipAtencion, CodPaciente, Fecha, Horario]
            );
    
            const CodTurno = turnoResult.insertId;
    
            if (CodTurno) {
                const [agendaResult] = await connection.query(
                    'INSERT INTO AgendaDeAtencion (CodTurno, CodMedPersonal) ' +
                    'SELECT ?, ? FROM dual ' +
                    'WHERE NOT EXISTS (SELECT 1 FROM AgendaDeAtencion ad ' +
                    'JOIN Turno t ON ad.CodTurno = t.CodTurno ' +
                    'WHERE t.CodPaciente = ? AND t.Fecha = ? AND ad.CodMedPersonal = ?)', 
                    [CodTurno, CodMedPersonal, CodPaciente, Fecha, CodMedPersonal]
                );
    
                if (agendaResult.affectedRows === 0) {
                    await connection.rollback();
                    return null; // No se pudo insertar en la agenda porque el paciente ya tiene un turno con el mismo médico en la misma fecha
                }
            }
    
            await connection.commit();
            return CodTurno;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
    static async deleteTurno(CodTurno) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [agendaResult] = await connection.query(
                'DELETE FROM AgendaDeAtencion WHERE CodTurno = ?', 
                [CodTurno]
            );

            if (agendaResult.affectedRows === 0) {
                await connection.rollback();
                return false;
            }

            const [turnoResult] = await connection.query(
                'DELETE FROM Turno WHERE CodTurno = ?', 
                [CodTurno]
            );

            if (turnoResult.affectedRows === 0) {
                await connection.rollback();
                return false;
            }

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
    
    static async getTurnosTomados(codMedPersonal, fechaInicial) {
    const query = `
        SELECT fecha, horario, CodPaciente
        FROM turno t  inner join agendadeatencion a on t.CodTurno = a.CodTurno
        WHERE a.codMedPersonal = ?
        AND DATE(t.fecha) >= ?
        AND DATE(t.fecha) < DATE_ADD(?, INTERVAL 5 DAY)     
    `;
    const [result] = await pool.query(
        query, 
        [codMedPersonal, fechaInicial, fechaInicial]
        );
        return result
};
}