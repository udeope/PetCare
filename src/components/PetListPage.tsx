import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Mascota } from '../types';
import PetForm from './PetForm';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Link } from 'react-router-dom';

const PetListPage = () => {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Mascota | undefined>(undefined);

  useEffect(() => {
    const fetchMascotas = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data, error } = await supabase
          .from('mascotas')
          .select('*')
          .eq('user_id', session.user.id);
        if (error) {
          console.error('Error fetching mascotas:', error);
        } else {
          setMascotas(data);
        }
      }
    };
    fetchMascotas();
  }, []);

  const handleSave = (pet: Mascota) => {
    if (selectedPet) {
      setMascotas(mascotas.map(m => m.id === pet.id ? pet : m));
    } else {
      setMascotas([...mascotas, pet]);
    }
    setShowForm(false);
    setSelectedPet(undefined);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mis Mascotas</h1>
        <Button onClick={() => { setSelectedPet(undefined); setShowForm(true); }}>
          Agregar Mascota
        </Button>
      </div>

      {showForm && (
        <div className="mb-4">
          <PetForm pet={selectedPet} onSave={handleSave} />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mascotas.map(mascota => (
          <Card key={mascota.id}>
            <CardHeader>
              <CardTitle>{mascota.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{mascota.especie} - {mascota.raza}</p>
              <div className="mt-4 flex space-x-2">
                <Link to={`/mascota/${mascota.id}`}>
                  <Button variant="outline">Ver Perfil</Button>
                </Link>
                <Button onClick={() => { setSelectedPet(mascota); setShowForm(true); }}>
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PetListPage;