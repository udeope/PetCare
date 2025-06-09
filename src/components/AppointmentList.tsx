import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Cita } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import AppointmentForm from './AppointmentForm';
import { Badge } from './ui/badge';

interface AppointmentListProps {
  mascotaId: string;
}

const AppointmentList = ({ mascotaId }: AppointmentListProps) => {
  const [appointments, setAppointments] = useState<Cita[]>([]);
  const [editingAppointment, setEditingAppointment] = useState<Cita | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }

      const { data, error } = await supabase
        .from('citas')
        .select('*, mascota:mascotas(nombre)')
        .eq('id_mascota', mascotaId)
        .order('fecha', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
      } else {
        setAppointments(data as any);
      }
    };
    fetchInitialData();
  }, [mascotaId]);

  const handleSave = (appointment: Cita) => {
    if (editingAppointment) {
      setAppointments(appointments.map(a => a.id === appointment.id ? appointment : a));
    } else {
      setAppointments([appointment, ...appointments]);
    }
    setShowForm(false);
    setEditingAppointment(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Próximas Citas</CardTitle>
        <Button onClick={() => { setShowForm(true); setEditingAppointment(null); }}>
          Programar Cita
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && userId && (
          <AppointmentForm
            userId={userId}
            appointment={editingAppointment || undefined}
            onSave={handleSave}
          />
        )}
        <div className="space-y-4 mt-4">
          {appointments.map(appointment => (
            <div key={appointment.id} className="p-4 border rounded-lg">
              <div className="flex justify-between">
                <h3 className="font-bold">{appointment.motivo}</h3>
                <Badge variant={appointment.estado === 'Programada' ? 'default' : 'secondary'}>{appointment.estado}</Badge>
              </div>
              <p><strong>Mascota:</strong> {(appointment as any).mascota.nombre}</p>
              <p><strong>Fecha:</strong> {new Date(appointment.fecha).toLocaleDateString()} a las {appointment.hora}</p>
              <p><strong>Clínica:</strong> {appointment.clinica || 'N/A'}</p>
              <p><strong>Veterinario:</strong> {appointment.veterinario || 'N/A'}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => { setEditingAppointment(appointment); setShowForm(true); }}>
                Editar
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentList;