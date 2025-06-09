import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Heart, Shield, Stethoscope, Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import { Mascota, Usuario, Cita, Vacuna } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface DashboardProps {
  mascotas: Mascota[];
  user: Usuario | null;
}

export default function Dashboard({ mascotas, user }: DashboardProps) {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [vacunas, setVacunas] = useState<Vacuna[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const citasResponse = await fetch('/data/citas.json');
        const citasData = await citasResponse.json();
        setCitas(citasData);

        const vacunasResponse = await fetch('/data/vacunas.json');
        const vacunasData = await vacunasResponse.json();
        setVacunas(vacunasData);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };

    loadData();
  }, []);

  const proximasCitas = citas
    .filter(cita => cita.estado === 'Programada')
    .filter(cita => mascotas.some(mascota => mascota.id === cita.id_mascota))
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .slice(0, 3);

  const vacunasVenciendo = vacunas
    .filter(vacuna => vacuna.estado === 'Próximo Vencimiento')
    .filter(vacuna => mascotas.some(mascota => mascota.id === vacuna.id_mascota));

  const getMascotaById = (id: string) => mascotas.find(m => m.id === id);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-to-r from-pet-primary to-pet-primary/80 rounded-2xl p-8 text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(101, 193, 120, 0.8), rgba(101, 193, 120, 0.8)), url('/images/familia-mascotas.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            ¡Bienvenido de vuelta, {user?.nombre}!
          </h1>
          <p className="text-pet-light/90 mb-6">
            Gestiona el cuidado de tus {mascotas.length} mascota{mascotas.length !== 1 ? 's' : ''} de forma integral
          </p>
          <Link to="/agregar-mascota">
            <Button variant="secondary" className="bg-white text-pet-primary hover:bg-pet-light">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Nueva Mascota
            </Button>
          </Link>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mascotas</CardTitle>
            <Heart className="h-4 w-4 text-pet-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pet-secondary">{mascotas.length}</div>
            <p className="text-xs text-muted-foreground">
              Límite: {user?.limite_mascotas || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas Citas</CardTitle>
            <Calendar className="h-4 w-4 text-pet-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pet-secondary">{proximasCitas.length}</div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vacunas al Día</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pet-secondary">
              {vacunas.filter(v => v.estado === 'Activa').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Total aplicadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado General</CardTitle>
            <Stethoscope className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Excelente</div>
            <p className="text-xs text-muted-foreground">
              Todas las mascotas sanas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mis Mascotas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="mr-2 h-5 w-5 text-pet-primary" />
              Mis Mascotas
            </CardTitle>
            <CardDescription>
              Resumen del estado de tus compañeros
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mascotas.map((mascota) => (
              <Link
                key={mascota.id}
                to={`/mascota/${mascota.id}`}
                className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <img
                  src={mascota.foto}
                  alt={mascota.nombre}
                  className="h-12 w-12 rounded-full object-cover mr-4"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-pet-secondary">{mascota.nombre}</h3>
                    <Badge 
                      variant={mascota.estado_salud === 'Excelente' ? 'default' : 'secondary'}
                      className={mascota.estado_salud === 'Excelente' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {mascota.estado_salud}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {mascota.especie} • {mascota.raza} • {mascota.edad} años
                  </p>
                  <p className="text-xs text-gray-500">
                    Última visita: {new Date(mascota.ultima_visita).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </Link>
            ))}
            
            {mascotas.length === 0 && (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No tienes mascotas registradas</p>
                <Link to="/agregar-mascota">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Primera Mascota
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Próximas Citas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-pet-accent" />
              Próximas Citas
            </CardTitle>
            <CardDescription>
              No olvides las citas programadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {proximasCitas.map((cita) => {
              const mascota = getMascotaById(cita.id_mascota);
              return (
                <div key={cita.id} className="flex items-center p-3 rounded-lg border">
                  <div className="bg-pet-accent/10 p-2 rounded-full mr-4">
                    <Calendar className="h-5 w-5 text-pet-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-pet-secondary">
                        {mascota?.nombre} - {cita.tipo}
                      </h3>
                      <Badge variant="outline">
                        {new Date(cita.fecha).toLocaleDateString('es-ES')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{cita.veterinario}</p>
                    <p className="text-xs text-gray-500">{cita.hora} - {cita.clinica}</p>
                  </div>
                </div>
              );
            })}

            {proximasCitas.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No tienes citas próximas</p>
                <Link to="/citas">
                  <Button variant="outline">Ver Todas las Citas</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alertas de vacunas */}
      {vacunasVenciendo.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-800">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Vacunas por Vencer
            </CardTitle>
            <CardDescription className="text-amber-700">
              Estas vacunas necesitan renovación pronto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {vacunasVenciendo.map((vacuna) => {
                const mascota = getMascotaById(vacuna.id_mascota);
                return (
                  <div key={vacuna.id} className="flex items-center justify-between p-2 bg-white rounded">
                    <div>
                      <p className="font-medium">{mascota?.nombre} - {vacuna.nombre}</p>
                      <p className="text-sm text-gray-600">
                        Vence: {new Date(vacuna.proxima_dosis).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Programar Cita
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
