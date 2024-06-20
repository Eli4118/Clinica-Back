import { pool } from "../bd.js"
export class pacienteModel{
    //todos los pacientes
    static  async getPacientes (){
        let [result] = await pool.query(
            "SELECT * FROM Paciente order by CodPaciente desc"
            );        
        return result       
    }
    //un paciente 
    static  async getPacienteId (id)   {
        const [result] = await pool.query(
            "SELECT * FROM Paciente WHERE CodPaciente = ?", id );
        return result[0]   
    }
    static  async getPacienteDni (dni)   {
        const [result] = await pool.query(
            "SELECT * FROM Paciente WHERE Documento = ?", dni );

        return result[0]   
    }
    static  async createPaciente(req)   {
      
        const {
            Nombre,
            Apellido,
            Documento,
            Domicilio,
            Telefono,
            Mail,
            FechaNacimiento,
            Sexo,
            Edad,
            ObraSocial
        } = req;

        const [result] = await pool.query(
            "INSERT INTO Paciente (Nombre, Apellido, Documento, Domicilio, Telefono, Mail, FechaNacimiento, Sexo, Edad, ObraSocial) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [Nombre, Apellido, Documento, Domicilio, Telefono, Mail, FechaNacimiento, Sexo, Edad, ObraSocial]
        );
        // Devuelve el ID del paciente recién insertado 
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
