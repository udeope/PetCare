import { Heart, Menu, User, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom'; // Added Link import
import { Usuario } from '../types';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle'; // Add ThemeToggle import
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface HeaderProps {
  user: Usuario | null;
  onMenuClick: () => void;
}

export default function Header({ user, onMenuClick }: HeaderProps) {
  return (
    <header className="bg-background shadow-sm border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden mr-2 text-foreground"
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="bg-pet-primary rounded-full p-2">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">PetCare</h1>
              <p className="text-sm text-muted-foreground">Cuidado integral para tus mascotas</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle /> {/* Add ThemeToggle component */}
          {user && (
            <>
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-foreground">
                  {user.nombre} {user.apellido}
                </p>
                <p className="text-xs text-muted-foreground capitalize">Plan {user.plan}</p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-foreground">
                        {user.nombre} {user.apellido}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/perfil">
                    <DropdownMenuItem className="text-foreground hover:bg-muted">
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/configuracion">
                    <DropdownMenuItem className="text-foreground hover:bg-muted">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configuración</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive hover:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
