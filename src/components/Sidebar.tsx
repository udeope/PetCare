import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Plus, X, Stethoscope, Shield, FileText, UserCircle } from 'lucide-react'; // Added UserCircle
import { Mascota } from '../types';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  mascotas: Mascota[];
}

export default function Sidebar({ isOpen, onClose, mascotas }: SidebarProps) {
  const location = useLocation();

  const navigationItems = [
    { href: '/', icon: Home, label: 'Dashboard' },
    { href: '/perfil', icon: UserCircle, label: 'Mi Perfil' }, // Added Mi Perfil link
    { href: '/citas', icon: Calendar, label: 'Citas' },
    { href: '/agregar-mascota', icon: Plus, label: 'Agregar Mascota' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-[hsl(var(--sidebar-border))]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header del sidebar */}
          <div className="flex items-center justify-between p-4 border-b lg:hidden">
            <h2 className="text-lg font-semibold text-[hsl(var(--sidebar-foreground))]">Navegación</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navegación principal */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-[hsl(var(--sidebar-muted-foreground))] uppercase tracking-wider mb-3">
                Menú Principal
              </h3>
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive(item.href)
                      ? "bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))]"
                      : "hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Lista de mascotas */}
            <div>
              <h3 className="text-sm font-medium text-[hsl(var(--sidebar-muted-foreground))] uppercase tracking-wider mb-3">
                Mis Mascotas ({mascotas.length})
              </h3>
              <div className="space-y-1">
                {mascotas.map((mascota) => (
                  <div key={mascota.id} className="space-y-1">
                    <Link
                      to={`/mascota/${mascota.id}`}
                      onClick={onClose}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                        location.pathname === `/mascota/${mascota.id}`
                          ? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))]"
                          : "hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
                      )}
                    >
                      <img
                        src={mascota.foto}
                        alt={mascota.nombre}
                        className="mr-3 h-8 w-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-[hsl(var(--sidebar-foreground))]">{mascota.nombre}</p>
                        <p className="text-xs text-[hsl(var(--sidebar-muted-foreground))]">{mascota.especie}</p>
                      </div>
                    </Link>
                    
                    {/* Submenu para cada mascota */}
                    <div className="ml-6 space-y-1">
                      <Link
                        to={`/historial/${mascota.id}`}
                        onClick={onClose}
                        className={cn(
                          "flex items-center px-3 py-1 text-xs rounded transition-colors",
                          location.pathname === `/historial/${mascota.id}`
                            ? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))]"
                            : "text-[hsl(var(--sidebar-muted-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
                        )}
                      >
                        <FileText className="mr-2 h-3 w-3" />
                        Historial
                      </Link>
                      <Link
                        to={`/vacunas/${mascota.id}`}
                        onClick={onClose}
                        className={cn(
                          "flex items-center px-3 py-1 text-xs rounded transition-colors",
                          location.pathname === `/vacunas/${mascota.id}`
                            ? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))]"
                            : "text-[hsl(var(--sidebar-muted-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
                        )}
                      >
                        <Shield className="mr-2 h-3 w-3" />
                        Vacunas
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </nav>

          {/* Footer del sidebar */}
          <div className="p-4 border-t border-[hsl(var(--sidebar-border))]">
            <div className="text-xs text-[hsl(var(--sidebar-muted-foreground))] text-center">
              <p>PetCare v1.0</p>
              <p>© 2024 Todos los derechos reservados</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
