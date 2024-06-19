import { z } from "zod";

const passwordSchema = z.string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .max(20, "La contraseña no puede tener más de 20 caracteres")
  .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
  .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
  .regex(/[0-9]/, "La contraseña debe contener al menos un número")
  .regex(/[^A-Za-z0-9]/, "La contraseña debe contener al menos un carácter especial");


const administrativoSchema = z.object({
  Nombre: z.string().max(50),
  Apellido: z.string().max(50),
  Documento: z.string().max(20),
  Contraseña: passwordSchema,
  usuario: z.string().max(50)
});

export function validateadmin(object) {
  return administrativoSchema.safeParse(object);
}

export function validatePartialadmin(input) {
  return administrativoSchema.partial().safeParse(input);
}
