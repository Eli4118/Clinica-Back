import { config } from "dotenv";

config()

export const  PORT =   process.env.PORT || 4500
export const  DB_USER =  process.env.DB_USER ||'root'
export const  DB_PASSWORD =   process.env.DB_PASSWORD ||'root'
export const  DB_HOST =  process.env.DB_HOST ||'localhost'
export const  DB_PORT =  process.env.DB_PORT||3306
export const  DB_NAME =  process.env.DB_NAME||'seprice'
export const  FRONT_URL = process.env.FRONT_URL ||'http://localhost:5173'

console.log(PORT, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, FRONT_URL);
