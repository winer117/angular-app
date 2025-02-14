// Importa el decorador Injectable para que este servicio pueda ser inyectado en otros componentes.
import { Injectable } from '@angular/core';
// Importa HttpClient para realizar peticiones HTTP y HttpParams para construir parámetros de consulta.
import { HttpClient, HttpParams } from '@angular/common/http';
// Importa Observable para trabajar de forma reactiva con respuestas asíncronas.
import { Observable } from 'rxjs';

// Define una interfaz para tipar los datos de una gasolinera.
export interface GasStation {
  id: number;         // Identificador único de la gasolinera.
  name: string;       // Nombre de la gasolinera.
  address: string;    // Dirección de la gasolinera.
  lat: number;        // Latitud (coordenada geográfica).
  lng: number;        // Longitud (coordenada geográfica).
  company: string;    // Nombre de la empresa suministradora.
  // Propiedad opcional para los precios de los carburantes, utilizando el tipo de carburante como clave.
  fuelPrices?: { [fuelType: string]: number };
  // Propiedad opcional para indicar el estado de apertura de la gasolinera.
  openStatus?: string;
}

// El decorador @Injectable declara que este servicio estará disponible de forma global (root).
@Injectable({
  providedIn: 'root'
})
export class GasStationService {
  // URL base de la API REST que proporciona los datos (reemplazar por la URL real según la documentación).
  private apiUrl = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/';

  // El constructor inyecta HttpClient para poder realizar las peticiones HTTP.
  constructor(private http: HttpClient) {}

  /**
   * Método para obtener las gasolineras basándose en la ubicación del usuario y filtros opcionales.
   * @param lat Latitud del usuario.
   * @param lng Longitud del usuario.
   * @param company (Opcional) Filtro para la empresa suministradora.
   * @param fuelType (Opcional) Filtro para el tipo de carburante.
   * @returns Observable que emite un array de objetos GasStation.
   */
  getGasStations(lat: number, lng: number, company?: string, fuelType?: string): Observable<GasStation[]> {
    // Se crea una instancia de HttpParams con los parámetros obligatorios (latitud y longitud).
    let params = new HttpParams()
      .set('lat', lat.toString()) // Se convierte la latitud a cadena y se añade.
      .set('lng', lng.toString()); // Se convierte la longitud a cadena y se añade.

    // Si se ha proporcionado un filtro por empresa, se añade a los parámetros.
    if (company) {
      params = params.set('company', company);
    }
    // Si se ha proporcionado un filtro por tipo de carburante, se añade a los parámetros.
    if (fuelType) {
      params = params.set('fuelType', fuelType);
    }

    // Realiza una petición GET a la URL de la API pasando los parámetros y retorna el Observable.
    return this.http.get<GasStation[]>(this.apiUrl, { params });
  }
}
