import { useState } from 'react';
import { Bell, UserCircle, CreditCard, ShieldAlert, Palette, Edit3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';

export default function SettingsPage() {
  const [notificationPreferences, setNotificationPreferences] = useState({
    appointmentReminders: true,
    vaccineUpdates: true,
    newsletter: false,
    emailFrequency: 'daily',
  });

  const handleNotificationChange = (key: keyof typeof notificationPreferences, value: boolean | string) => {
    setNotificationPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground">Gestiona las preferencias de tu cuenta y la aplicación.</p>
      </header>

      {/* Profile Settings Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserCircle className="h-6 w-6 mr-3 text-pet-primary" />
              <CardTitle className="text-xl">Perfil y Cuenta</CardTitle>
            </div>
            <Link to="/perfil">
              <Button variant="outline" size="sm">
                <Edit3 className="mr-2 h-4 w-4" />
                Editar Perfil
              </Button>
            </Link>
          </div>
          <CardDescription>
            Actualiza tu información personal y gestiona los detalles de tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="profileLink">Información Personal</Label>
            <p className="text-sm text-muted-foreground">
              Nombre, correo electrónico, dirección, etc.
            </p>
          </div>
          <div>
            <Label htmlFor="accountPlan">Plan de Suscripción</Label>
            <p className="text-sm text-muted-foreground">
              Consulta o modifica tu plan actual. (Funcionalidad no implementada)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Bell className="h-6 w-6 mr-3 text-pet-primary" />
            <CardTitle className="text-xl">Preferencias de Notificaciones</CardTitle>
          </div>
          <CardDescription>
            Elige cómo y cuándo quieres recibir notificaciones de PetCare.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2 py-2">
            <Label htmlFor="appointmentReminders" className="flex flex-col space-y-1">
              <span>Recordatorios de Citas</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Recibe alertas para tus próximas citas.
              </span>
            </Label>
            <Switch
              id="appointmentReminders"
              checked={notificationPreferences.appointmentReminders}
              onCheckedChange={(value) => handleNotificationChange('appointmentReminders', value)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between space-x-2 py-2">
            <Label htmlFor="vaccineUpdates" className="flex flex-col space-y-1">
              <span>Actualizaciones de Vacunas</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Notificaciones sobre vacunas vencidas o próximas a vencer.
              </span>
            </Label>
            <Switch
              id="vaccineUpdates"
              checked={notificationPreferences.vaccineUpdates}
              onCheckedChange={(value) => handleNotificationChange('vaccineUpdates', value)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between space-x-2 py-2">
            <Label htmlFor="newsletter" className="flex flex-col space-y-1">
              <span>Boletín Informativo</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Recibe noticias y consejos sobre el cuidado de mascotas.
              </span>
            </Label>
            <Switch
              id="newsletter"
              checked={notificationPreferences.newsletter}
              onCheckedChange={(value) => handleNotificationChange('newsletter', value)}
            />
          </div>
          <Separator />
          <div>
            <Label htmlFor="emailFrequency">Frecuencia de Correo (Resumen)</Label>
            <Select
              value={notificationPreferences.emailFrequency}
              onValueChange={(value) => handleNotificationChange('emailFrequency', value)}
            >
              <SelectTrigger id="emailFrequency" className="w-full md:w-1/2 mt-1">
                <SelectValue placeholder="Selecciona frecuencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diariamente</SelectItem>
                <SelectItem value="weekly">Semanalmente</SelectItem>
                <SelectItem value="monthly">Mensualmente</SelectItem>
                <SelectItem value="never">Nunca</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              Elige la frecuencia para recibir resúmenes por correo electrónico.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Appearance Settings Card - Basic, as theme is in header */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Palette className="h-6 w-6 mr-3 text-pet-primary" />
            <CardTitle className="text-xl">Apariencia</CardTitle>
          </div>
          <CardDescription>
            Personaliza la apariencia de la aplicación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            El selector de tema (claro/oscuro/sistema) se encuentra en la cabecera de la aplicación.
          </p>
          {/* Placeholder for other appearance settings if any in the future */}
        </CardContent>
      </Card>

      {/* Account Management Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <ShieldAlert className="h-6 w-6 mr-3 text-destructive" />
            <CardTitle className="text-xl">Gestión de Cuenta</CardTitle>
          </div>
          <CardDescription>
            Opciones avanzadas de la cuenta, incluyendo la eliminación.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div>
            <Label htmlFor="exportData">Exportar mis datos</Label>
            <Button variant="outline" className="mt-1 w-full md:w-auto">Exportar Datos</Button>
            <p className="text-sm text-muted-foreground mt-1">
              Descarga una copia de todos tus datos y los de tus mascotas.
            </p>
          </div>
          <Separator />
          <div>
            <Label htmlFor="deleteAccount">Eliminar Cuenta</Label>
            <Button variant="destructive" className="mt-1 w-full md:w-auto">Eliminar Mi Cuenta Permanentemente</Button>
             <p className="text-sm text-destructive/80 mt-1">
              Esta acción es irreversible y eliminará todos tus datos de PetCare.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-8">
        <Button size="lg">Guardar Cambios</Button>
      </div>
    </div>
  );
}
