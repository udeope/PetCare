// src/lib/reminders.test.ts
import { getAllUpcomingReminders, type Reminder } from './reminders';
import type { Cita, Mascota, Vacuna } from '@/types';

// Mock the JSON data modules
jest.mock('@/../public/data/citas.json', () => ([]), { virtual: true });
jest.mock('@/../public/data/vacunas.json', () => ([]), { virtual: true });
jest.mock('@/../public/data/mascotas.json', () => ([]), { virtual: true });

// Helper to set mock data for a test
const setMockData = (mockCitas: Cita[], mockVacunas: Vacuna[], mockMascotas: Mascota[]) => {
  jest.doMock('@/../public/data/citas.json', () => mockCitas, { virtual: true });
  jest.doMock('@/../public/data/vacunas.json', () => mockVacunas, { virtual: true });
  jest.doMock('@/../public/data/mascotas.json', () => mockMascotas, { virtual: true });
};

// Utility to get date strings
const getFutureDateString = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

const todayString = getFutureDateString(0);
const tomorrowString = getFutureDateString(1);
const in5DaysString = getFutureDateString(5);
const in10DaysString = getFutureDateString(10);
const in35DaysString = getFutureDateString(35);

const mockMascotasBase: Mascota[] = [
  { id: 'pet1', nombre: 'Buddy', especie: 'Dog', raza: 'Golden Retriever', edad: 5, peso: 30, color: 'Golden', genero: 'Macho', fecha_nacimiento: '2019-01-01', id_usuario: 'user1' },
  { id: 'pet2', nombre: 'Lucy', especie: 'Cat', raza: 'Siamese', edad: 3, peso: 5, color: 'Cream', genero: 'Hembra', fecha_nacimiento: '2021-01-01', id_usuario: 'user1' },
];

describe('getAllUpcomingReminders', () => {
  beforeEach(() => {
    // Reset mocks before each test
    setMockData([], [], []);
    // Need to re-require the module to pick up new mocks if using jest.doMock
    // For this structure, direct import should work if mocks are set before module is loaded by test.
    // If issues, consider dynamic import or jest.resetModules() + requireActual strategy.
  });

  it('should return an empty array when there are no upcoming events', () => {
    setMockData([], [], mockMascotasBase);
    const reminders = getAllUpcomingReminders(30);
    expect(reminders).toEqual([]);
  });

  it('should return upcoming appointments within the date range', () => {
    const mockCitas: Cita[] = [
      { id: 'c1', id_mascota: 'pet1', fecha: tomorrowString, hora: '10:00', tipo: 'Checkup', veterinario: 'Dr. Smith', clinica: 'Vet Clinic', direccion: '', telefono: '', estado: 'Programada' },
      { id: 'c2', id_mascota: 'pet2', fecha: in35DaysString, hora: '11:00', tipo: 'Dental', veterinario: 'Dr. Jones', clinica: 'Vet Clinic', direccion: '', telefono: '', estado: 'Programada' }, // Out of 30-day range
    ];
    setMockData(mockCitas, [], mockMascotasBase);
    const reminders = getAllUpcomingReminders(30);
    expect(reminders.length).toBe(1);
    expect(reminders[0].eventId).toBe('c1');
    expect(reminders[0].petName).toBe('Buddy');
    expect(reminders[0].eventType).toBe('appointment');
  });

  it('should return upcoming vaccinations within the date range', () => {
    const mockVacunas: Vacuna[] = [
      { id: 'v1', id_mascota: 'pet2', nombre: 'Rabies', fecha_aplicacion: '2023-01-01', proxima_dosis: in5DaysString, estado: 'Activa' },
      { id: 'v2', id_mascota: 'pet1', nombre: 'Flu', fecha_aplicacion: '2023-01-01', proxima_dosis: in35DaysString, estado: 'Próximo Vencimiento' }, // Out of 30-day range
    ];
    setMockData([], mockVacunas, mockMascotasBase);
    const reminders = getAllUpcomingReminders(30);
    expect(reminders.length).toBe(1);
    expect(reminders[0].eventId).toBe('v1');
    expect(reminders[0].petName).toBe('Lucy');
    expect(reminders[0].eventType).toBe('vaccination');
  });

  it('should return a mix of appointments and vaccinations, sorted by date', () => {
    const mockCitas: Cita[] = [
      { id: 'c1', id_mascota: 'pet1', fecha: in10DaysString, hora: '10:00', tipo: 'Checkup', veterinario: 'Dr. Smith', clinica: 'Vet Clinic', direccion: '', telefono: '', estado: 'Programada' },
    ];
    const mockVacunas: Vacuna[] = [
      { id: 'v1', id_mascota: 'pet2', nombre: 'Rabies', fecha_aplicacion: '2023-01-01', proxima_dosis: in5DaysString, estado: 'Activa' },
    ];
    setMockData(mockCitas, mockVacunas, mockMascotasBase);
    const reminders = getAllUpcomingReminders(30);
    expect(reminders.length).toBe(2);
    expect(reminders[0].eventId).toBe('v1'); // Vaccination in 5 days
    expect(reminders[1].eventId).toBe('c1'); // Appointment in 10 days
  });

  it('should not include appointments that are not "Programada"', () => {
    const mockCitas: Cita[] = [
      { id: 'c1', id_mascota: 'pet1', fecha: tomorrowString, hora: '10:00', tipo: 'Checkup', veterinario: 'Dr. Smith', clinica: 'Vet Clinic', direccion: '', telefono: '', estado: 'Completada' },
    ];
    setMockData(mockCitas, [], mockMascotasBase);
    const reminders = getAllUpcomingReminders(30);
    expect(reminders.length).toBe(0);
  });

  it('should not include vaccinations that are "Vencida"', () => {
    const mockVacunas: Vacuna[] = [
      { id: 'v1', id_mascota: 'pet2', nombre: 'Rabies', fecha_aplicacion: '2023-01-01', proxima_dosis: tomorrowString, estado: 'Vencida' },
    ];
     setMockData([], mockVacunas, mockMascotasBase);
    const reminders = getAllUpcomingReminders(30);
    expect(reminders.length).toBe(0);
  });

  it('should correctly map pet names', () => {
    const mockCitas: Cita[] = [
      { id: 'c1', id_mascota: 'pet1', fecha: tomorrowString, hora: '10:00', tipo: 'Checkup', veterinario: 'Dr. Smith', clinica: 'Vet Clinic', direccion: '', telefono: '', estado: 'Programada' },
      { id: 'c2', id_mascota: 'unknownPet', fecha: in5DaysString, hora: '11:00', tipo: 'Follow-up', veterinario: 'Dr. Doe', clinica: 'Vet Clinic', direccion: '', telefono: '', estado: 'Programada' },
    ];
    setMockData(mockCitas, [], mockMascotasBase);
    const reminders = getAllUpcomingReminders(30);
    expect(reminders.find(r => r.eventId === 'c1')?.petName).toBe('Buddy');
    expect(reminders.find(r => r.eventId === 'c2')?.petName).toBe('Unknown Pet');
  });

  it('should handle events exactly on the boundary of daysInFuture', () => {
    const boundaryDate = getFutureDateString(7);
    const mockCitas: Cita[] = [
      { id: 'c1', id_mascota: 'pet1', fecha: boundaryDate, hora: '10:00', tipo: 'Checkup', veterinario: 'Dr. Smith', clinica: 'Vet Clinic', direccion: '', telefono: '', estado: 'Programada' },
    ];
    setMockData(mockCitas, [], mockMascotasBase);
    const reminders = getAllUpcomingReminders(7); // Test with 7 days window
    expect(reminders.length).toBe(1);
    expect(reminders[0].eventId).toBe('c1');
  });

   it('should handle an event on today date', () => {
    const mockCitas: Cita[] = [
      { id: 'c1', id_mascota: 'pet1', fecha: todayString, hora: '10:00', tipo: 'Checkup Today', veterinario: 'Dr. Smith', clinica: 'Vet Clinic', direccion: '', telefono: '', estado: 'Programada' },
    ];
    setMockData(mockCitas, [], mockMascotasBase);
    const reminders = getAllUpcomingReminders(7);
    expect(reminders.length).toBe(1);
    expect(reminders[0].eventName).toBe('Checkup Today');
  });

});
