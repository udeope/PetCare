import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { VisitaMedica } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import MedicalVisitForm from './MedicalVisitForm';

interface MedicalVisitListProps {
  mascotaId: string;
}

const MedicalVisitList = ({ mascotaId }: MedicalVisitListProps) => {
  const [visits, setVisits] = useState<VisitaMedica[]>([]);
  const [editingVisit, setEditingVisit] = useState<VisitaMedica | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchVisits = async () => {
      const { data, error } = await supabase
        .from('visitas_medicas')
        .select('*')
        .eq('mascota_id', mascotaId)
        .order('fecha', { ascending: false });
      if (error) console.error('Error fetching visits:', error);
      else setVisits(data);
    };
    fetchVisits();
  }, [mascotaId]);

  const handleSave = (visit: VisitaMedica) => {
    if (editingVisit) {
      setVisits(visits.map(v => v.id === visit.id ? visit : v));
    } else {
      setVisits([visit, ...visits]);
    }
    setShowForm(false);
    setEditingVisit(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Historial de Visitas Médicas</CardTitle>
        <Button onClick={() => { setShowForm(true); setEditingVisit(null); }}>
          Registrar Visita
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <MedicalVisitForm
            mascotaId={mascotaId}
            visit={editingVisit || undefined}
            onSave={handleSave}
          />
        )}
        <div className="space-y-4 mt-4">
          {visits.map(visit => (
            <div key={visit.id} className="p-4 border rounded-lg">
              <div className="flex justify-between">
                <h3 className="font-bold">{visit.motivo}</h3>
                <span className="text-sm text-gray-500">{new Date(visit.fecha).toLocaleDateString()}</span>
              </div>
              <p><strong>Diagnóstico:</strong> {visit.diagnostico}</p>
              <p><strong>Tratamiento:</strong> {visit.tratamiento}</p>
              {visit.notas && <p><strong>Notas:</strong> {visit.notas}</p>}
              <Button variant="outline" size="sm" className="mt-2" onClick={() => { setEditingVisit(visit); setShowForm(true); }}>
                Editar
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalVisitList;