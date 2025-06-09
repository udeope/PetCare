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
import UserProfile from './components/UserProfile'; // Added UserProfile import
import SettingsPage from './components/SettingsPage'; // Added SettingsPage import
import { Mascota, Usuario } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Simular autenticación de usuario
    const loadUserData = async () => {
      try {
        const usuariosResponse = await fetch('/data/usuarios.json');
        const usuarios = await usuariosResponse.json();
        setCurrentUser(usuarios[0]); // Usar el primer usuario como usuario autenticado

        const mascotasResponse = await fetch('/data/mascotas.json');
        const mascotasData = await mascotasResponse.json();
        setMascotas(mascotasData.filter((mascota: Mascota) => mascota.id_usuario === usuarios[0].id));
      } catch (error) {
        console.error('Error cargando datos del usuario:', error);
      }
    };

    loadUserData();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Header 
          user={currentUser} 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="flex">
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
            mascotas={mascotas}
          />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Dashboard mascotas={mascotas} user={currentUser} />} />
              <Route path="/mascota/:id" element={<PerfilMascota />} />
              <Route path="/historial/:id" element={<HistorialMedico />} />
              <Route path="/vacunas/:id" element={<Vacunas />} />
              <Route path="/citas" element={<Citas />} />
              <Route path="/agregar-mascota" element={<AgregarMascota onMascotaAdded={(mascota) => setMascotas([...mascotas, mascota])} />} />
              <Route path="/perfil" element={<UserProfile user={currentUser} />} /> {/* Added UserProfile route */}
              <Route path="/configuracion" element={<SettingsPage />} /> {/* Added SettingsPage route */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
