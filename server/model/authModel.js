import { pool } from "../bd.js"
export class authModel{
    static  async login (usuario){
        const queryMedicoPersonal = `
        SELECT CodMedPersonal AS id, Usuario, Documento, Nombre, CodEspecialidad, Contraseña , 'MedicoPersonal' AS role 
        FROM MedicoPersonal 
        WHERE Usuario = ?`;

         const queryAdministrativo = `
        SELECT CodAdministrativo AS id, Usuario, Documento, Nombre, Contraseña , 'Administrativo' AS role 
        FROM Administrativo 
        WHERE Usuario = ?`;

        const [rowsMedico] = await pool.query(queryMedicoPersonal, [usuario]);
        if (rowsMedico.length > 0) {
          return rowsMedico[0];
        }

        const [rowsAdmin] = await pool.query(queryAdministrativo, [usuario]);
        if (rowsAdmin.length > 0) {
            return rowsAdmin[0];
        }

         return null;
    }

}