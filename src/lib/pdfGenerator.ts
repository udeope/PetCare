import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Mascota, VisitaMedica, Vacuna } from '../types';

// Extiende la interfaz de jsPDF para incluir autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generatePetHistoryPdf = (
  mascota: Mascota,
  visitas: VisitaMedica[],
  vacunas: Vacuna[]
) => {
  const doc = new jsPDF();

  // Título del documento
  doc.setFontSize(22);
  doc.text(`Historial de ${mascota.nombre}`, 14, 20);
  doc.setFontSize(12);
  doc.text(`ID de Mascota: ${mascota.id}`, 14, 28);

  // Información de la mascota
  const petInfo = [
    { title: 'Especie', value: mascota.especie },
    { title: 'Raza', value: mascota.raza },
    { title: 'Edad', value: `${mascota.edad} años` },
    { title: 'Peso', value: `${mascota.peso} kg` },
    { title: 'Género', value: mascota.genero },
  ];
  
  let startY = 40;
  petInfo.forEach(info => {
    doc.text(`${info.title}: ${info.value}`, 14, startY);
    startY += 7;
  });

  // Tabla de Visitas Médicas
  doc.autoTable({
    startY: startY + 10,
    head: [['Fecha', 'Motivo', 'Diagnóstico', 'Tratamiento']],
    body: visitas.map(v => [
      new Date(v.fecha).toLocaleDateString(),
      v.motivo,
      v.diagnostico,
      v.tratamiento,
    ]),
    headStyles: { fillColor: [41, 128, 185] },
  });

  // Tabla de Vacunas
  doc.autoTable({
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [['Vacuna', 'Fecha de Aplicación', 'Próxima Dosis', 'Estado']],
    body: vacunas.map(v => [
      v.nombre,
      new Date(v.fecha_aplicacion).toLocaleDateString(),
      new Date(v.proxima_dosis).toLocaleDateString(),
      v.estado,
    ]),
    headStyles: { fillColor: [39, 174, 96] },
  });

  doc.save(`historial_${mascota.nombre.toLowerCase().replace(/ /g, '_')}.pdf`);
};