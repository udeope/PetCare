export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  fecha_registro: string;
  plan: 'gratuito' | 'premium';
  limite_mascotas: number;
  avatar: string;
}

export interface Mascota {
  id: string;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  peso: number;
  color: string;
  genero: 'Macho' | 'Hembra';
  fecha_nacimiento: string;
  id_usuario: string;
  foto: string;
  estado_salud: string;
  ultima_visita: string;
  proxima_cita: string;
  microchip: string;
  esterilizado: boolean;
  observaciones: string;
}

export interface HistorialMedico {
  id: string;
  id_mascota: string;
  fecha: string;
  tipo: string;
  veterinario: string;
  diagnostico: string;
  tratamiento: string;
  peso: number;
  temperatura: number;
  observaciones: string;
  proxima_cita: string;
}

export interface Vacuna {
  id: string;
  id_mascota: string;
  nombre: string;
  fecha_aplicacion: string;
  proxima_dosis: string;
  veterinario: string;
  lote: string;
  laboratorio: string;
  estado: 'Activa' | 'Vencida' | 'Próximo Vencimiento';
}

export interface Cita {
  id: string;
  id_mascota: string;
  fecha: string;
  hora: string;
  tipo: string;
  veterinario: string;
  clinica: string;
  direccion: string;
  telefono: string;
  estado: 'Programada' | 'Completada' | 'Cancelada';
  motivo: string;
  observaciones: string;
}
