import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Upload, ArrowLeft, Save } from 'lucide-react';
import { Mascota } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AgregarMascotaProps {
  onMascotaAdded: (mascota: Mascota) => void;
}

export default function AgregarMascota({ onMascotaAdded }: AgregarMascotaProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    edad: '',
    peso: '',
    color: '',
    genero: '',
    fecha_nacimiento: '',
    microchip: '',
    esterilizado: false,
    observaciones: '',
    foto: '/images/perro-feliz.jpg' // Foto por defecto
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const especies = [
    { value: 'Perro', label: 'Perro' },
    { value: 'Gato', label: 'Gato' },
    { value: 'Conejo', label: 'Conejo' },
    { value: 'Hamster', label: 'Hámster' },
    { value: 'Ave', label: 'Ave' },
    { value: 'Reptil', label: 'Reptil' },
    { value: 'Pez', label: 'Pez' },
    { value: 'Otro', label: 'Otro' }
  ];

  const razasPerro = [
    'Golden Retriever', 'Labrador', 'Pastor Alemán', 'Bulldog Francés', 'Beagle',
    'Poodle', 'Rottweiler', 'Yorkshire Terrier', 'Chihuahua', 'Boxer', 'Mestizo'
  ];

  const razasGato = [
    'Persa', 'Maine Coon', 'Siamés', 'Ragdoll', 'British Shorthair',
    'Bengalí', 'Sphynx', 'Russian Blue', 'Abisinio', 'Mestizo'
  ];

  const getRazas = () => {
    if (formData.especie === 'Perro') return razasPerro;
    if (formData.especie === 'Gato') return razasGato;
    return [];
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.especie) {
      newErrors.especie = 'La especie es obligatoria';
    }

    if (!formData.raza.trim()) {
      newErrors.raza = 'La raza es obligatoria';
    }

    if (!formData.edad || parseInt(formData.edad) < 0 || parseInt(formData.edad) > 30) {
      newErrors.edad = 'La edad debe ser un número entre 0 y 30';
    }

    if (!formData.peso || parseFloat(formData.peso) <= 0 || parseFloat(formData.peso) > 100) {
      newErrors.peso = 'El peso debe ser un número entre 0.1 y 100 kg';
    }

    if (!formData.color.trim()) {
      newErrors.color = 'El color es obligatorio';
    }

    if (!formData.genero) {
      newErrors.genero = 'El género es obligatorio';
    }

    if (!formData.fecha_nacimiento) {
      newErrors.fecha_nacimiento = 'La fecha de nacimiento es obligatoria';
    } else {
      const fechaNacimiento = new Date(formData.fecha_nacimiento);
      const hoy = new Date();
      if (fechaNacimiento > hoy) {
        newErrors.fecha_nacimiento = 'La fecha de nacimiento no puede ser futura';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo al escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Limpiar raza cuando cambia la especie
    if (field === 'especie') {
      setFormData(prev => ({
        ...prev,
        raza: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular guardado (en una app real, esto sería una llamada a la API)
      const nuevaMascota: Mascota = {
        id: Date.now().toString(), // ID temporal
        nombre: formData.nombre,
        especie: formData.especie,
        raza: formData.raza,
        edad: parseInt(formData.edad),
        peso: parseFloat(formData.peso),
        color: formData.color,
        genero: formData.genero as 'Macho' | 'Hembra',
        fecha_nacimiento: formData.fecha_nacimiento,
        id_usuario: 'user_1', // Usuario actual
        foto: formData.foto,
        estado_salud: 'Excelente',
        ultima_visita: new Date().toISOString().split('T')[0],
        proxima_cita: '',
        microchip: formData.microchip || `982000${Date.now().toString().slice(-9)}`,
        esterilizado: formData.esterilizado,
        observaciones: formData.observaciones
      };

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Notificar al componente padre
      onMascotaAdded(nuevaMascota);

      // Navegar al perfil de la nueva mascota
      navigate(`/mascota/${nuevaMascota.id}`);
    } catch (error) {
      console.error('Error guardando mascota:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-pet-secondary">Agregar Nueva Mascota</h1>
          <p className="text-gray-600">
            Completa la información de tu nueva compañera
          </p>
        </div>
      </div>

      {/* Formulario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="mr-2 h-5 w-5 text-pet-primary" />
            Información de la Mascota
          </CardTitle>
          <CardDescription>
            Todos los campos marcados con * son obligatorios
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  placeholder="Ej: Max, Luna, Simba"
                  className={errors.nombre ? 'border-red-500' : ''}
                />
                {errors.nombre && (
                  <p className="text-sm text-red-500">{errors.nombre}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="especie">Especie *</Label>
                <Select value={formData.especie} onValueChange={(value) => handleInputChange('especie', value)}>
                  <SelectTrigger className={errors.especie ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecciona la especie" />
                  </SelectTrigger>
                  <SelectContent>
                    {especies.map((especie) => (
                      <SelectItem key={especie.value} value={especie.value}>
                        {especie.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.especie && (
                  <p className="text-sm text-red-500">{errors.especie}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="raza">Raza *</Label>
                {getRazas().length > 0 ? (
                  <Select value={formData.raza} onValueChange={(value) => handleInputChange('raza', value)}>
                    <SelectTrigger className={errors.raza ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecciona la raza" />
                    </SelectTrigger>
                    <SelectContent>
                      {getRazas().map((raza) => (
                        <SelectItem key={raza} value={raza}>
                          {raza}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="raza"
                    value={formData.raza}
                    onChange={(e) => handleInputChange('raza', e.target.value)}
                    placeholder="Escribe la raza"
                    className={errors.raza ? 'border-red-500' : ''}
                  />
                )}
                {errors.raza && (
                  <p className="text-sm text-red-500">{errors.raza}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="genero">Género *</Label>
                <Select value={formData.genero} onValueChange={(value) => handleInputChange('genero', value)}>
                  <SelectTrigger className={errors.genero ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecciona el género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Macho">Macho</SelectItem>
                    <SelectItem value="Hembra">Hembra</SelectItem>
                  </SelectContent>
                </Select>
                {errors.genero && (
                  <p className="text-sm text-red-500">{errors.genero}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edad">Edad (años) *</Label>
                <Input
                  id="edad"
                  type="number"
                  min="0"
                  max="30"
                  value={formData.edad}
                  onChange={(e) => handleInputChange('edad', e.target.value)}
                  placeholder="Ej: 3"
                  className={errors.edad ? 'border-red-500' : ''}
                />
                {errors.edad && (
                  <p className="text-sm text-red-500">{errors.edad}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="peso">Peso (kg) *</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  value={formData.peso}
                  onChange={(e) => handleInputChange('peso', e.target.value)}
                  placeholder="Ej: 4.5"
                  className={errors.peso ? 'border-red-500' : ''}
                />
                {errors.peso && (
                  <p className="text-sm text-red-500">{errors.peso}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color *</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  placeholder="Ej: Dorado, Gris, Negro"
                  className={errors.color ? 'border-red-500' : ''}
                />
                {errors.color && (
                  <p className="text-sm text-red-500">{errors.color}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento *</Label>
                <Input
                  id="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={(e) => handleInputChange('fecha_nacimiento', e.target.value)}
                  className={errors.fecha_nacimiento ? 'border-red-500' : ''}
                />
                {errors.fecha_nacimiento && (
                  <p className="text-sm text-red-500">{errors.fecha_nacimiento}</p>
                )}
              </div>
            </div>

            {/* Información adicional */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="microchip">Número de Microchip</Label>
                <Input
                  id="microchip"
                  value={formData.microchip}
                  onChange={(e) => handleInputChange('microchip', e.target.value)}
                  placeholder="Opcional - Se generará automáticamente si no se especifica"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="esterilizado"
                  checked={formData.esterilizado}
                  onChange={(e) => handleInputChange('esterilizado', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="esterilizado">Esterilizado/Castrado</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange('observaciones', e.target.value)}
                  placeholder="Información adicional sobre la mascota, comportamiento, preferencias, etc."
                  rows={3}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-pet-primary hover:bg-pet-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Agregar Mascota
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Información del plan */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Información del Plan</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <p className="text-sm">
            <strong>Plan Actual:</strong> Premium (ilimitado) <br />
            Puedes agregar tantas mascotas como desees con tu plan premium. 
            Si tienes el plan gratuito, el límite es de 3 mascotas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
