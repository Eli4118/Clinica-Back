import { z } from "zod";

const pacienteSchema = z.object({
  Nombre: z.string().max(50),
  Apellido: z.string().max(50),
  Documento: z.string().max(20),
  Domicilio: z.string().max(100).optional(),
  Telefono: z.string().max(20).optional(),
  Mail: z.string().max(50).email(),
  FechaNacimiento: z.string().refine((dateString) => {
    const parsedDate = new Date(dateString);
    const today = new Date();
    const maxAgeDate = new Date(today);
    maxAgeDate.setFullYear(today.getFullYear() - 120);

    return (
      !isNaN(parsedDate) && 
      parsedDate < today && 
      parsedDate > maxAgeDate
    );
  }, {
    message: 'Fecha de nacimiento inválida. Asegúrese de que la persona esté viva y no tenga más de 120 años.',
  }),
  Sexo: z.enum(['M', 'F']).optional(),
  Edad: z.number().int().nonnegative().max(120).optional(),
  ObraSocial: z.string().max(50),
});

export function validatePaciente(object) {
  return pacienteSchema.safeParse(object);
}

export function validatePartialPaciente(input) {
  return pacienteSchema.partial().safeParse(input);
}
