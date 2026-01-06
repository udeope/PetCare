import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
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
import ErrorState from './components/ErrorState';
import LoadingState from './components/LoadingState';
import { PetCareProvider, usePetCare } from './context/PetCareContext';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { usuario, mascotas, loading, error, refetch, addMascota } = usePetCare();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <LoadingState message="Cargando datos de PetCare..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <ErrorState
          title="Error al cargar la aplicación"
          message={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        user={usuario}
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
            <Route path="/" element={<Dashboard />} />
            <Route path="/mascota/:id" element={<PerfilMascota />} />
            <Route path="/historial/:id" element={<HistorialMedico />} />
            <Route path="/vacunas/:id" element={<Vacunas />} />
            <Route path="/citas" element={<Citas />} />
            <Route path="/agregar-mascota" element={<AgregarMascota onMascotaAdded={addMascota} />} />
            <Route path="/perfil" element={<UserProfile user={usuario} />} />
            <Route path="/configuracion" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <PetCareProvider>
        <AppContent />
      </PetCareProvider>
    </Router>
  );
}

export default App;
