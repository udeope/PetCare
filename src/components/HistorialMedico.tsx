import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Calendar, User, Weight, Thermometer, ArrowLeft, Download } from 'lucide-react';
import { Mascota, HistorialMedico as HistorialType } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// Input, Select, Label might be needed for the next step, not strictly this one
// import { Input } from "./ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
// import { Label } from "./ui/label";
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function HistorialMedico() {
  const { id } = useParams<{ id: string }>();
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [historial, setHistorial] = useState<HistorialType[]>([]); // Full unfiltered list

  // NEW: State for filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedTipo, setSelectedTipo] = useState<string>(''); // '' or 'all' for no filter
  const [selectedVeterinario, setSelectedVeterinario] = useState<string>(''); // '' or 'all' for no filter

  const [filteredHistorial, setFilteredHistorial] = useState<HistorialType[]>([]);

  // NEW: State for select options
  const [uniqueTipos, setUniqueTipos] = useState<string[]>([]);
  const [uniqueVeterinarios, setUniqueVeterinarios] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const mascotasResponse = await fetch('/data/mascotas.json');
        const mascotasData = await mascotasResponse.json();
        const mascotaEncontrada = mascotasData.find((m: Mascota) => m.id === id);
        setMascota(mascotaEncontrada);

        const historialResponse = await fetch('/data/historial_medico.json');
        const allHistorialData = await historialResponse.json();
        const petHistorial = allHistorialData.filter((h: HistorialType) => h.id_mascota === id);
        
        petHistorial.sort((a: HistorialType, b: HistorialType) =>
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        
        setHistorial(petHistorial); // Set the full history

        // Populate unique options for filters
        const tipos = new Set(petHistorial.map(h => h.tipo));
        setUniqueTipos(['', ...Array.from(tipos)]); // Add '' for "All types"

        const veterinarios = new Set(petHistorial.map(h => h.veterinario).filter(Boolean)); // Filter out undefined/null vets
        setUniqueVeterinarios(['', ...Array.from(veterinarios as string[])]); // Add '' for "All vets"

      } catch (error) {
        console.error('Error cargando historial médico:', error);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  // NEW: Effect for filtering
  useEffect(() => {
    let currentFiltered = [...historial];

    // Search term filter (checking a few key fields)
    if (searchTerm) {
      currentFiltered = currentFiltered.filter(item => {
        const term = searchTerm.toLowerCase();
        return (
          item.diagnostico?.toLowerCase().includes(term) ||
          item.tratamiento?.toLowerCase().includes(term) ||
          item.observaciones?.toLowerCase().includes(term) ||
          item.tipo?.toLowerCase().includes(term) ||
          item.veterinario?.toLowerCase().includes(term)
        );
      });
    }

    // Date range filter
    if (startDate) {
      currentFiltered = currentFiltered.filter(item => {
        try {
          return new Date(item.fecha) >= new Date(startDate);
        } catch (e) { return true; } // Ignore invalid item.fecha
      });
    }
    if (endDate) {
      currentFiltered = currentFiltered.filter(item => {
        try {
          // Add 1 day to endDate to make it inclusive of the selected end day
          const inclusiveEndDate = new Date(endDate);
          inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);
          return new Date(item.fecha) < inclusiveEndDate;
        } catch (e) { return true; }
      });
    }

    // Selected type filter
    if (selectedTipo && selectedTipo !== '') { // Check for '' explicitly
      currentFiltered = currentFiltered.filter(item => item.tipo === selectedTipo);
    }

    // Selected veterinarian filter
    if (selectedVeterinario && selectedVeterinario !== '') { // Check for '' explicitly
      currentFiltered = currentFiltered.filter(item => item.veterinario === selectedVeterinario);
    }

    setFilteredHistorial(currentFiltered);
  }, [historial, searchTerm, startDate, endDate, selectedTipo, selectedVeterinario]);


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

      {/* HERE WILL BE THE FILTER CARD - TO BE ADDED IN NEXT STEP */}
      {/* For now, this subtask only prepares the logic. */}
      {/* Example of how states would be used by filter controls (conceptual for this step):
      <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      ...etc. for other filters
      */}

      {/* Timeline del historial - USES filteredHistorial NOW */}
      <div className="space-y-6">
        {filteredHistorial.length === 0 ? ( // Check filteredHistorial
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {historial.length > 0 ? 'No hay registros que coincidan con los filtros' : 'No hay registros médicos'}
              </h3>
              <p className="text-gray-500 mb-4">
                {historial.length > 0 ? 'Intenta ajustar los filtros o revisa el historial completo.' : `El historial médico de ${mascota.nombre} está vacío`}
              </p>
              {historial.length === 0 && <Button>Agregar Primera Consulta</Button>}
            </CardContent>
          </Card>
        ) : (
          // Make sure this map uses filteredHistorial
          filteredHistorial.map((registro, index) => (
            <Card key={registro.id} className="relative">
              {/* Línea de tiempo - logic might need adjustment if list is filtered */}
              {/* This visual line might be less relevant if items are non-contiguous due to filtering. */}
              {/* For now, keep it, but it might need to be re-evaluated. */}
              {index < filteredHistorial.length - 1 && (
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
