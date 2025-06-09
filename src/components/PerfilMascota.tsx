import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mascota, HistorialMedico, Vacuna, Cita } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import {
  AlertTriangle,
  Cake,
  CalendarDays,
  Dog,
  Edit3,
  FileText,
  Heart,
  Syringe,
  PlusCircle,
  Ruler,
  Stethoscope,
  Weight,
  Tag,
  ShieldCheck,
  Info
} from 'lucide-react';
import MedicalVisitList from './MedicalVisitList';
import VaccinationList from './VaccinationList';
import AppointmentList from './AppointmentList';
import { generatePetHistoryPdf } from '../lib/pdfGenerator';
import { supabase } from '../lib/supabaseClient';

export default function PerfilMascota() {
  const { id: mascotaId } = useParams<{ id: string }>();
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [historial, setHistorial] = useState<HistorialMedico[]>([]);
  const [vacunas, setVacunas] = useState<Vacuna[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!mascotaId) return;
      setLoading(true);
      try {
        const [mascotaRes, historialRes, vacunasRes] = await Promise.all([
          fetch('/data/mascotas.json').then(res => res.json()),
          fetch('/data/historial_medico.json').then(res => res.json()),
          fetch('/data/vacunas.json').then(res => res.json()),
        ]);

        const currentMascota = mascotaRes.find((m: Mascota) => m.id === mascotaId);
        setMascota(currentMascota);
        setHistorial(historialRes.filter((h: HistorialMedico) => h.id_mascota === mascotaId).sort((a: HistorialMedico, b: HistorialMedico) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 3)); // Show recent 3, sorted
        setVacunas(vacunasRes.filter((v: Vacuna) => v.id_mascota === mascotaId));

      } catch (error) {
        console.error("Error fetching pet data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [mascotaId]);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p className="text-muted-foreground">Cargando perfil de la mascota...</p></div>;
  }

  if (!mascota) {
    return <div className="flex justify-center items-center h-full"><p className="text-destructive">Mascota no encontrada.</p></div>;
  }

  const getInitials = (name: string) => name.charAt(0).toUpperCase();
  const upcomingVacunas = vacunas
    .filter(v => v.estado === 'Próximo Vencimiento' || (v.estado !== 'Vencida' && new Date(v.proxima_dosis) >= new Date()))
    .sort((a,b) => new Date(a.proxima_dosis).getTime() - new Date(b.proxima_dosis).getTime())
    .slice(0,3);
  const vencidasCount = vacunas.filter(v => v.estado === 'Vencida').length;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      {/* Pet Header Card */}
      <Card className="overflow-hidden bg-card">
        <CardHeader className="p-0 relative">
          <div className="h-48 bg-gradient-to-r from-pet-primary/70 to-pet-accent/70 w-full" />
          <div className="absolute top-20 left-6 flex items-end space-x-4">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              <AvatarImage src={mascota.foto} alt={mascota.nombre} />
              <AvatarFallback className="text-4xl bg-muted text-muted-foreground">
                {getInitials(mascota.nombre)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-bold text-white" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>{mascota.nombre}</h1>
              <p className="text-lg text-gray-200" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>{mascota.especie} - {mascota.raza}</p>
            </div>
          </div>
           <div className="absolute top-4 right-4">
             {/* <Link to={`/mascota/${mascotaId}/editar`}> */}
              <Button variant="secondary" size="sm" className="bg-background/80 hover:bg-background text-foreground">
                <Edit3 className="mr-2 h-4 w-4" />
                Editar Mascota
              </Button>
            {/* </Link> */}
          </div>
        </CardHeader>
        <CardContent className="pt-20 p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center">
          <div className="flex items-center space-x-2 text-sm text-foreground">
            <Cake className="h-5 w-5 text-pet-accent" /> 
            <span>{mascota.edad} años</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-foreground">
            <Weight className="h-5 w-5 text-pet-accent" /> 
            <span>{mascota.peso} kg</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-foreground">
            {mascota.genero === 'Macho' ? <Dog className="h-5 w-5 text-pet-accent" /> : <CatIcon className="h-5 w-5 text-pet-accent" /> }
            <span>{mascota.genero}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-foreground">
            <Tag className="h-5 w-5 text-pet-accent" /> 
            <span>{mascota.color}</span>
          </div>
          <Badge 
            className={`col-span-2 md:col-span-1 justify-center text-xs ${mascota.estado_salud === 'Excelente' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-400'}`}
          >
            {mascota.estado_salud}
          </Badge>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details Card */}
        <Card className="lg:col-span-2 bg-card text-foreground">
          <CardHeader>
            <div className="flex items-center">
                <Info className="h-6 w-6 mr-3 text-pet-primary" />
                <CardTitle className="text-xl">Detalles de la Mascota</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <p><strong>Especie:</strong> <span className="text-muted-foreground">{mascota.especie}</span></p>
                <p><strong>Raza:</strong> <span className="text-muted-foreground">{mascota.raza}</span></p>
                <p><strong>Edad:</strong> <span className="text-muted-foreground">{mascota.edad} años</span></p>
                <p><strong>Peso:</strong> <span className="text-muted-foreground">{mascota.peso} kg</span></p>
                <p><strong>Género:</strong> <span className="text-muted-foreground">{mascota.genero}</span></p>
                <p><strong>Color:</strong> <span className="text-muted-foreground">{mascota.color}</span></p>
                <p><strong>Nacimiento:</strong> <span className="text-muted-foreground">{new Date(mascota.fecha_nacimiento).toLocaleDateString('es-ES')}</span></p>
                <p><strong>Microchip:</strong> <span className="text-muted-foreground">{mascota.microchip || 'N/A'}</span></p>
                <p><strong>Esterilizado:</strong> <span className="text-muted-foreground">{mascota.esterilizado ? 'Sí' : 'No'}</span></p>
                <p><strong>Última Visita:</strong> <span className="text-muted-foreground">{new Date(mascota.ultima_visita).toLocaleDateString('es-ES')}</span></p>
            </div>
            {mascota.observaciones && (
                <>
                    <Separator className="my-3" />
                    <div>
                        <h4 className="font-semibold mb-1 text-sm">Observaciones Adicionales:</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line bg-muted/50 p-3 rounded-md">{mascota.observaciones}</p>
                    </div>
                </>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="bg-card text-foreground">
          <CardHeader>
            <div className="flex items-center">
                <PlusCircle className="h-6 w-6 mr-3 text-pet-primary" />
                <CardTitle className="text-xl">Acciones Rápidas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to={`/historial/${mascotaId}#nueva-entrada`}>
                <Stethoscope className="mr-2 h-4 w-4" /> Registrar Visita Médica
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to={`/vacunas/${mascotaId}#nueva-vacuna`}>
                <Syringe className="mr-2 h-4 w-4" /> Añadir Vacuna
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to={`/citas?mascotaId=${mascotaId}`}>
                <CalendarDays className="mr-2 h-4 w-4" /> Programar Cita
              </Link>
            </Button>
            <Button
              className="w-full justify-start"
              variant="default"
              onClick={async () => {
                if (mascota) {
                  const { data: visitas } = await supabase.from('visitas_medicas').select('*').eq('id_mascota', mascota.id);
                  const { data: vacunas } = await supabase.from('vacunas').select('*').eq('id_mascota', mascota.id);
                  generatePetHistoryPdf(mascota, visitas || [], vacunas || []);
                }
              }}
            >
              <FileText className="mr-2 h-4 w-4" /> Exportar a PDF
            </Button>
          </CardContent>
        </Card>
      </div>

      {mascotaId && <MedicalVisitList mascotaId={mascotaId} />}

      {mascotaId && <VaccinationList mascotaId={mascotaId} />}

      {mascotaId && <AppointmentList mascotaId={mascotaId} />}
    </div>
  );
}

// Placeholder for CatIcon if not available in lucide-react, or use a generic pet icon
const CatIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 5.4L15 3v5.5c0 1.4-1.1 2.5-2.5 2.5S10 9.9 10 8.5V3L4 5.4C4 10 8 15 12 16.5c4-1.5 8-6.5 8-11.1z"/>
    <path d="M10 3L6 2.2"/>
    <path d="M14 3l4-0.8"/>
  </svg>
);
