import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule para usar *ngIf, *ngFor, etc.
import { FormsModule } from '@angular/forms';     // Importa FormsModule si usas ngModel u otras directivas de formularios
import { GasStationService, GasStation } from './services/gas-station.service';
import { HttpClientModule } from '@angular/common/http';
@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, FormsModule,HttpClientModule]  // Agrega los módulos necesarios para las directivas de Angular
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
          this.errorMessage = 'No se pudo obtener la geolocalización de manera automatica. Introduce las coordenadas manualmente.';
        }
      );
    } else {
      this.errorMessage = 'La geolocalización no está soportada en este navegador.';
    }
  }

  buscarGasolineras(): void {
    if (this.userLat !== null && this.userLng !== null) {
      this.loading = true;
      this.gasStationService.getGasStations(this.userLat, this.userLng, this.selectedCompany, this.selectedFuelType)
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
    }
  }

  onFilterChange(): void {
    this.buscarGasolineras();
  }
}
