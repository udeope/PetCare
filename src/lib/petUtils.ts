import { Mascota } from '../types';

/**
 * Busca una mascota por su ID en un array de mascotas
 */
export function getMascotaById(mascotas: Mascota[], id: string): Mascota | undefined {
  return mascotas.find(m => m.id === id);
}

/**
 * Colores para estados de citas
 */
export function getEstadoCitaColor(estado: string): string {
  switch (estado) {
    case 'Programada':
      return 'bg-blue-100 text-blue-800';
    case 'Completada':
      return 'bg-green-100 text-green-800';
    case 'Cancelada':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Colores para estados de vacunas
 */
export function getEstadoVacunaColor(estado: string): string {
  switch (estado) {
    case 'Activa':
      return 'bg-green-100 text-green-800';
    case 'Próximo Vencimiento':
      return 'bg-amber-100 text-amber-800';
    case 'Vencida':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Colores para tipos de historial médico
 */
export function getTipoHistorialColor(tipo: string): string {
  switch (tipo.toLowerCase()) {
    case 'consulta general':
      return 'bg-blue-100 text-blue-800';
    case 'vacunación':
      return 'bg-green-100 text-green-800';
    case 'urgencia':
      return 'bg-red-100 text-red-800';
    case 'cirugía':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Calcula los días restantes hasta una fecha
 */
export function getDiasHasta(fecha: string): number {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const objetivo = new Date(fecha);
  objetivo.setHours(0, 0, 0, 0);
  const diferencia = objetivo.getTime() - hoy.getTime();
  return Math.ceil(diferencia / (1000 * 3600 * 24));
}

/**
 * Formatea una fecha en español
 */
export function formatearFecha(fecha: string | undefined, opciones?: Intl.DateTimeFormatOptions): string {
  if (!fecha) return 'Sin fecha';

  try {
    const date = new Date(fecha);
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    const defaultOpciones: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('es-ES', opciones || defaultOpciones);
  } catch {
    return 'Fecha inválida';
  }
}

/**
 * Formatea una fecha con día de la semana
 */
export function formatearFechaCompleta(fecha: string | undefined): string {
  return formatearFecha(fecha, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Verifica si una fecha es hoy
 */
export function esHoy(fecha: string): boolean {
  const hoy = new Date();
  const fechaComparar = new Date(fecha);
  return fechaComparar.toDateString() === hoy.toDateString();
}

/**
 * Verifica si una fecha ya pasó
 */
export function fechaPasada(fecha: string): boolean {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaComparar = new Date(fecha);
  fechaComparar.setHours(0, 0, 0, 0);
  return fechaComparar < hoy;
}
