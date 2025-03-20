import { Component, ViewChild } from '@angular/core';
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
import { CarouselModule } from 'primeng/carousel';
import { AnimalesService } from '../../servicios/animales.service';
import {DialogModule} from 'primeng/dialog';
import {BabylonHabitatComponent} from '../babylon-habitat/babylon-habitat.component';
@Component({
  selector: 'app-animal-elegido',
  standalone: true,
  imports: [ThreeSceneComponent,CommonModule, BabylonViewerComponent, MapaComponent,CarouselModule,DialogModule,BabylonHabitatComponent,
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
  constructor(private animalesServicio:AnimalesService,private router:ActivatedRoute,private animalSer:AnimalService,private babylonService: BabylonService, private etiquetasService:EtiquetasService){}
  @ViewChild(BabylonHabitatComponent) modalComponent!: BabylonHabitatComponent;

  animal:any;
  animalEtiquetas:any;
  animalCountries:any = [];
  informacionEx:any;
  sonidoAnimal:any;
  habitatsAnimal:any;
  muteado:any = false;
  habitats:any = [];
  cambiarCuadro:any = false;
  colorOptions: string[] = [
    '#FFB3B3', // Rosa claro
    '#FFCC99', // Amarillo claro
    '#B3FFB3', // Verde claro
    '#B3D9FF', // Azul claro
    '#E6B3FF'  // Lavanda claro
  ];
  carouselResponsiveOptions: any[] = [
    {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
    },
    {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
    },
    {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
    }
  ];
  ngOnInit() {
    this.animal = this.animalSer.getAnimal();
    this.cambiarModelo();
    console.log(this.animal);
    if(this.animal){
      this.sonidoAnimal = new Audio();
      console.log('Este es el naima',this.animal);
      let aux = JSON.parse(this.animal.sonidosAnimal);
      this.sonidoAnimal.src = 'assets/animales/'+this.animal.nombre.toLowerCase() + '/' + aux[0];
      this.sonidoAnimal.load();
      if(!this.muteado)
        this.reproducirConRetrasoEnBucle();
      this.obtenerEtiquetas();
      this.obtenerHabitats();
      console.log(this.animalEtiquetas);
      console.log(this.habitatsAnimal);
    }
     

  }
  cambiarModelo() {
    this.babylonService.actualizarModelo(this.animal);  // Actualiza el modelo en el servicio
  }
  obtenerHabitats(){
    this.animalesServicio.getHabitats(this.animal.id).pipe().subscribe(
      (res:any)=>{
        if(res.ok){
          console.log(res);
          this.habitatsAnimal = res.habitats;
        }
      }
    )
  }
 
  verHabitat(modelo3D:any){
    this.modalComponent?.abrirModal(modelo3D);
  }
  obtenerEtiquetas(){
    this.etiquetasService.getTipoAnimal(this.animal.id).pipe().subscribe(
      (res: any) => {
        console.log(res);
        this.animalEtiquetas = res.animal[0].Etiqueta;
        this.informacionEx = res.informacion;
        this.animalCountries = res.animal[0].paisesAnimal;
       
        console.log();
      
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
  reproducirSonido(){
    if(!this.muteado){
      this.sonidoAnimal.muted = true;
      this.muteado = true;
    }
    else {
      this.sonidoAnimal.muted = false;
      this.muteado = false;
    }
      
  }
  reproducirConRetrasoEnBucle() {
   
      this.sonidoAnimal.play();
  

      setInterval(() => {
        this.sonidoAnimal.pause(); 
        this.sonidoAnimal.currentTime = 0; 
        this.sonidoAnimal.play(); 
      }, 8000); 
    
   
  }
  cerrarCuadro(){
    this.cambiarCuadro = !this.cambiarCuadro;
  }
}
