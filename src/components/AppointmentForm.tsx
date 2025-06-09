import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../lib/supabaseClient';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Cita, Mascota } from '../types';
import { useEffect, useState } from 'react';

const appointmentSchema = z.object({
  mascota_id: z.string().min(1, 'Es necesario seleccionar una mascota'),
  fecha: z.string().min(1, 'La fecha es requerida'),
  hora: z.string().min(1, 'La hora es requerida'),
  motivo: z.string().min(1, 'El motivo es requerido'),
  veterinario: z.string().optional(),
  clinica: z.string().optional(),
  notas: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  appointment?: Cita;
  onSave: (appointment: Cita) => void;
  userId: string;
}

const AppointmentForm = ({ appointment, onSave, userId }: AppointmentFormProps) => {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const { register, handleSubmit, formState: { errors } } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: appointment ? {
      ...appointment,
      fecha: new Date(appointment.fecha).toISOString().substring(0, 10),
    } : {},
  });

  useEffect(() => {
    const fetchMascotas = async () => {
      const { data, error } = await supabase
        .from('mascotas')
        .select('*')
        .eq('user_id', userId);
      if (error) console.error('Error fetching mascotas:', error);
      else setMascotas(data);
    };
    fetchMascotas();
  }, [userId]);

  const onSubmit = async (data: AppointmentFormData) => {
    const submissionData = {
        ...data,
        estado: 'Programada' as const,
        tipo: 'Consulta' // O un valor por defecto que prefieras
    };

    if (appointment) {
      // Update existing appointment
      const { data: updatedAppointment, error } = await supabase
        .from('citas')
        .update(submissionData)
        .eq('id', appointment.id)
        .select()
        .single();
      if (error) throw error;
      onSave(updatedAppointment);
    } else {
      // Create new appointment
      const { data: newAppointment, error } = await supabase
        .from('citas')
        .insert([submissionData])
        .select()
        .single();
      if (error) throw error;
      onSave(newAppointment);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{appointment ? 'Editar Cita' : 'Programar Cita'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Mascota</label>
            <select {...register('mascota_id')} className="w-full p-2 border rounded">
              <option value="">Seleccione una mascota</option>
              {mascotas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
            {errors.mascota_id && <p className="text-red-500">{errors.mascota_id.message}</p>}
          </div>
          <div>
            <label>Fecha</label>
            <Input type="date" {...register('fecha')} />
            {errors.fecha && <p className="text-red-500">{errors.fecha.message}</p>}
          </div>
          <div>
            <label>Hora</label>
            <Input type="time" {...register('hora')} />
            {errors.hora && <p className="text-red-500">{errors.hora.message}</p>}
          </div>
          <div>
            <label>Motivo</label>
            <Input {...register('motivo')} />
            {errors.motivo && <p className="text-red-500">{errors.motivo.message}</p>}
          </div>
          <div>
            <label>Veterinario</label>
            <Input {...register('veterinario')} />
          </div>
          <div>
            <label>Clínica</label>
            <Input {...register('clinica')} />
          </div>
          <div>
            <label>Notas</label>
            <Textarea {...register('notas')} />
          </div>
          <Button type="submit">Guardar</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AppointmentForm;