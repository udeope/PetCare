import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Calendar, User, Weight, Thermometer, ArrowLeft, Download } from 'lucide-react';
import { Mascota, HistorialMedico as HistorialType } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function HistorialMedico() {
  const { id } = useParams<{ id: string }>();
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [historial, setHistorial] = useState<HistorialType[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar datos de la mascota
        const mascotasResponse = await fetch('/data/mascotas.json');
        const mascotas = await mascotasResponse.json();
        const mascotaEncontrada = mascotas.find((m: Mascota) => m.id === id);
        setMascota(mascotaEncontrada);

        // Cargar historial médico
        const historialResponse = await fetch('/data/historial_medico.json');
        const historialData = await historialResponse.json();
        const historialFiltrado = historialData.filter((h: HistorialType) => h.id_mascota === id);
        
        // Ordenar por fecha descendente
        historialFiltrado.sort((a: HistorialType, b: HistorialType) => 
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        
        setHistorial(historialFiltrado);
      } catch (error) {
        console.error('Error cargando historial médico:', error);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  const getTipoColor = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'consulta general':
        return 'bg-blue-100 text-blue-800';
      case 'vacunación':
        return 'bg-green-100 text-green-800';
      case 'urgencia':
        return 'bg-red-100 text-red-800';
      case 'cirugía':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!mascota) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Cargando historial médico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to={`/mascota/${mascota.id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Perfil
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-pet-secondary">
              Historial Médico de {mascota.nombre}
            </h1>
            <p className="text-gray-600">
              {historial.length} registro{historial.length !== 1 ? 's' : ''} médico{historial.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar PDF
        </Button>
      </div>

      {/* Información de la mascota */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <img
              src={mascota.foto}
              alt={mascota.nombre}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-pet-secondary">{mascota.nombre}</h2>
              <p className="text-gray-600">{mascota.especie} • {mascota.raza} • {mascota.edad} años</p>
              <p className="text-sm text-gray-500">Peso actual: {mascota.peso} kg</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline del historial */}
      <div className="space-y-6">
        {historial.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No hay registros médicos
              </h3>
              <p className="text-gray-500 mb-4">
                El historial médico de {mascota.nombre} está vacío
              </p>
              <Button>Agregar Primera Consulta</Button>
            </CardContent>
          </Card>
        ) : (
          historial.map((registro, index) => (
            <Card key={registro.id} className="relative">
              {/* Línea de tiempo */}
              {index < historial.length - 1 && (
                <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gray-200" />
              )}
              
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-pet-primary rounded-full p-2 relative z-10">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{registro.tipo}</CardTitle>
                      <CardDescription className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          {new Date(registro.fecha).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center">
                          <User className="mr-1 h-4 w-4" />
                          {registro.veterinario}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  
                  <Badge className={getTipoColor(registro.tipo)}>
                    {registro.tipo}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Diagnóstico */}
                <div>
                  <h4 className="font-medium text-pet-secondary mb-2">Diagnóstico</h4>
                  <p className="text-gray-700">{registro.diagnostico}</p>
                </div>
                
                {/* Tratamiento */}
                <div>
                  <h4 className="font-medium text-pet-secondary mb-2">Tratamiento</h4>
                  <p className="text-gray-700">{registro.tratamiento}</p>
                </div>
                
                {/* Mediciones */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Weight className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-500">Peso</span>
                    </div>
                    <p className="font-semibold text-pet-secondary">{registro.peso} kg</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Thermometer className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-500">Temperatura</span>
                    </div>
                    <p className="font-semibold text-pet-secondary">{registro.temperatura}°C</p>
                  </div>
                  <div className="text-center col-span-2">
                    <div className="flex items-center justify-center mb-1">
                      <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-500">Próxima Cita</span>
                    </div>
                    <p className="font-semibold text-pet-secondary">
                      {new Date(registro.proxima_cita).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                
                {/* Observaciones */}
                {registro.observaciones && (
                  <div>
                    <h4 className="font-medium text-pet-secondary mb-2">Observaciones</h4>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800 text-sm">{registro.observaciones}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Botón para agregar nueva consulta */}
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="text-center py-8">
          <FileText className="h-8 w-8 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Agregar Nueva Consulta
          </h3>
          <p className="text-gray-500 mb-4">
            Registra una nueva visita al veterinario
          </p>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Agregar Consulta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
