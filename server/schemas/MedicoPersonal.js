import { z } from "zod";

const passwordSchema = z.string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .max(20, "La contraseña no puede tener más de 20 caracteres")
  .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
  .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
  .regex(/[0-9]/, "La contraseña debe contener al menos un número")
  .regex(/[^A-Za-z0-9]/, "La contraseña debe contener al menos un carácter especial");


 const MedicoPersonalSchema = z.object({
  Nombre: z.string().max(50),
  Apellido: z.string().max(50),
  Documento: z.string().max(20),
  Domicilio: z.string().max(100),
  Telefono: z.string().max(20),
  Mail: z.string().email().max(50),
  CodEspecialidad: z.number().int().positive(),
  EsMedico: z.boolean(),
  Matricula: z.string().max(20),
  Costo: z.number().positive().max(9999999999.99),
  Contraseña: passwordSchema,
  usuario: z.string().max(50)
});

export function validateMedicoPersonalSchema(object) {
  return MedicoPersonalSchema.safeParse(object);
}

export function validateMedicoPartialPersonalSchema(input) {
  return MedicoPersonalSchema.partial().safeParse(input);
}
