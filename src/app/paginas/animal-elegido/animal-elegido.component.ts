import { Component } from '@angular/core';
import { ThreeSceneComponent } from '../../three-scene/three-scene.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview'; 
import {FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { ActivatedRoute } from '@angular/router';
import { AnimalService } from '../../servicios/animal.service';
import { BabylonViewerComponent } from '../../babylon-viewer/babylon-viewer.component';
import { BabylonService } from '../../servicios/babylon.service';
import { EtiquetasService } from '../../servicios/etiquetas.service';
import {MapaComponent} from '../../mapa/mapa.component';
@Component({
  selector: 'app-animal-elegido',
  standalone: true,
  imports: [ThreeSceneComponent,CommonModule, BabylonViewerComponent, MapaComponent,
		FormsModule,
		ButtonModule,
		RippleModule,
		ButtonModule,
    FieldsetModule,
    PanelModule,
		InputTextModule,
    TabViewModule],
  templateUrl: './animal-elegido.component.html',
  styleUrl: './animal-elegido.component.css'
})
export class AnimalElegidoComponent {
  constructor(private router:ActivatedRoute,private animalSer:AnimalService,private babylonService: BabylonService, private etiquetasService:EtiquetasService){}
  animal:any;
  animalEtiquetas:any;
  animalCountries:any = [];
  informacionEx:any;
  cambiarCuadro:any = false;
  colorOptions: string[] = [
    '#FFB3B3', // Rosa claro
    '#FFCC99', // Amarillo claro
    '#B3FFB3', // Verde claro
    '#B3D9FF', // Azul claro
    '#E6B3FF'  // Lavanda claro
  ];

  ngOnInit() {
    this.animal = this.animalSer.getAnimal();
    this.cambiarModelo();
    console.log(this.animal);
    if(this.animal){
      this.obtenerEtiquetas();
      console.log(this.animalEtiquetas);
    }
     

  }
  cambiarModelo() {
    this.babylonService.actualizarModelo(this.animal);  // Actualiza el modelo en el servicio
  }
  obtenerEtiquetas(){
    this.etiquetasService.getTipoAnimal(this.animal.id).pipe().subscribe(
      (res: any) => {
        console.log(res);
        this.animalEtiquetas = res.animal[0].Etiqueta;
        this.informacionEx = res.informacion;
        this.animalCountries = res.animal[0].paisesAnimal;
        console.log(this.animalEtiquetas);

        this.animalEtiquetas = this.animalEtiquetas.map((etiqueta:any) => {
          return {
            ...etiqueta, // Mantener todos los datos de la etiqueta
            color: this.getColorAleatorio() // Asignar un color
          };
        });
      }
    )
  }
  flipCard(etiqueta: any) {
    etiqueta.flipped = !etiqueta.flipped;
  }
  getColorAleatorio(): string {
    const randomIndex = Math.floor(Math.random() * this.colorOptions.length);
    return this.colorOptions[randomIndex];
  }
  cerrarCuadro(){
    this.cambiarCuadro = !this.cambiarCuadro;
  }
}
