/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { PetCareProvider, usePetCare } from './PetCareContext';

// Mock de fetch
const mockUsuarios = [
  {
    id: 'user1',
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan@test.com',
    telefono: '123456789',
    direccion: 'Calle Test 123',
    fecha_registro: '2024-01-01',
    plan: 'premium',
    limite_mascotas: 5
  }
];

const mockMascotas = [
  {
    id: 'pet1',
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
    id: 'pet2',
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

const mockCitas = [
  {
    id: 'cita1',
    id_mascota: 'pet1',
    fecha: '2024-02-15',
    hora: '10:00',
    tipo: 'Consulta',
    veterinario: 'Dr. García',
    clinica: 'Clínica Test',
    direccion: 'Calle Vet 456',
    telefono: '987654321',
    estado: 'Programada'
  }
];

const mockVacunas = [
  {
    id: 'vac1',
    id_mascota: 'pet1',
    nombre: 'Rabia',
    fecha_aplicacion: '2024-01-15',
    proxima_dosis: '2025-01-15',
    estado: 'Activa'
  }
];

const mockHistorial = [
  {
    id: 'hist1',
    id_mascota: 'pet1',
    fecha: '2024-01-15',
    tipo: 'Consulta General',
    diagnostico: 'Sano',
    veterinario: 'Dr. García'
  }
];

// Componente de prueba que usa el contexto
function TestComponent() {
  const { usuario, mascotas, citas, vacunas, loading, error, getMascotaById } = usePetCare();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div data-testid="usuario">{usuario?.nombre}</div>
      <div data-testid="mascotas-count">{mascotas.length}</div>
      <div data-testid="citas-count">{citas.length}</div>
      <div data-testid="vacunas-count">{vacunas.length}</div>
      <div data-testid="mascota-pet1">{getMascotaById('pet1')?.nombre}</div>
    </div>
  );
}

describe('PetCareContext', () => {
  beforeEach(() => {
    global.fetch = jest.fn((url: string) => {
      if (url.includes('usuarios')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUsuarios)
        });
      }
      if (url.includes('mascotas')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMascotas)
        });
      }
      if (url.includes('citas')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCitas)
        });
      }
      if (url.includes('vacunas')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockVacunas)
        });
      }
      if (url.includes('historial')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockHistorial)
        });
      }
      return Promise.reject(new Error('URL no reconocida'));
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debe mostrar estado de carga inicialmente', () => {
    render(
      <PetCareProvider>
        <TestComponent />
      </PetCareProvider>
    );

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('debe cargar y mostrar datos del usuario', async () => {
    render(
      <PetCareProvider>
        <TestComponent />
      </PetCareProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('usuario')).toHaveTextContent('Juan');
    });
  });

  it('debe filtrar mascotas por usuario', async () => {
    render(
      <PetCareProvider>
        <TestComponent />
      </PetCareProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('mascotas-count')).toHaveTextContent('2');
    });
  });

  it('debe cargar citas correctamente', async () => {
    render(
      <PetCareProvider>
        <TestComponent />
      </PetCareProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('citas-count')).toHaveTextContent('1');
    });
  });

  it('debe poder buscar mascota por ID', async () => {
    render(
      <PetCareProvider>
        <TestComponent />
      </PetCareProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('mascota-pet1')).toHaveTextContent('Max');
    });
  });

  it('debe mostrar error cuando falla la carga', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Internal Server Error'
      })
    ) as jest.Mock;

    render(
      <PetCareProvider>
        <TestComponent />
      </PetCareProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it('debe lanzar error si usePetCare se usa fuera del Provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('usePetCare debe usarse dentro de un PetCareProvider');

    consoleSpy.mockRestore();
  });
});
