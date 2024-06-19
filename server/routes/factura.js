import { Router } from "express";
import {Factura} from "../controllers/factura.js"
export const facturaRouter = Router();


facturaRouter.post('/', Factura.createFactura)