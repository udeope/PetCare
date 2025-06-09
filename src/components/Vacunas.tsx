import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, Calendar, User, ArrowLeft, Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import { Mascota, Vacuna } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function Vacunas() {
  const { id } = useParams<{ id: string }>();
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [vacunas, setVacunas] = useState<Vacuna[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar datos de la mascota
        const mascotasResponse = await fetch('/data/mascotas.json');
        const mascotas = await mascotasResponse.json();
        const mascotaEncontrada = mascotas.find((m: Mascota) => m.id === id);
        setMascota(mascotaEncontrada);

        // Cargar vacunas
        const vacunasResponse = await fetch('/data/vacunas.json');
        const vacunasData = await vacunasResponse.json();
        const vacunasFiltradas = vacunasData.filter((v: Vacuna) => v.id_mascota === id);
        
        // Ordenar por fecha de aplicación descendente
        vacunasFiltradas.sort((a: Vacuna, b: Vacuna) => 
          new Date(b.fecha_aplicacion).getTime() - new Date(a.fecha_aplicacion).getTime()
        );
        
        setVacunas(vacunasFiltradas);
      } catch (error) {
        console.error('Error cargando vacunas:', error);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Activa':
        return 'bg-green-100 text-green-800';
      case 'Próximo Vencimiento':
        return 'bg-amber-100 text-amber-800';
      case 'Vencida':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Activa':
        return <CheckCircle className="h-4 w-4" />;
      case 'Próximo Vencimiento':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Vencida':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getDiasHastaVencimiento = (fechaVencimiento: string) => {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferencia = vencimiento.getTime() - hoy.getTime();
    const dias = Math.ceil(diferencia / (1000 * 3600 * 24));
    return dias;
  };

  if (!mascota) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Cargando información de vacunas...</p>
        </div>
      </div>
    );
  }

  const vacunasActivas = vacunas.filter(v => v.estado === 'Activa');
  const vacunasVenciendo = vacunas.filter(v => v.estado === 'Próximo Vencimiento');
  const vacunasVencidas = vacunas.filter(v => v.estado === 'Vencida');

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
              Vacunas de {mascota.nombre}
            </h1>
            <p className="text-gray-600">
              {vacunas.length} vacuna{vacunas.length !== 1 ? 's' : ''} registrada{vacunas.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Vacuna
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de vacunas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vacunas Activas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{vacunasActivas.length}</div>
            <p className="text-xs text-muted-foreground">Al día</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Por Vencer</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{vacunasVenciendo.length}</div>
            <p className="text-xs text-muted-foreground">Próximo vencimiento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{vacunasVencidas.length}</div>
            <p className="text-xs text-muted-foreground">Requieren renovación</p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de vacunas por vencer */}
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
            <div className="space-y-3">
              {vacunasVenciendo.map((vacuna) => {
                const diasRestantes = getDiasHastaVencimiento(vacuna.proxima_dosis);
                return (
                  <div key={vacuna.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <p className="font-medium">{vacuna.nombre}</p>
                      <p className="text-sm text-gray-600">
                        Vence: {new Date(vacuna.proxima_dosis).toLocaleDateString('es-ES')}
                      </p>
                      <p className="text-xs text-amber-700">
                        {diasRestantes > 0 ? `${diasRestantes} días restantes` : 'Vencida'}
                      </p>
                    </div>
                    <Button size="sm">Programar Renovación</Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de todas las vacunas */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-pet-secondary">Historial Completo de Vacunas</h2>
        
        {vacunas.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No hay vacunas registradas
              </h3>
              <p className="text-gray-500 mb-4">
                El registro de vacunas de {mascota.nombre} está vacío
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Primera Vacuna
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {vacunas.map((vacuna) => (
              <Card key={vacuna.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getEstadoColor(vacuna.estado)}`}>
                        {getEstadoIcon(vacuna.estado)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{vacuna.nombre}</CardTitle>
                        <CardDescription className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            Aplicada: {new Date(vacuna.fecha_aplicacion).toLocaleDateString('es-ES')}
                          </span>
                          <span className="flex items-center">
                            <User className="mr-1 h-4 w-4" />
                            {vacuna.veterinario}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    
                    <Badge className={getEstadoColor(vacuna.estado)}>
                      {vacuna.estado}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Próxima Dosis</p>
                      <p className="font-medium">
                        {new Date(vacuna.proxima_dosis).toLocaleDateString('es-ES')}
                      </p>
                      {vacuna.estado === 'Próximo Vencimiento' && (
                        <p className="text-xs text-amber-600">
                          En {getDiasHastaVencimiento(vacuna.proxima_dosis)} días
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Laboratorio</p>
                      <p className="font-medium">{vacuna.laboratorio}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Lote</p>
                      <p className="font-medium text-xs">{vacuna.lote}</p>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Información adicional */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Shield className="mr-2 h-5 w-5" />
            Calendario de Vacunación Recomendado
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Para Perros:</h4>
              <ul className="text-sm space-y-1">
                <li>• Vacuna múltiple DHPP: Anual</li>
                <li>• Vacuna antirrábica: Anual</li>
                <li>• Vacuna contra la tos de las perreras: Anual</li>
                <li>• Desparasitación: Cada 3 meses</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Para Gatos:</h4>
              <ul className="text-sm space-y-1">
                <li>• Vacuna triple felina: Anual</li>
                <li>• Vacuna contra leucemia felina: Anual</li>
                <li>• Vacuna antirrábica: Anual</li>
                <li>• Desparasitación: Cada 3 meses</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
