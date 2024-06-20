import { turnoModel } from "../model/turnoModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import{pacienteController} from "./paciente.js"

class turnoController {
    //turnos libres
    static getTurnolibre = async (req, res) => {
            const codMedPersonal = req.body.codMedPersonal;
            const dia = new Date(req.body.dia);
            const now = new Date();
            // Restablecer la hora a 0
            now.setUTCHours(0, 0, 0, 0);
            // Obtener la agenda del médico
            const agenda = await turnoModel.getTurnoLibre(codMedPersonal);
            //medico no encontrado
            if (agenda.length === 0) {
                res.status(404).json({ message: 'Medico no encontrado' });
            }
            // Obtener los turnos ya tomados
            const turnosTomados = await turnoModel.getTurnosTomados(codMedPersonal, dia);
            //arma la fecha del turnos  ya tomados para filtrar
            const turnosTomadosHora = sumarHoraAlDia(turnosTomados);
            // Calcular los turnos
            const turnosDisponibles = calcularTurnos(agenda[0], dia, now); // Usa el primer elemento de la agenda si es un array

            // Filtrar los turnos ya tomados
            const turnosFiltrados = filtrarTurnosTomados(turnosDisponibles, turnosTomadosHora || []);

            res.json(turnosFiltrados);

    };
    //todos los turnos tomados                  
    static getTurnos = async(req,res)=>{
        const turnos = await turnoModel.getTurno();
        res.status(200).json( turnos )
    }
    //turno tomado segun dni 
    static getTurnoDni = async(req,res)=>{
        const DNI = req.body.DNI;
        const turno = await turnoModel.getTurnoDni(DNI)
        if (turno) {
            res.status(200).json( turno )
        } else {
            res.status(404).json({ message: 'turno no encontrado' });
        }
    }

  
    static getTurnoId = async(req,res)=>{
        const CodTurno = req.body.CodTurno;
        const turno = await turnoModel.getTurnoId(CodTurno)
        if (turno) {
            res.status(200).json( turno )
        } else {
            res.status(404).json({ message: 'turno no encontrado' });
        }
    }
    
    //crea un turno recibe el paciente la fecha y el codmed para crearlo ej : 
    /* {
        "paciente": {
            "Nombre": "Juan",
            "Apellido": "Pérez",
            "Documento": "12345222678",
            "Domicilio": "Calle Falsa 123",
            "Telefono": "555-1234",
            "Mail": "juan.perez@example.com",
            "FechaNacimiento": "1980-01-01",
            "Sexo": "M",
            "Edad": 44,
            "ObraSocial": "OSDE"
        },
        "turno": {
            "Fecha": "2024-06-15",
            "Horario": "20:00:00",
            "CodEstado": 1,
            "CodTipAtencion": 2
        },
        "MedPersonal": {"CodMedPersonal": 3}
    } */

    static async createTurno (req,res){
        const { paciente, turno, MedPersonal } = req.body;
        let pacienteverif = await pacienteController.getPacienteDni(paciente.Documento)
        if (!pacienteverif) {
             pacienteverif={}
             pacienteverif.CodPaciente = await  pacienteController.createPaciente(paciente)
            //el create devuelve el id del paciente 
            }
            //insertar turno
            turno.CodPaciente = pacienteverif.CodPaciente
            turno.CodMedPersonal = MedPersonal.CodMedPersonal
            //registra el turno solo si el paciente ya no tomo un turno ese dia a ese medico
            const result = await turnoModel.createTurno(turno);
            if (result === null) {
                res.status(400).json({ message: 'Turno duplicado para el mismo paciente con el mismo médico en la misma fecha' });
            } else {
                res.status(201).json({ CodTurno: result });
            }
    }
    static async deleteTurno (req, res) {
        const { CodTurno } = req.params;
        
            const result = await turnoModel.deleteTurno(CodTurno);
            if (result) {
                res.status(200).json({ message: 'Turno eliminado exitosamente' });
            } else {
                res.status(400).json({ message: 'No se pudo eliminar el turno' });
            }
        
    }
    
}

//que hacer con el sobreturno
export const turno = {
    getTurnolibre: asyncHandler(turnoController.getTurnolibre),
    getTurnos: asyncHandler(turnoController.getTurnos),
    getTurnoDni: asyncHandler(turnoController.getTurnoDni),
    getTurnoId: asyncHandler(turnoController.getTurnoId),
    createTurno: asyncHandler(turnoController.createTurno),
    deleteTurno: asyncHandler(turnoController.deleteTurno),
};

const calcularTurnos = (agenda, fechaInicial, now) => {
    //variables  
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
    const turnosDisponibles = {
        "Lunes": [],
        "Martes": [],
        "Miercoles": [],
        "Jueves": [],
        "Viernes": []
    };
    // Ajustar la fecha inicial si es sábado o domingo
    if (fechaInicial.getDay() === 6) { // Sábado
        fechaInicial.setDate(fechaInicial.getDate() + 2); // Pasar al próximo lunes
    } else if (fechaInicial.getDay() === 0) { // Domingo
        fechaInicial.setDate(fechaInicial.getDate() + 1); // Pasar al próximo lunes
    }
    // armar fechas y horarios de lunes a viernes
    for (let i = 0; i < 5; i++) {
        const fecha = new Date(fechaInicial);
        fecha.setDate(fechaInicial.getDate() + i);
        const diaSemana = diasSemana[fecha.getDay()];
        // Solo considerar de lunes a viernes
        if (fecha.getDay() >= 1 && fecha.getDay() <= 5) {
            // Verificar si el médico atiende en este día
            if (agenda[diaSemana.toLowerCase()] === 1) {
                turnosDisponibles[diaSemana] = obtenerHorarios(agenda, fecha, now);
            } else {
                turnosDisponibles[diaSemana] = [];
            }
        }
    }

    return turnosDisponibles;
};

const obtenerHorarios = (agenda, fecha, now) => {
    const horarios = [];
    const tiempoTurno = agenda.TiempoTurno;
    const jornada = agenda.Jornada;

    const turnos = [
        { activo: agenda.TurnoMañana, horarioInicio: agenda.HorarioM },
        { activo: agenda.TurnoTarde, horarioInicio: agenda.HorarioT }
    ];

    turnos.forEach(turno => {
        if (turno.activo === 1) {
            let hora = new Date(fecha);
            const [horas, minutos, segundos] = turno.horarioInicio.split(':').map(Number);
            hora.setHours(horas, minutos, segundos, 0);

            let finTurno = new Date(hora);
            finTurno.setHours(horas + jornada, minutos, segundos, 0);

            while (hora < finTurno) {
                if (hora >= now) {
                    horarios.push(new Date(hora));
                }
                hora.setMinutes(hora.getMinutes() + tiempoTurno);
            }
        }
    });

    return horarios;
}

const filtrarTurnosTomados = (turnosDisponibles, turnosTomados) => {
    const turnosFiltrados = {};
    // cambia el formato de la lista de turnos para el filtrado 
    const turnosTomadosSet = new Set(turnosTomados.map(turno => {
        const fechaTurno = new Date(turno.fecha);
        const [horas, minutos, segundos] = turno.horario.split(':').map(Number);
        fechaTurno.setUTCHours(horas, minutos, segundos, 0);
        return fechaTurno.toISOString();
    }));
    for (let dia in turnosDisponibles) {
        turnosFiltrados[dia] = turnosDisponibles[dia].filter(turno => {
            return !turnosTomadosSet.has(turno.toISOString());
        });
    }
    return turnosFiltrados;
};
//corta la hora del registro de la fecha y asigna la hora del turno
const sumarHoraAlDia = (turnos) => {
        return turnos.map(turno => {
          const fecha = new Date(turno.fecha);
          // Restablecer la hora a 0 
          fecha.setUTCHours(0, 0, 0, 0);  
          // Sumar las horas, minutos y segundos a la fecha 
          const [horas, minutos, segundos] = turno.Horario.split(':').map(Number);
          fecha.setUTCHours(fecha.getUTCHours() + horas);
          fecha.setUTCMinutes(fecha.getUTCMinutes() + minutos);
          fecha.setUTCSeconds(fecha.getUTCSeconds() + segundos);
          //retorna la coleccion de turnos
          return {
            ...turno,
            fecha: fecha.toISOString()
          };
        });
      };
