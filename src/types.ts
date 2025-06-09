export interface Mascota {
  id: string;
  user_id: string;
  nombre: string;
  especie: string;
  raza: string;
  fecha_nacimiento: string;
  foto?: string;
  edad?: number;
  peso?: number;
  genero?: 'Macho' | 'Hembra';
  color?: string;
  estado_salud?: string;
  microchip?: string;
  esterilizado?: boolean;
  ultima_visita?: string;
  observaciones?: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  avatar_url?: string;
}

export interface VisitaMedica {
  id: string;
  mascota_id: string;
  fecha: string;
  motivo: string;
  diagnostico?: string;
  tratamiento?: string;
  notas?: string;
}

export interface HistorialMedico {
    id: string;
    id_mascota: string;
    fecha: string;
    tipo: string;
    diagnostico: string;
    tratamiento: string;
    veterinario: string;
    notas: string;
}

export interface Vacuna {
    id: string;
    id_mascota: string;
    nombre: string;
    fecha_aplicacion: string;
    proxima_dosis: string;
    lote: string;
    veterinario: string;
    estado: 'Vigente' | 'Próximo Vencimiento' | 'Vencida';
}

export interface Cita {
    id: string;
    id_mascota: string;
    fecha: string;
    hora: string;
    motivo: string;
    veterinario: string;
    clinica: string;
    estado: 'Programada' | 'Cancelada' | 'Completada';
    tipo: string;
}
