import { Component, Input, AfterViewInit, AfterViewChecked, OnDestroy, ChangeDetectorRef, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
})
export class MapaComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
  private map!: L.Map;
  private geoJsonLayer: L.GeoJSON | undefined;
  private initialized: boolean = false;

  @Input() animalCountries: string[] = [];
  
  constructor(
    private http: HttpClient, 
    private cdRef: ChangeDetectorRef,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    // Se ejecuta inicialmente
    if (isPlatformBrowser(this.platformId) && !this.initialized) {
      this.initialized = true;
      this.initMap();
    }
  }

  ngAfterViewChecked(): void {
    // Recalcular el tamaño del mapa después de que se haya actualizado el DOM
    if (this.map) {
      this.map.invalidateSize(); // Fuerza el redimensionamiento del mapa
    }
  }
  public forceResize() {
    if (this.map) {
      this.map.invalidateSize();
    }
  }
  private initMap(): void {
    if (isPlatformBrowser(this.platformId)) {
      import('leaflet')?.then(L => {
        if (!this.map) {
          this.map = L.map(this.el.nativeElement.querySelector('#map'),{
            center: [20, 0],
            zoom: 2,
            zoomControl: true,
            scrollWheelZoom: true,
            attributionControl: true,
          }).setView([20, 0], 2);

          // Cargar los tiles de OpenStreetMap
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(this.map);

          this.http.get<any>('/assets/countries.geojson').subscribe((geojsonData) => {
            if (this.geoJsonLayer) {
              this.map.removeLayer(this.geoJsonLayer);
            }

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
    if (this.map) {
      this.map.remove();
      this.map = null!;
      this.initialized = false;
    }
  }
}
