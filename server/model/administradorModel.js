import { pool } from "../bd.js"
export class administradorModel{
    //todos los pacientes
    static  async getAdministrador(){
        let [result] = await pool.query(
            "SELECT * FROM Administrativo order by CodAdministrativo desc"
            );        
        return result       
    }
    //un paciente 
    static  async getAdministradorId (id)   {
        const [result] = await pool.query(
            "SELECT * FROM Administrativo WHERE CodAdministrativo = ?", id );
        return result[0]   
    }
    static  async getAdministradorDni (dni)   {
        const [result] = await pool.query(
            "SELECT * FROM Administrativo WHERE CodAdministrativo = ?", dni );

        return result[0]   
    }
    static  async createAdministrador(req)   {
      
        const {
            Nombre,
            Apellido,
            Documento,
            Contraseña,
            usuario

        } = req;

        const [result] = await pool.query(
            "INSERT INTO Administrativo (Nombre, Apellido, Documento, Contraseña, Usuario) VALUES (?, ?, ?, ?, ?)",
            [Nombre, Apellido, Documento, Contraseña, usuario]
        );
        // Devuelve el ID del paciente recién insertado 
        return result.insertId;     
    }
    static  async updateAdministrador(req,id){
        const [result] = await pool.query(
            "UPDATE Administrativo SET ? WHERE CodAdministrativo = ?", 
            [req, id]
            );
        return result.affectedRows
    }
    static  async deleteAdministrador(id){
        const [result] = await pool.query(
            "DELETE FROM Administrativo WHERE CodAdministrativo = ?", id
            );
        return result.affectedRows
    }    
    
}
