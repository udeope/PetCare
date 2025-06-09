import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../lib/supabaseClient';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Vacuna } from '../types';

const vaccineSchema = z.object({
  nombre: z.string().min(1, 'El nombre de la vacuna es requerido'),
  fecha_aplicacion: z.string().min(1, 'La fecha de aplicación es requerida'),
  proxima_dosis: z.string().optional(),
  lote: z.string().optional(),
  veterinario: z.string().optional(),
});

type VaccineFormData = z.infer<typeof vaccineSchema>;

interface VaccinationFormProps {
  mascotaId: string;
  vaccine?: Vacuna;
  onSave: (vaccine: Vacuna) => void;
}

const VaccinationForm = ({ mascotaId, vaccine, onSave }: VaccinationFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<VaccineFormData>({
    resolver: zodResolver(vaccineSchema),
    defaultValues: vaccine ? {
      ...vaccine,
      fecha_aplicacion: new Date(vaccine.fecha_aplicacion).toISOString().substring(0, 10),
      proxima_dosis: vaccine.proxima_dosis ? new Date(vaccine.proxima_dosis).toISOString().substring(0, 10) : '',
    } : {},
  });

  const onSubmit = async (data: VaccineFormData) => {
    const submissionData = {
        ...data,
        id_mascota: mascotaId,
        // TODO: El estado se deberia calcular en base a la fecha de proxima_dosis
        estado: 'Vigente' as const 
    };

    if (vaccine) {
      // Update existing vaccine
      const { data: updatedVaccine, error } = await supabase
        .from('vacunas')
        .update(submissionData)
        .eq('id', vaccine.id)
        .select()
        .single();
      if (error) throw error;
      onSave(updatedVaccine);
    } else {
      // Create new vaccine
      const { data: newVaccine, error } = await supabase
        .from('vacunas')
        .insert([submissionData])
        .select()
        .single();
      if (error) throw error;
      onSave(newVaccine);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{vaccine ? 'Editar Vacuna' : 'Añadir Vacuna'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Nombre de la Vacuna</label>
            <Input {...register('nombre')} />
            {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
          </div>
          <div>
            <label>Fecha de Aplicación</label>
            <Input type="date" {...register('fecha_aplicacion')} />
            {errors.fecha_aplicacion && <p className="text-red-500">{errors.fecha_aplicacion.message}</p>}
          </div>
          <div>
            <label>Próxima Dosis</label>
            <Input type="date" {...register('proxima_dosis')} />
          </div>
           <div>
            <label>Lote</label>
            <Input {...register('lote')} />
          </div>
           <div>
            <label>Veterinario</label>
            <Input {...register('veterinario')} />
          </div>
          <Button type="submit">Guardar</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VaccinationForm;