import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../lib/supabaseClient';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { VisitaMedica } from '../types';

const visitSchema = z.object({
  fecha: z.string().min(1, 'La fecha es requerida'),
  motivo: z.string().min(1, 'El motivo es requerido'),
  diagnostico: z.string().optional(),
  tratamiento: z.string().optional(),
  notas: z.string().optional(),
});

type VisitFormData = z.infer<typeof visitSchema>;

interface MedicalVisitFormProps {
  mascotaId: string;
  visit?: VisitaMedica;
  onSave: (visit: VisitaMedica) => void;
}

const MedicalVisitForm = ({ mascotaId, visit, onSave }: MedicalVisitFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<VisitFormData>({
    resolver: zodResolver(visitSchema),
    defaultValues: visit ? {
      ...visit,
      fecha: new Date(visit.fecha).toISOString().substring(0, 10),
    } : {},
  });

  const onSubmit = async (data: VisitFormData) => {
    if (visit) {
      // Update existing visit
      const { data: updatedVisit, error } = await supabase
        .from('visitas_medicas')
        .update({ ...data, mascota_id: mascotaId })
        .eq('id', visit.id)
        .select()
        .single();
      if (error) throw error;
      onSave(updatedVisit);
    } else {
      // Create new visit
      const { data: newVisit, error } = await supabase
        .from('visitas_medicas')
        .insert([{ ...data, mascota_id: mascotaId }])
        .select()
        .single();
      if (error) throw error;
      onSave(newVisit);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{visit ? 'Editar Visita Médica' : 'Registrar Visita Médica'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Fecha</label>
            <Input type="date" {...register('fecha')} />
            {errors.fecha && <p className="text-red-500">{errors.fecha.message}</p>}
          </div>
          <div>
            <label>Motivo</label>
            <Input {...register('motivo')} />
            {errors.motivo && <p className="text-red-500">{errors.motivo.message}</p>}
          </div>
          <div>
            <label>Diagnóstico</label>
            <Textarea {...register('diagnostico')} />
          </div>
          <div>
            <label>Tratamiento</label>
            <Textarea {...register('tratamiento')} />
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

export default MedicalVisitForm;