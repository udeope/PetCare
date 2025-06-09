import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Phone, Plus, User, CheckCircle, X, AlertCircle } from 'lucide-react';
import { Cita, Mascota } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export default function Citas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar citas
        const citasResponse = await fetch('/data/citas.json');
        const citasData = await citasResponse.json();
        
        // Ordenar por fecha
        citasData.sort((a: Cita, b: Cita) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        setCitas(citasData);

        // Cargar mascotas
        const mascotasResponse = await fetch('/data/mascotas.json');
        const mascotasData = await mascotasResponse.json();
        setMascotas(mascotasData);
      } catch (error) {
        console.error('Error cargando citas:', error);
      }
    };

    loadData();
  }, []);

  const getMascotaById = (id: string) => mascotas.find(m => m.id === id);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Programada':
        return 'bg-blue-100 text-blue-800';
      case 'Completada':
        return 'bg-green-100 text-green-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Programada':
        return <Clock className="h-4 w-4" />;
      case 'Completada':
        return <CheckCircle className="h-4 w-4" />;
      case 'Cancelada':
        return <X className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const citasProgramadas = citas.filter(c => c.estado === 'Programada');
  const citasCompletadas = citas.filter(c => c.estado === 'Completada');
  const citasCanceladas = citas.filter(c => c.estado === 'Cancelada');

  const hoy = new Date();
  const proximasCitas = citasProgramadas.filter(c => new Date(c.fecha) >= hoy);
  const citasVencidas = citasProgramadas.filter(c => new Date(c.fecha) < hoy);

  const CitaCard = ({ cita }: { cita: Cita }) => {
    const mascota = getMascotaById(cita.id_mascota);
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {mascota && (
                <img
                  src={mascota.foto}
                  alt={mascota.nombre}
                  className="h-12 w-12 rounded-full object-cover"
                />
              )}
              <div>
                <CardTitle className="text-lg">
                  {mascota?.nombre} - {cita.tipo}
                </CardTitle>
                <CardDescription className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {new Date(cita.fecha).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {cita.hora}
                  </span>
                </CardDescription>
              </div>
            </div>
            
            <Badge className={getEstadoColor(cita.estado)}>
              <span className="flex items-center">
                {getEstadoIcon(cita.estado)}
                <span className="ml-1">{cita.estado}</span>
              </span>
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Veterinario</p>
            <p className="font-medium flex items-center">
              <User className="mr-1 h-4 w-4" />
              {cita.veterinario}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Clínica</p>
            <p className="font-medium">{cita.clinica}</p>
            <p className="text-sm text-gray-600 flex items-center">
              <MapPin className="mr-1 h-4 w-4" />
              {cita.direccion}
            </p>
            <p className="text-sm text-gray-600 flex items-center">
              <Phone className="mr-1 h-4 w-4" />
              {cita.telefono}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Motivo</p>
            <p className="font-medium">{cita.motivo}</p>
          </div>
          
          {cita.observaciones && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Observaciones:</strong> {cita.observaciones}
              </p>
            </div>
          )}
          
          {cita.estado === 'Programada' && (
            <div className="flex space-x-2 pt-2">
              <Button size="sm" variant="outline">
                Editar
              </Button>
              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                Cancelar
              </Button>
              {new Date(cita.fecha).getTime() <= new Date().getTime() + (24 * 60 * 60 * 1000) && (
                <Button size="sm">
                  Marcar como Completada
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-pet-secondary">Gestión de Citas</h1>
          <p className="text-gray-600">
            {citas.length} cita{citas.length !== 1 ? 's' : ''} registrada{citas.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Cita
        </Button>
      </div>

      {/* Resumen de citas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas Citas</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{proximasCitas.length}</div>
            <p className="text-xs text-muted-foreground">Programadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{citasCompletadas.length}</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
            <X className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{citasCanceladas.length}</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{citasVencidas.length}</div>
            <p className="text-xs text-muted-foreground">Sin completar</p>
          </CardContent>
        </Card>
      </div>

      {/* Citas por vencer hoy */}
      {proximasCitas.filter(c => {
        const fechaCita = new Date(c.fecha);
        const hoy = new Date();
        return fechaCita.toDateString() === hoy.toDateString();
      }).length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Clock className="mr-2 h-5 w-5" />
              Citas de Hoy
            </CardTitle>
            <CardDescription className="text-blue-700">
              No olvides estas citas programadas para hoy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proximasCitas
                .filter(c => {
                  const fechaCita = new Date(c.fecha);
                  const hoy = new Date();
                  return fechaCita.toDateString() === hoy.toDateString();
                })
                .map((cita) => {
                  const mascota = getMascotaById(cita.id_mascota);
                  return (
                    <div key={cita.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center space-x-3">
                        {mascota && (
                          <img
                            src={mascota.foto}
                            alt={mascota.nombre}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">{mascota?.nombre} - {cita.tipo}</p>
                          <p className="text-sm text-gray-600">{cita.hora} - {cita.veterinario}</p>
                        </div>
                      </div>
                      <Button size="sm">Ver Detalles</Button>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs para diferentes vistas */}
      <Tabs defaultValue="programadas" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="programadas">Programadas ({proximasCitas.length})</TabsTrigger>
          <TabsTrigger value="completadas">Completadas ({citasCompletadas.length})</TabsTrigger>
          <TabsTrigger value="canceladas">Canceladas ({citasCanceladas.length})</TabsTrigger>
          <TabsTrigger value="todas">Todas ({citas.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="programadas" className="space-y-4">
          {proximasCitas.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No hay citas programadas
                </h3>
                <p className="text-gray-500 mb-4">
                  Programa una nueva cita para tus mascotas
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Programar Primera Cita
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {proximasCitas.map((cita) => (
                <CitaCard key={cita.id} cita={cita} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completadas" className="space-y-4">
          <div className="grid gap-4">
            {citasCompletadas.map((cita) => (
              <CitaCard key={cita.id} cita={cita} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="canceladas" className="space-y-4">
          <div className="grid gap-4">
            {citasCanceladas.map((cita) => (
              <CitaCard key={cita.id} cita={cita} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="todas" className="space-y-4">
          <div className="grid gap-4">
            {citas.map((cita) => (
              <CitaCard key={cita.id} cita={cita} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
