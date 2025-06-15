// src/components/tests/RemindersList.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RemindersList from '../RemindersList'; // Adjust path as necessary
import * as reminderLib from '@/lib/reminders'; // To mock getAllUpcomingReminders

// Mock the library
jest.mock('@/lib/reminders');
const mockedGetAllUpcomingReminders = reminderLib.getAllUpcomingReminders as jest.MockedFunction<typeof reminderLib.getAllUpcomingReminders>;

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  CalendarDays: () => <svg>CalendarDays</svg>,
  AlertTriangle: () => <svg>AlertTriangle</svg>,
}));


describe('RemindersList Component', () => {
  beforeEach(() => {
    mockedGetAllUpcomingReminders.mockReset();
  });

  it('should display loading state initially', () => {
    mockedGetAllUpcomingReminders.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<RemindersList />);
    expect(screen.getByText('Loading reminders...')).toBeInTheDocument();
  });

  it('should display error state if fetching reminders fails', async () => {
    mockedGetAllUpcomingReminders.mockImplementation(() => {
      throw new Error('Failed to load');
    });
    render(<RemindersList />);
    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
      expect(screen.getByText(/Failed to load reminders/i)).toBeInTheDocument();
    });
  });

  it('should display "no reminders" message when no reminders are returned', async () => {
    mockedGetAllUpcomingReminders.mockReturnValue([]);
    render(<RemindersList />);
    await waitFor(() => {
      expect(screen.getByText(/No upcoming appointments or vaccinations/i)).toBeInTheDocument();
    });
  });

  it('should display a list of reminders correctly', async () => {
    const mockReminders: reminderLib.Reminder[] = [
      { petId: 'p1', petName: 'Rex', eventId: 'e1', eventType: 'appointment', eventDate: '2024-08-15', eventName: 'Annual Checkup', eventTime: '10:00', details: 'Dr. Smith' },
      { petId: 'p2', petName: 'Whiskers', eventId: 'e2', eventType: 'vaccination', eventDate: '2024-08-20', eventName: 'Rabies Shot', details: 'Lot #123' },
    ];
    mockedGetAllUpcomingReminders.mockReturnValue(mockReminders);
    render(<RemindersList />);

    await waitFor(() => {
      expect(screen.getByText('Rex')).toBeInTheDocument();
      expect(screen.getByText('Annual Checkup')).toBeInTheDocument();
      expect(screen.getByText('August 15, 2024 at 10:00')).toBeInTheDocument(); // Check formatted date
      expect(screen.getAllByText('Appointment')[0]).toBeInTheDocument(); // Badge text

      expect(screen.getByText('Whiskers')).toBeInTheDocument();
      expect(screen.getByText('Rabies Shot')).toBeInTheDocument();
      expect(screen.getByText('August 20, 2024')).toBeInTheDocument(); // Check formatted date
      expect(screen.getAllByText('Vaccination')[0]).toBeInTheDocument(); // Badge text
    });
  });

  it('should display reminder details if provided', async () => {
    const mockReminders: reminderLib.Reminder[] = [
      { petId: 'p1', petName: 'Rex', eventId: 'e1', eventType: 'appointment', eventDate: '2024-08-15', eventName: 'Annual Checkup', details: 'Vet: Dr. Canine' },
    ];
    mockedGetAllUpcomingReminders.mockReturnValue(mockReminders);
    render(<RemindersList />);
    await waitFor(() => {
        expect(screen.getByText('Vet: Dr. Canine')).toBeInTheDocument();
    });
  });

});
