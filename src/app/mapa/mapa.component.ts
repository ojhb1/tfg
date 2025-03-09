import { Component, Input, AfterViewInit, OnDestroy, ChangeDetectorRef, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
})
export class MapaComponent implements AfterViewInit, OnDestroy {
  private map!: L.Map;
  private geoJsonLayer: L.GeoJSON | undefined;
  private initialized: boolean = false; // Controla si el mapa ya ha sido inicializado

  @Input() animalCountries: string[] = [];

  constructor(
    private http: HttpClient, 
    private cdRef: ChangeDetectorRef,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    // Asegurarse de que solo se ejecute en el cliente (navegador)
    if (isPlatformBrowser(this.platformId) && !this.initialized) {
      this.initialized = true; // Marcamos que el mapa ya ha sido inicializado
      this.initMap();
    }
  }

  private initMap(): void {
    // Solo inicializamos Leaflet si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      import('leaflet')?.then(L => {

        if (!this.map) {
          // Inicializar el mapa solo si no existe
          this.map = L.map(this.el.nativeElement.querySelector('#map')).setView([20, 0], 2);

          // Cargar los tiles de OpenStreetMap
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(this.map);

          // Cargar el archivo GeoJSON
          this.http.get<any>('/assets/countries.geojson').subscribe((geojsonData) => {
            if (this.geoJsonLayer) {
              this.map.removeLayer(this.geoJsonLayer);
            }

            // Agregar los datos del GeoJSON con el estilo según los países seleccionados
            this.geoJsonLayer = L.geoJSON(geojsonData, {
              style: (feature) => {
                const countryName = feature?.properties?.ADMIN;
                return {
                  color: this.animalCountries.includes(countryName) ? 'red' : 'black',
                  fillColor: this.animalCountries.includes(countryName) ? 'red' : 'transparent',
                  fillOpacity: 0.5
                };
              },
              onEachFeature: (feature, layer) => {
                layer.bindTooltip(feature.properties.ADMIN || "Desconocido");
              }
            }).addTo(this.map);
          });
        }
      }).catch((err) => {
        console.error('Error cargando Leaflet:', err);
      });
    }
  }

  ngOnDestroy(): void {
    // Limpiamos el mapa y las capas cuando el componente es destruido
    if (this.map) {
      this.map.remove();
      this.map = null!;
      this.initialized = false;
    }
  }
}
