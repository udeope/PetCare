// src/types.ts

export interface Mascota {
  id: string;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  peso: number;
  color: string;
  genero: 'Macho' | 'Hembra'; // Kept existing more specific type
  fecha_nacimiento: string; // "YYYY-MM-DD"
  id_usuario: string;
  foto?: string; // Was already present, made optional as per new def
  estado_salud?: string; // Was already present, made optional as per new def
  ultima_visita?: string; // "YYYY-MM-DD", Was already present, made optional as per new def
  proxima_cita?: string; // "YYYY-MM-DD", Was already present, made optional as per new def
  microchip?: string; // Was already present, made optional as per new def
  esterilizado?: boolean; // Was already present, made optional as per new def
  observaciones?: string; // Was already present, made optional as per new def
}

export interface Cita {
  id: string;
  id_mascota: string;
  fecha: string; // "YYYY-MM-DD"
  hora: string; // "HH:MM"
  tipo: string;
  veterinario: string;
  clinica: string;
  direccion: string;
  telefono: string;
  estado: "Programada" | "Completada" | "Cancelada";
  motivo?: string; // Was already present, kept as optional
  observaciones?: string; // Was already present, kept as optional
}

export interface Vacuna {
  id: string;
  id_mascota: string;
  nombre: string;
  fecha_aplicacion: string; // "YYYY-MM-DD"
  proxima_dosis?: string; // "YYYY-MM-DD", optional
  veterinario?: string; // Was already present, kept as optional
  lote?: string; // Was already present, kept as optional
  laboratorio?: string; // Was already present, kept as optional
  estado?: "Activa" | "Próximo Vencimiento" | "Vencida"; // Kept existing, more specific type
}

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  fecha_registro: string; // "YYYY-MM-DD"
  plan: 'gratuito' | 'premium'; // Kept existing, more specific type
  limite_mascotas: number;
  avatar?: string; // Was already present, made optional as per new def
}

export interface HistorialMedico {
    id: string;
    id_mascota: string;
    fecha: string; // "YYYY-MM-DD"
    tipo: string;
    veterinario?: string; // Was already present, kept as optional
    diagnostico: string;
    tratamiento?: string; // Was already present, kept as optional
    peso?: number; // Was already present, kept as optional
    temperatura?: number; // Was already present, kept as optional
    observaciones?: string; // Was already present, kept as optional
    proxima_cita?: string; // "YYYY-MM-DD", Was already present, kept as optional
}
