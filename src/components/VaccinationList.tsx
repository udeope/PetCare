import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Vacuna } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import VaccinationForm from './VaccinationForm';
import { Badge } from './ui/badge';

interface VaccinationListProps {
  mascotaId: string;
}

const VaccinationList = ({ mascotaId }: VaccinationListProps) => {
  const [vaccines, setVaccines] = useState<Vacuna[]>([]);
  const [editingVaccine, setEditingVaccine] = useState<Vacuna | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchVaccines = async () => {
      const { data, error } = await supabase
        .from('vacunas')
        .select('*')
        .eq('id_mascota', mascotaId)
        .order('fecha_aplicacion', { ascending: false });
      if (error) console.error('Error fetching vaccines:', error);
      else setVaccines(data);
    };
    fetchVaccines();
  }, [mascotaId]);

  const handleSave = (vaccine: Vacuna) => {
    if (editingVaccine) {
      setVaccines(vaccines.map(v => v.id === vaccine.id ? vaccine : v));
    } else {
      setVaccines([vaccine, ...vaccines]);
    }
    setShowForm(false);
    setEditingVaccine(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Registro de Vacunación</CardTitle>
        <Button onClick={() => { setShowForm(true); setEditingVaccine(null); }}>
          Añadir Vacuna
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <VaccinationForm
            mascotaId={mascotaId}
            vaccine={editingVaccine || undefined}
            onSave={handleSave}
          />
        )}
        <div className="space-y-4 mt-4">
          {vaccines.map(vaccine => (
            <div key={vaccine.id} className="p-4 border rounded-lg">
              <div className="flex justify-between">
                <h3 className="font-bold">{vaccine.nombre}</h3>
                <Badge variant={vaccine.estado === 'Vigente' ? 'default' : 'destructive'}>{vaccine.estado}</Badge>
              </div>
              <p><strong>Aplicada:</strong> {new Date(vaccine.fecha_aplicacion).toLocaleDateString()}</p>
              <p><strong>Próxima Dosis:</strong> {vaccine.proxima_dosis ? new Date(vaccine.proxima_dosis).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Lote:</strong> {vaccine.lote || 'N/A'}</p>
              <p><strong>Veterinario:</strong> {vaccine.veterinario || 'N/A'}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => { setEditingVaccine(vaccine); setShowForm(true); }}>
                Editar
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VaccinationList;