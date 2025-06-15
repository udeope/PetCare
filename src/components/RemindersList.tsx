// src/components/RemindersList.tsx
import React, { useEffect, useState } from 'react';
import { getAllUpcomingReminders, type Reminder } from '@/lib/reminders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area'; // For potentially long lists
import { CalendarDays, AlertTriangle } from 'lucide-react'; // Icons

const RemindersList: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Fetch reminders for the next 30 days by default
      const upcomingReminders = getAllUpcomingReminders(30);
      setReminders(upcomingReminders);
    } catch (e) {
      console.error("Error fetching reminders:", e);
      setError("Failed to load reminders. Please check the data files or console for more information.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading reminders...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 text-destructive" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarDays className="mr-2 h-5 w-5" />
          Upcoming Reminders (Next 30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reminders.length === 0 ? (
          <p>No upcoming appointments or vaccinations in the next 30 days.</p>
        ) : (
          <ScrollArea className="h-[300px] pr-4"> {/* Adjust height as needed */}
            <ul className="space-y-3">
              {reminders.map((reminder) => (
                <li key={`${reminder.eventType}-${reminder.eventId}`} className="p-3 border rounded-md shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg">{reminder.petName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(reminder.eventDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                        {reminder.eventTime && ` at ${reminder.eventTime}`}
                      </p>
                    </div>
                    <Badge variant={reminder.eventType === 'appointment' ? 'default' : 'secondary'}>
                      {reminder.eventType === 'appointment' ? 'Appointment' : 'Vaccination'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-md">{reminder.eventName}</p>
                  {reminder.details && (
                    <p className="mt-1 text-xs text-gray-500">{reminder.details}</p>
                  )}
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default RemindersList;
