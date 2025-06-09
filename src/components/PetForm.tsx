import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../lib/supabaseClient';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Mascota } from '../types';

const petSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  especie: z.string().min(1, 'La especie es requerida'),
  raza: z.string().optional(),
  fecha_nacimiento: z.string().optional(),
  foto_url: z.string().url().optional(),
});

type PetFormData = z.infer<typeof petSchema>;

interface PetFormProps {
  pet?: Mascota;
  onSave: (pet: Mascota) => void;
}

const PetForm = ({ pet, onSave }: PetFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: pet || {},
  });

  const onSubmit = async (data: PetFormData) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No hay un usuario autenticado');
    }
    const user = session.user;

    if (pet) {
      // Update existing pet
      const { data: updatedPet, error } = await supabase
        .from('mascotas')
        .update({ ...data, user_id: user.id })
        .eq('id', pet.id)
        .select()
        .single();
      if (error) throw error;
      onSave(updatedPet);
    } else {
      // Create new pet
      const { data: newPet, error } = await supabase
        .from('mascotas')
        .insert([{ ...data, user_id: user.id }])
        .select()
        .single();
      if (error) throw error;
      onSave(newPet);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{pet ? 'Editar Mascota' : 'Agregar Mascota'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Nombre</label>
            <Input {...register('nombre')} />
            {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
          </div>
          <div>
            <label>Especie</label>
            <Input {...register('especie')} />
            {errors.especie && <p className="text-red-500">{errors.especie.message}</p>}
          </div>
          <div>
            <label>Raza</label>
            <Input {...register('raza')} />
          </div>
          <div>
            <label>Fecha de Nacimiento</label>
            <Input type="date" {...register('fecha_nacimiento')} />
          </div>
          <div>
            <label>URL de la Foto</label>
            <Input {...register('foto_url')} />
            {errors.foto_url && <p className="text-red-500">{errors.foto_url.message}</p>}
          </div>
          <Button type="submit">Guardar</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PetForm;