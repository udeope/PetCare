import {
  getMascotaById,
  getEstadoCitaColor,
  getEstadoVacunaColor,
  getTipoHistorialColor,
  getDiasHasta,
  formatearFecha,
  formatearFechaCompleta,
  esHoy,
  fechaPasada
} from './petUtils';
import { Mascota } from '../types';

describe('petUtils', () => {
  describe('getMascotaById', () => {
    const mascotas: Mascota[] = [
      {
        id: '1',
        nombre: 'Max',
        especie: 'Perro',
        raza: 'Labrador',
        edad: 3,
        peso: 25,
        color: 'Dorado',
        genero: 'Macho',
        fecha_nacimiento: '2021-01-15',
        id_usuario: 'user1'
      },
      {
        id: '2',
        nombre: 'Luna',
        especie: 'Gato',
        raza: 'Siamés',
        edad: 2,
        peso: 4,
        color: 'Blanco',
        genero: 'Hembra',
        fecha_nacimiento: '2022-03-20',
        id_usuario: 'user1'
      }
    ];

    it('debe retornar la mascota correcta por ID', () => {
      const result = getMascotaById(mascotas, '1');
      expect(result?.nombre).toBe('Max');
    });

    it('debe retornar undefined si no encuentra la mascota', () => {
      const result = getMascotaById(mascotas, '999');
      expect(result).toBeUndefined();
    });

    it('debe retornar undefined con array vacío', () => {
      const result = getMascotaById([], '1');
      expect(result).toBeUndefined();
    });
  });

  describe('getEstadoCitaColor', () => {
    it('debe retornar color azul para Programada', () => {
      expect(getEstadoCitaColor('Programada')).toBe('bg-blue-100 text-blue-800');
    });

    it('debe retornar color verde para Completada', () => {
      expect(getEstadoCitaColor('Completada')).toBe('bg-green-100 text-green-800');
    });

    it('debe retornar color rojo para Cancelada', () => {
      expect(getEstadoCitaColor('Cancelada')).toBe('bg-red-100 text-red-800');
    });

    it('debe retornar color gris para estado desconocido', () => {
      expect(getEstadoCitaColor('Otro')).toBe('bg-gray-100 text-gray-800');
    });
  });

  describe('getEstadoVacunaColor', () => {
    it('debe retornar color verde para Activa', () => {
      expect(getEstadoVacunaColor('Activa')).toBe('bg-green-100 text-green-800');
    });

    it('debe retornar color ámbar para Próximo Vencimiento', () => {
      expect(getEstadoVacunaColor('Próximo Vencimiento')).toBe('bg-amber-100 text-amber-800');
    });

    it('debe retornar color rojo para Vencida', () => {
      expect(getEstadoVacunaColor('Vencida')).toBe('bg-red-100 text-red-800');
    });
  });

  describe('getTipoHistorialColor', () => {
    it('debe retornar color azul para consulta general', () => {
      expect(getTipoHistorialColor('Consulta General')).toBe('bg-blue-100 text-blue-800');
    });

    it('debe retornar color verde para vacunación', () => {
      expect(getTipoHistorialColor('VACUNACIÓN')).toBe('bg-green-100 text-green-800');
    });

    it('debe retornar color rojo para urgencia', () => {
      expect(getTipoHistorialColor('urgencia')).toBe('bg-red-100 text-red-800');
    });

    it('debe retornar color púrpura para cirugía', () => {
      expect(getTipoHistorialColor('Cirugía')).toBe('bg-purple-100 text-purple-800');
    });
  });

  describe('getDiasHasta', () => {
    it('debe retornar 0 para fecha de hoy', () => {
      const hoy = new Date().toISOString().split('T')[0];
      expect(getDiasHasta(hoy)).toBe(0);
    });

    it('debe retornar número positivo para fecha futura', () => {
      const futuro = new Date();
      futuro.setDate(futuro.getDate() + 5);
      const fechaFutura = futuro.toISOString().split('T')[0];
      expect(getDiasHasta(fechaFutura)).toBe(5);
    });

    it('debe retornar número negativo para fecha pasada', () => {
      const pasado = new Date();
      pasado.setDate(pasado.getDate() - 3);
      const fechaPasada = pasado.toISOString().split('T')[0];
      expect(getDiasHasta(fechaPasada)).toBe(-3);
    });
  });

  describe('formatearFecha', () => {
    it('debe formatear fecha correctamente', () => {
      const resultado = formatearFecha('2024-01-15');
      expect(resultado).toContain('15');
      expect(resultado).toContain('enero');
      expect(resultado).toContain('2024');
    });

    it('debe retornar "Sin fecha" para undefined', () => {
      expect(formatearFecha(undefined)).toBe('Sin fecha');
    });

    it('debe retornar "Fecha inválida" para formato incorrecto', () => {
      expect(formatearFecha('fecha-invalida')).toBe('Fecha inválida');
    });
  });

  describe('formatearFechaCompleta', () => {
    it('debe incluir el día de la semana', () => {
      const resultado = formatearFechaCompleta('2024-01-15'); // Es lunes
      expect(resultado).toContain('lunes');
    });
  });

  describe('esHoy', () => {
    it('debe retornar true para fecha de hoy', () => {
      const hoy = new Date().toISOString().split('T')[0];
      expect(esHoy(hoy)).toBe(true);
    });

    it('debe retornar false para fecha de ayer', () => {
      const ayer = new Date();
      ayer.setDate(ayer.getDate() - 1);
      expect(esHoy(ayer.toISOString().split('T')[0])).toBe(false);
    });

    it('debe retornar false para fecha de mañana', () => {
      const manana = new Date();
      manana.setDate(manana.getDate() + 1);
      expect(esHoy(manana.toISOString().split('T')[0])).toBe(false);
    });
  });

  describe('fechaPasada', () => {
    it('debe retornar false para fecha de hoy', () => {
      const hoy = new Date().toISOString().split('T')[0];
      expect(fechaPasada(hoy)).toBe(false);
    });

    it('debe retornar true para fecha de ayer', () => {
      const ayer = new Date();
      ayer.setDate(ayer.getDate() - 1);
      expect(fechaPasada(ayer.toISOString().split('T')[0])).toBe(true);
    });

    it('debe retornar false para fecha futura', () => {
      const manana = new Date();
      manana.setDate(manana.getDate() + 1);
      expect(fechaPasada(manana.toISOString().split('T')[0])).toBe(false);
    });
  });
});
