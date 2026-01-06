import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Mascota, Usuario, Cita, Vacuna, HistorialMedico } from '../types';

interface PetCareState {
  usuario: Usuario | null;
  mascotas: Mascota[];
  citas: Cita[];
  vacunas: Vacuna[];
  historialMedico: HistorialMedico[];
  loading: boolean;
  error: string | null;
}

interface PetCareContextType extends PetCareState {
  refetch: () => Promise<void>;
  getMascotaById: (id: string) => Mascota | undefined;
  getCitasByMascota: (mascotaId: string) => Cita[];
  getVacunasByMascota: (mascotaId: string) => Vacuna[];
  getHistorialByMascota: (mascotaId: string) => HistorialMedico[];
  addMascota: (mascota: Mascota) => void;
}

const PetCareContext = createContext<PetCareContextType | undefined>(undefined);

interface PetCareProviderProps {
  children: ReactNode;
}

export function PetCareProvider({ children }: PetCareProviderProps) {
  const [state, setState] = useState<PetCareState>({
    usuario: null,
    mascotas: [],
    citas: [],
    vacunas: [],
    historialMedico: [],
    loading: true,
    error: null
  });

  const fetchAllData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const [usuariosRes, mascotasRes, citasRes, vacunasRes, historialRes] = await Promise.all([
        fetch('/data/usuarios.json'),
        fetch('/data/mascotas.json'),
        fetch('/data/citas.json'),
        fetch('/data/vacunas.json'),
        fetch('/data/historial_medico.json')
      ]);

      if (!usuariosRes.ok || !mascotasRes.ok || !citasRes.ok || !vacunasRes.ok || !historialRes.ok) {
        throw new Error('Error al cargar algunos datos');
      }

      const [usuarios, mascotas, citas, vacunas, historialMedico] = await Promise.all([
        usuariosRes.json(),
        mascotasRes.json(),
        citasRes.json(),
        vacunasRes.json(),
        historialRes.json()
      ]);

      const usuario = usuarios[0] as Usuario;
      const mascotasUsuario = (mascotas as Mascota[]).filter(
        (m: Mascota) => m.id_usuario === usuario.id
      );

      setState({
        usuario,
        mascotas: mascotasUsuario,
        citas: citas as Cita[],
        vacunas: vacunas as Vacuna[],
        historialMedico: historialMedico as HistorialMedico[],
        loading: false,
        error: null
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      console.error('Error cargando datos de PetCare:', err);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const getMascotaById = useCallback(
    (id: string) => state.mascotas.find(m => m.id === id),
    [state.mascotas]
  );

  const getCitasByMascota = useCallback(
    (mascotaId: string) => state.citas.filter(c => c.id_mascota === mascotaId),
    [state.citas]
  );

  const getVacunasByMascota = useCallback(
    (mascotaId: string) => state.vacunas.filter(v => v.id_mascota === mascotaId),
    [state.vacunas]
  );

  const getHistorialByMascota = useCallback(
    (mascotaId: string) => state.historialMedico.filter(h => h.id_mascota === mascotaId),
    [state.historialMedico]
  );

  const addMascota = useCallback((mascota: Mascota) => {
    setState(prev => ({
      ...prev,
      mascotas: [...prev.mascotas, mascota]
    }));
  }, []);

  const value: PetCareContextType = {
    ...state,
    refetch: fetchAllData,
    getMascotaById,
    getCitasByMascota,
    getVacunasByMascota,
    getHistorialByMascota,
    addMascota
  };

  return (
    <PetCareContext.Provider value={value}>
      {children}
    </PetCareContext.Provider>
  );
}

export function usePetCare(): PetCareContextType {
  const context = useContext(PetCareContext);
  if (context === undefined) {
    throw new Error('usePetCare debe usarse dentro de un PetCareProvider');
  }
  return context;
}
