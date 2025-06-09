import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PerfilMascota from './components/PerfilMascota';
import HistorialMedico from './components/HistorialMedico';
import Vacunas from './components/Vacunas';
import Citas from './components/Citas';
import AgregarMascota from './components/AgregarMascota';
import UserProfile from './components/UserProfile';
import SettingsPage from './components/SettingsPage';
import { Mascota, Usuario } from './types';
import { supabase } from './lib/supabaseClient';
import AuthComponent from './components/Auth';
import { Session } from '@supabase/supabase-js';
import PetListPage from './components/PetListPage';
import ScrollToTopButton from './components/ScrollToTopButton';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      if (session) {
        try {
          // Aquí puedes cargar los datos del usuario y las mascotas desde Supabase
          // Por ahora, usaremos datos simulados
          const usuariosResponse = await fetch('/data/usuarios.json');
          const usuarios = await usuariosResponse.json();
          const loggedInUser = usuarios.find((u: Usuario) => u.id === session.user.id);
          setCurrentUser(loggedInUser || null);

          const mascotasResponse = await fetch('/data/mascotas.json');
          const mascotasData = await mascotasResponse.json();
          setMascotas(mascotasData.filter((mascota: Mascota) => mascota.user_id === session.user.id));
        } catch (error) {
          console.error('Error cargando datos del usuario:', error);
        }
      }
    };

    loadUserData();
  }, [session]);

  if (!session) {
    return <AuthComponent />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Dashboard mascotas={mascotas} user={currentUser} />} />
            <Route path="/mascota/:id" element={<PerfilMascota />} />
            <Route path="/historial/:id" element={<HistorialMedico />} />
            <Route path="/vacunas/:id" element={<Vacunas />} />
            <Route path="/citas" element={<Citas />} />
            <Route path="/agregar-mascota" element={<AgregarMascota onMascotaAdded={(mascota) => setMascotas([...mascotas, mascota])} />} />
            <Route path="/perfil" element={<UserProfile user={currentUser} />} />
            <Route path="/configuracion" element={<SettingsPage />} />
            <Route path="/mascotas" element={<PetListPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
