import citasData from '@/../public/data/citas.json';
import vacunasData from '@/../public/data/vacunas.json';
import mascotasData from '@/../public/data/mascotas.json';
import type { Cita, Mascota, Vacuna } from '@/types';

// Define a unified reminder type
export interface Reminder {
  petId: string;
  petName: string;
  eventId: string;
  eventType: 'appointment' | 'vaccination';
  eventDate: string; // ISO date string "YYYY-MM-DD"
  eventTime?: string; // Optional, for appointments "HH:MM"
  eventName: string; // e.g., "Consulta General" or "Vacuna Múltiple DHPP"
  details?: string; // e.g., Veterinarian or vaccine lot
}

// Helper to get pet name from ID
const getPetName = (petId: string, mascotas: Mascota[]): string => {
  const pet = mascotas.find(m => m.id === petId);
  return pet ? pet.nombre : 'Unknown Pet';
};

// Function to get upcoming appointments
const getUpcomingAppointments = (
  mascotas: Mascota[],
  citas: Cita[],
  daysInFuture: number
): Reminder[] => {
  const reminders: Reminder[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futureDateLimit = new Date(today);
  futureDateLimit.setDate(today.getDate() + daysInFuture);

  citas.forEach(cita => {
    const eventDate = new Date(cita.fecha);
    eventDate.setHours(0,0,0,0);

    if (isNaN(eventDate.getTime())) {
        console.warn(`Invalid date found for cita ID: ${cita.id}, date: ${cita.fecha}`);
        return;
    }

    if (eventDate >= today && eventDate <= futureDateLimit && cita.estado === 'Programada') {
      reminders.push({
        petId: cita.id_mascota,
        petName: getPetName(cita.id_mascota, mascotas),
        eventId: cita.id,
        eventType: 'appointment',
        eventDate: cita.fecha,
        eventTime: cita.hora,
        eventName: cita.tipo,
        details: `Vet: ${cita.veterinario || 'N/A'} - Clinic: ${cita.clinica || 'N/A'}`,
      });
    }
  });
  return reminders;
};

// Function to get upcoming vaccinations
const getUpcomingVaccinations = (
  mascotas: Mascota[],
  vacunas: Vacuna[],
  daysInFuture: number
): Reminder[] => {
  const reminders: Reminder[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futureDateLimit = new Date(today);
  futureDateLimit.setDate(today.getDate() + daysInFuture);

  vacunas.forEach(vacuna => {
    if (vacuna.proxima_dosis) {
      const eventDate = new Date(vacuna.proxima_dosis);
      eventDate.setHours(0,0,0,0);

      if (isNaN(eventDate.getTime())) {
          console.warn(`Invalid date found for vacuna ID: ${vacuna.id}, proxima_dosis: ${vacuna.proxima_dosis}`);
          return;
      }

      const relevantStates = ["Activa", "Próximo Vencimiento"];
      const currentState = vacuna.estado || "Activa";

      if (eventDate >= today && eventDate <= futureDateLimit && relevantStates.includes(currentState)) {
        reminders.push({
          petId: vacuna.id_mascota,
          petName: getPetName(vacuna.id_mascota, mascotas),
          eventId: vacuna.id,
          eventType: 'vaccination',
          eventDate: vacuna.proxima_dosis,
          eventName: vacuna.nombre,
          details: `Lab: ${vacuna.laboratorio || 'N/A'}, Vet: ${vacuna.veterinario || 'N/A'}`,
        });
      }
    }
  });
  return reminders;
};

// Main function to get all reminders
export const getAllUpcomingReminders = (daysInFuture: number = 30): Reminder[] => {
  const typedMascotasData = mascotasData as Mascota[];
  const typedCitasData = citasData as Cita[];
  const typedVacunasData = vacunasData as Vacuna[];

  const appointmentReminders = getUpcomingAppointments(typedMascotasData, typedCitasData, daysInFuture);
  const vaccinationReminders = getUpcomingVaccinations(typedMascotasData, typedVacunasData, daysInFuture);

  const allReminders = [...appointmentReminders, ...vaccinationReminders];

  allReminders.sort((a, b) => {
    const dateA = new Date(a.eventDate).getTime();
    const dateB = new Date(b.eventDate).getTime();
    if (isNaN(dateA) || isNaN(dateB)) {
        return 0;
    }
    return dateA - dateB;
  });

  return allReminders;
};
