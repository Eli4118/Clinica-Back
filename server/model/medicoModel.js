import { pool } from "../bd.js"
export class medicoModel{

    //todos las especialidades
    static  async getEspecialidades (){
        let [result] = await pool.query(
            "SELECT * FROM especialidad order by CodEspecialidad desc"
            );        
        return result       
    }
    //medicos con una especialidad
    static  async getMedicosEspec (codEspecialidad){
        let [result] = await pool.query(
            "SELECT * FROM medicopersonal WHERE CodEspecialidad = ?", codEspecialidad );
        return result       
    }

    //todos los medicos
    static  async getMedicos(){
        let [result] = await pool.query(
            "SELECT * FROM medicopersonal order by CodMedPersonal desc"  );
        return result       
    }


    //un paciente 
    static  async getMedicoId (id)   {
        const [result] = await pool.query(
            "SELECT * FROM medicopersonal WHERE codEspecialidad = ?", id );
        return result[0]   
    }
    static async createMedico(req) {
        const {
            Nombre,
            Apellido,
            Documento,
            Domicilio,
            Telefono,
            Mail,
            CodEspecialidad,
            EsMedico,
            Matricula,
            Costo,
            Contraseña,
            usuario
        } = req;

        // Verifica si el Documento ya existe
        const [existing] = await pool.query(
            "SELECT Documento FROM medicopersonal WHERE Documento = ?",
            [Documento]
        );

        if (existing.length > 0) {
            throw new Error(`El Documento '${Documento}' ya está registrado.`);
        }

        const [result] = await pool.query(
            "INSERT INTO medicopersonal (Nombre, Apellido, Documento, Domicilio, Telefono, Mail, CodEspecialidad, EsMedico, Matricula, Costo, Contraseña, usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [Nombre, Apellido, Documento, Domicilio, Telefono, Mail, CodEspecialidad, EsMedico, Matricula, Costo, Contraseña, usuario]
        );

        // Devuelve el ID del médico/personal recién insertado 
        return result.insertId;
    }

    static  async updatePaciente(req,id){
        const [result] = await pool.query(
            "UPDATE Paciente SET ? WHERE CodPaciente = ?", 
            [req, id]
            );
        return result.affectedRows
    }
    static  async deletePaciente(id){
        const [result] = await pool.query(
            "DELETE FROM Paciente WHERE CodPaciente = ?", id
            );
        return result.affectedRows
    }    
    
}