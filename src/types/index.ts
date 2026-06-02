export interface GasStationData {
  'Rótulo': string;
  'Dirección': string;
  'Provincia': string;
  'Municipio': string;
  'Precio Biodiesel': string,
  'Precio Bioetanol': string,
  'Precio Gas Natural Comprimido': string,
  'Precio Gas Natural Licuado': string,
  'Precio Gases licuados del petróleo': string,
  'Precio Gasoleo A': '1,339',
  'Precio Gasoleo B': '0,979',
  'Precio Gasoleo Premium': string,
  'Precio Gasolina 95 E10': string,
  'Precio Gasolina 95 E5': '1,399',
  'Precio Gasolina 95 E5 Premium': string,
  'Precio Gasolina 98 E10': string,
  'Precio Gasolina 98 E5': string,
  'Precio Hidrogeno': string,

  'IDEESS': string;
  'Latitud': string;
  'Longitud': string;
  // Agrega más campos según lo que necesites mostrar
}

export interface GasStationResponse {
  'Gasolineras': GasStationData[];
}