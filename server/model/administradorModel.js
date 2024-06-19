import { pool } from "../bd.js"
export class administradorModel{
    //todos los pacientes
    static  async getAdministrador(){
        let [result] = await pool.query(
            "SELECT * FROM administrativo order by CodAdministrativo desc"
            );        
        return result       
    }
    //un paciente 
    static  async getAdministradorId (id)   {
        const [result] = await pool.query(
            "SELECT * FROM administrativo WHERE CodAdministrativo = ?", id );
        return result[0]   
    }
    static  async getAdministradorDni (dni)   {
        const [result] = await pool.query(
            "SELECT * FROM administrativo WHERE CodAdministrativo = ?", dni );

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
            "INSERT INTO administrativo (Nombre, Apellido, Documento, Contraseña, usuario) VALUES (?, ?, ?, ?, ?)",
            [Nombre, Apellido, Documento, Contraseña, usuario]
        );
        // Devuelve el ID del paciente recién insertado 
        return result.insertId;     
    }
    static  async updateAdministrador(req,id){
        const [result] = await pool.query(
            "UPDATE administrativo SET ? WHERE CodAdministrativo = ?", 
            [req, id]
            );
        return result.affectedRows
    }
    static  async deleteAdministrador(id){
        const [result] = await pool.query(
            "DELETE FROM administrativo WHERE CodAdministrativo = ?", id
            );
        return result.affectedRows
    }    
    
}