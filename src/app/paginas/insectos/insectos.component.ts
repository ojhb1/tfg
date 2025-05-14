import { Component, ViewChild } from '@angular/core';
import { DataView, DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { SelectItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { NgIf, NgFor } from '@angular/common';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AnimalesService } from '../../servicios/animales.service';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AnimalService } from '../../servicios/animal.service';
import { Modelo3DComponent} from '../../modelo3-dcomponent/modelo3-dcomponent.component';
import { EtiquetasService } from '../../servicios/etiquetas.service';
import { TooltipModule } from 'primeng/tooltip';

import { NgClass } from '@angular/common';
@Component({
  selector: 'app-insecto',
  standalone: true,
  imports: [DataViewModule,InputTextModule,NgIf,DropdownModule,RatingModule,ButtonModule,FormsModule,NgFor,Modelo3DComponent,TooltipModule,NgClass],
  templateUrl: './insectos.component.html',
  styleUrl: './insectos.component.css'
})
export class InsectosComponent {

  clickThreshold = 4;
  busqueda:any = '';
  filtros:any = [];
  animales:any = [];
  informacionEx:any;
  animalesfiltrados:any = [];
  animalEtiquetas:any;
  previewImage: any;
  loading: boolean = true;
  busquedaRealizada:any = false;
  mostrarEtiquetas: boolean = false;
  constructor(private animalSer: AnimalService, private animalService:AnimalesService, private route:Router, private etiquetasService:EtiquetasService){
    console.log('Estoy aqui');
    this.filtros= [
      {label:'Peso >'},
      {label:'Peso <'},
      {label:'Altura >'},
      {label:'Altura <'},
    ]
  }

  public mouseDownX = 0;
  public mouseUpX = 0;
  public isDragging = false;
  onMouseDown(event: MouseEvent) {
    this.mouseDownX = event.clientX;
    this.isDragging = false;
  }
  
  onMouseMove(event: MouseEvent) {
    const diff = Math.abs(this.mouseDownX - event.clientX);
    if (diff > 5) {
      this.isDragging = true;
    }
  }


  alternarEtiquetas() {
    this.mostrarEtiquetas = !this.mostrarEtiquetas;
  }
  onMouseUp(event: MouseEvent) {
    this.mouseUpX = event.clientX;
  }
  ngOnInit(): void {

    this.animalService.getTipoAnimal('Insectos').pipe(
      tap((res:any)=>{
        
        if(res['ok']){
          console.log(res);

          res['animales'].forEach((animal: any, index: any) => {
            this.animales[index] = animal;
            let aux = this.animales[index].animaciones;
            
            // Verificar si aux es una cadena JSON antes de hacer el parseo
            if (typeof aux === 'string') {
              try {
                this.animales[index].animaciones = JSON.parse(aux);
              } catch (e) {
                console.error('Error al parsear animaciones para el animal', animal.nombre, e);
                this.animales[index].animaciones = [];
              }
            } else {
              // Si ya es un objeto, no es necesario hacer JSON.parse
              this.animales[index].animaciones = aux;
            }
            this.etiquetasService.getTipoAnimal(animal.id).subscribe((res: any) => {
              const etiquetas = res.animal[0].Etiqueta.map((etiqueta: any) => ({
                ...etiqueta,
                color: '#111827',
                flipped: false
              }));
            
              this.animales[index].etiquetas = etiquetas;
            });
          
            console.log(this.animales[index]);
          });
          this.loading = false;
          this.animalesfiltrados = this.animales;
          this.busquedaRealizada = false;
        }
      }),
      catchError(err =>{
        throw err;
      })
    ).subscribe();
  }
  ngOnDestroy(): void {
    console.warn('AnimalComponent: ngOnDestroy called');
  }
  onFilter(dv: any, event: any): void {
    this.busquedaRealizada = true;
    this.animalesfiltrados = this.animales.filter((animal: any) =>
      animal.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
    );
    dv.value = this.animalesfiltrados;
    // No es necesario manipular `dv.value`, Angular se encarga de eso con el binding
  }
  Filtrar(dv:any,event:any){
    var aux= event.value;
  
    switch(aux.label){
      case 'Peso >':
        this.animalesfiltrados.sort((a:any,b:any)=> b.pesoMedio - a.pesoMedio);
        break;
      case 'Peso <':
        this.animalesfiltrados.sort((a:any,b:any)=> a.pesoMedio - b.pesoMedio);
        break;
      case 'Altura >':
        this.animalesfiltrados.sort((a:any,b:any)=> b.alturaMedia - a.alturaMedia);
        break;
      case 'Altura <':
        this.animalesfiltrados.sort((a:any,b:any)=> a.alturaMedia - b.alturaMedia);
        break;
  
    }
    dv.value = this.animalesfiltrados;

  }
  actualizarArrastre(estado: boolean) {
    this.isDragging = estado; // unificar
  }
  navegarAnimalSeleccionado(animal: any) {
    if (!this.isDragging) {
      this.animalSer.setAnimal(animal);
      this.route.navigate(['/animal']);
    }
  }
  obtenerEtiquetas(animal:any){
    this.etiquetasService.getTipoAnimal(animal.id).pipe().subscribe(
      (res: any) => {
        console.log(res);
        this.animalEtiquetas = res.animal[0].Etiqueta;
        this.informacionEx = res.informacion;

       
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
}
