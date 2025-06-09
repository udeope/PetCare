import { useState, useEffect } from 'react';
import { Usuario } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Edit3, UserCircle, CalendarDays, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

interface UserProfileProps {
  user: Usuario | null;
}

export default function UserProfile({ user: initialUser }: UserProfileProps) {
  const [user, setUser] = useState<Usuario | null>(initialUser);

  useEffect(() => {
    // If user is not passed as a prop, or to simulate fetching if needed later
    if (!initialUser) {
      const fetchUser = async () => {
        try {
          // In a real app, you might fetch the user by ID or from a global context
          const usersResponse = await fetch('/data/usuarios.json');
          const users = await usersResponse.json();
          setUser(users[0]); // Default to the first user for now
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUser();
    } else {
      setUser(initialUser);
    }
  }, [initialUser]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Cargando perfil del usuario...</p>
      </div>
    );
  }

  const getInitials = (name: string, apellido: string) => {
    return `${name.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="bg-gray-50 dark:bg-gray-800 p-6 rounded-t-lg">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20 border-2 border-pet-primary">
              <AvatarImage src={user.avatar} alt={`${user.nombre} ${user.apellido}`} />
              <AvatarFallback className="text-2xl bg-pet-primary/20 text-pet-primary">
                {getInitials(user.nombre, user.apellido)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-bold text-pet-secondary">{user.nombre} {user.apellido}</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Gestiona tu información personal y configuración de la cuenta.</CardDescription>
            </div>
            <Button variant="outline" size="icon" className="ml-auto">
              <Edit3 className="h-5 w-5" />
              <span className="sr-only">Editar Perfil</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <section>
            <h3 className="text-xl font-semibold text-pet-secondary mb-4 flex items-center">
              <UserCircle className="mr-2 h-6 w-6 text-pet-primary" />
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" value={user.nombre} readOnly className="bg-gray-50 dark:bg-gray-700" />
              </div>
              <div>
                <Label htmlFor="apellido">Apellido</Label>
                <Input id="apellido" value={user.apellido} readOnly className="bg-gray-50 dark:bg-gray-700" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user.email} readOnly className="bg-gray-50 dark:bg-gray-700" />
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" type="tel" value={user.telefono} readOnly className="bg-gray-50 dark:bg-gray-700" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input id="direccion" value={user.direccion} readOnly className="bg-gray-50 dark:bg-gray-700" />
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-xl font-semibold text-pet-secondary mb-4 flex items-center">
              <ShieldCheck className="mr-2 h-6 w-6 text-pet-primary" />
              Detalles de la Cuenta
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plan">Plan Actual</Label>
                <Input id="plan" value={user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} readOnly className="bg-gray-50 dark:bg-gray-700" />
              </div>
              <div>
                <Label htmlFor="fecha_registro">Miembro Desde</Label>
                <Input id="fecha_registro" value={new Date(user.fecha_registro).toLocaleDateString('es-ES')} readOnly className="bg-gray-50 dark:bg-gray-700" />
              </div>
              <div>
                <Label htmlFor="limite_mascotas">Límite de Mascotas</Label>
                <Input id="limite_mascotas" type="number" value={user.limite_mascotas} readOnly className="bg-gray-50 dark:bg-gray-700" />
              </div>
            </div>
          </section>
          
          <Separator />

          <div className="flex justify-end">
            <Button variant="destructive" className="mr-2">Eliminar Cuenta</Button>
            <Button>Guardar Cambios</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
