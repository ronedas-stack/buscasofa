/**
 * Permite obtener precios actualizados de la sede dl ministerio
 * @returns precios actualizados cada media hora
 */
export async function fetchFuelPrices() {
  console.log('Obteniendo nuenvos precios...');
  const response = await fetch(
    'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/'
  );
  if (!response.ok) throw new Error('Error al descargar los precios');

  return response.json();
}

export const COMUNIDADES_AUTONOMAS = [
  // Lista de comunidades autónomas de España
  { name: 'Andalucía', id: "01" },
  { name: 'Aragón', id: "02" },
  { name: 'Asturias', id: "03" },
  { name: 'Baleares', id: "04" },
  { name: 'Canarias', id: "05" },
  { name: 'Cantabria', id: "06" },
  { name: 'Castilla-La Mancha', id: "07" },
  { name: 'Castilla y León', id: "08" },
  { name: 'Cataluña', id: "09" },
  { name: 'Comunidad Valenciana', id: "10" },
  { name: 'Extremadura', id: "11" },
  { name: 'Galicia', id: "12" },
  { name: 'Madrid', id: "13" },
  { name: 'Murcia', id: "14" },
  { name: 'Navarra', id: "15" },
  { name: 'País Vasco', id: "16" },
  { name: 'La Rioja', id: "17" },
  { name: 'Ceuta', id: "18" },
  { name: 'Melilla', id: "19" }
];
