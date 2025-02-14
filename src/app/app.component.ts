import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GasStationService, GasStation } from './services/gas-station.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule],
})
export class AppComponent implements OnInit {
  title = 'Aplicación Gasolineras';
  userLat: number | null = null;
  userLng: number | null = null;
  gasStations: GasStation[] = [];
  selectedCompany: string = '';
  selectedFuelType: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  manualLat: number | null = null;
  manualLng: number | null = null;

  constructor(private gasStationService: GasStationService) {}

  ngOnInit(): void {
    this.obtenerUbicacion();
  }

  obtenerUbicacion(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLat = position.coords.latitude;
          this.userLng = position.coords.longitude;
          this.buscarGasolineras();
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.errorMessage =
                'Permiso de geolocalización denegado. Por favor, habilita la geolocalización en tu navegador o ingresa las coordenadas manualmente.';
              break;
            case error.POSITION_UNAVAILABLE:
              this.errorMessage =
                'La información de ubicación no está disponible. Por favor, ingresa las coordenadas manualmente.';
              break;
            case error.TIMEOUT:
              this.errorMessage =
                'La solicitud de geolocalización ha expirado. Por favor, intenta nuevamente o ingresa las coordenadas manualmente.';
              break;
            default:
              this.errorMessage =
                'Error desconocido al obtener la geolocalización. Por favor, ingresa las coordenadas manualmente.';
              break;
          }
        }
      );
    } else {
      this.errorMessage =
        'La geolocalización no está soportada en este navegador. Por favor, ingresa las coordenadas manualmente.';
    }
  }

  buscarGasolineras(): void {
    const lat = this.userLat !== null ? this.userLat : this.manualLat;
    const lng = this.userLng !== null ? this.userLng : this.manualLng;

    if (lat !== null && lng !== null) {
      this.loading = true;
      this.gasStationService
        .getGasStations(lat, lng, this.selectedCompany, this.selectedFuelType)
        .subscribe(
          (data: GasStation[]) => {
            this.gasStations = data;
            this.loading = false;
          },
          (error) => {
            this.errorMessage = 'Error al obtener los datos de las gasolineras.';
            this.loading = false;
          }
        );
    } else {
      this.errorMessage = 'Por favor, proporciona coordenadas válidas.';
    }
  }

  onFilterChange(): void {
    this.buscarGasolineras();
  }

  usarCoordenadasManuales(): void {
    if (this.manualLat !== null && this.manualLng !== null) {
      this.userLat = this.manualLat;
      this.userLng = this.manualLng;
      this.buscarGasolineras();
    } else {
      this.errorMessage = 'Por favor, ingresa coordenadas válidas.';
    }
  }
}
