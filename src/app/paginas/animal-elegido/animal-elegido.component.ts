import { Component, ViewChild } from '@angular/core';
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
import { BabylonIconosComponent } from '../../babylon-iconos/babylon-iconos.component';
import { NgForOf } from '@angular/common';
import { MenuItem } from 'primeng/api/menuitem';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Menu, MenuModule } from 'primeng/menu';
import { OverlayPanel } from 'primeng/overlaypanel';
import { OverlayPanelModule } from 'primeng/overlaypanel';
@Component({
  selector: 'app-animal-elegido',
  standalone: true,
  imports: [CommonModule, BabylonViewerComponent, MapaComponent,CarouselModule,DialogModule,BabylonHabitatComponent,BabylonIconosComponent,
		FormsModule,
    MenuModule,
    OverlayPanelModule,
		ButtonModule,
		RippleModule,
    CommonModule,
    SplitButtonModule,
    FieldsetModule,
    NgForOf,
    PanelModule,
		InputTextModule,
    TabViewModule],
  templateUrl: './animal-elegido.component.html',
  styleUrl: './animal-elegido.component.css'
})
export class AnimalElegidoComponent {
  constructor(private animalesServicio:AnimalesService,private router:ActivatedRoute,private animalSer:AnimalService,private babylonService: BabylonService, private etiquetasService:EtiquetasService){}
  @ViewChild(BabylonHabitatComponent) modalComponent!: BabylonHabitatComponent;
  @ViewChild('menu') menu!: Menu;
  @ViewChild('op') op!: OverlayPanel;
  animal:any;
  iconoSeleccionado: any = null;
  animalEtiquetas:any;
  animalCountries:any = [];
  informacionEx:any;
  sonidoAnimal:any;
  habitatsAnimal:any;
  muteado:any = false;
  activeTabIndex: number = 0;
  habitats:any = [];
  cambiarCuadro:any = false;
  audios: HTMLAudioElement[] = [];
  intervaloActualizarProgreso: any;
  campos: MenuItem[] = [
    {
      label: this.muteado ? 'Activar sonido' : 'Silenciar',
      icon: this.muteado ? 'pi pi-volume-off' : 'pi pi-volume-up',
    },
    { separator: true },
    { label: 'Update', icon: 'pi pi-refresh' },
    { label: 'Delete', icon: 'pi pi-times' }
  ];
  animalIconos:any = [];
  activeSlideIndex = 0;
  colorOptions: string[] = [
    '#FFB3B3', // Rosa claro
    '#FFCC99', // Amarillo claro
    '#B3FFB3', // Verde claro
    '#B3D9FF', // Azul claro
    '#E6B3FF'  // Lavanda claro
  ];
  onSlideChange(event: any) {
    this.activeSlideIndex = event.page;
  }
  seleccionarIcono(icono: any) {
    this.seleccionarIcono = icono;
    console.log('Seleccionado:', icono);
  }
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


  onTabChange(event: any) {
    this.activeTabIndex = event.index;

  }
 
  ngOnInit() {
    this.animal = this.animalSer.getAnimal();
    if (this.animal && this.animal.alimentacion) {
      try {
        const alimentacion = JSON.parse(this.animal.alimentacion);
        this.animalIconos = Object.entries(alimentacion).map(([tipo, descripcion]) => ({
          tipo,
          descripcion
        }));
      } catch (error) {
        console.error('Error al parsear alimentación:', error);
        this.animalIconos = [];
      }
    }

    if(this.animal){
      this.sonidoAnimal = JSON.parse(this.animal?.sonidosAnimal);
      console.log('Estos son los sonidos',this.sonidoAnimal);
      this.cambiarModelo();
      this.obtenerEtiquetas();
      this.obtenerHabitats();
    }

  }
  cambiarModelo() {
    this.babylonService.actualizarModelo(this.animal);  // Actualiza el modelo en el servicio
  }
  /*
  obtenerSonido() {
    this.animalesServicio.obtemerSonido(this.animal.id).pipe().subscribe(
      (res: Blob) => {
        const audioURL = URL.createObjectURL(res);
        this.sonidoAnimal = new Audio(audioURL);
        this.sonidoAnimal.load();
        console.log(this.sonidoAnimal);
        if (!this.muteado) {
          this.reproducirConRetrasoEnBucle();
        }
      },
      error => {
        console.error('Error al obtener sonido:', error);
      }
    );
  }*/
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
    this.etiquetasService.getTipoAnimal(this?.animal.id).pipe().subscribe(
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
            color: '#111827' // Asignar un color
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
  /*
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
   
    this.sonidoAnimal?.play().catch((error:any) => {
      console.error('No se pudo reproducir el sonido:', error);
    });
  

      setInterval(() => {
        this.sonidoAnimal?.pause(); 
        this.sonidoAnimal.currentTime = 0; 
        this.sonidoAnimal?.play().catch((error:any) => {
          console.error('No se pudo reproducir el sonido:', error);
        });
      }, 8000); 
    
   
  }
  */
  cerrarCuadro(){
    this.cambiarCuadro = !this.cambiarCuadro;
  }
}
