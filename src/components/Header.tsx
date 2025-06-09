import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { supabase } from '../lib/supabaseClient';
import { PawPrint } from 'lucide-react';

const Header = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <PawPrint className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">PetCare</span>
        </Link>
        <nav className="hidden md:flex gap-4">
          <Button variant="ghost" asChild>
            <Link to="/pets">Mis Mascotas</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/citas">Citas</Link>
          </Button>
        </nav>
        <Button variant="outline" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </div>
    </header>
  );
};

export default Header;
