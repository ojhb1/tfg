import { Component, ViewChild } from '@angular/core';
import { DataView, DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { ThreeSceneComponent } from '../../three-scene/three-scene.component';
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

@Component({
  selector: 'app-insectos',
  standalone: true,
  imports: [DataViewModule,InputTextModule,ThreeSceneComponent,NgIf,DropdownModule,RatingModule,ButtonModule,FormsModule,NgFor],
  templateUrl: './insectos.component.html',
  styleUrl: './insectos.component.css'
})
export class InsectosComponent {
  busqueda:any = '';
  filtros:any = [];
  animales:any = [];
  animalesfiltrados:any = [];
  previewImage: any;
  loading: boolean = true;
  busquedaRealizada:any = false;
  constructor(private animalSer: AnimalService, private animalService:AnimalesService, private route:Router){
    this.filtros= [
      {label:'Peso >'},
      {label:'Peso <'},
      {label:'Altura >'},
      {label:'Altura <'},
    ]
  }
  
  ngOnInit(): void {

    this.animalService.getTipoAnimal('Insectos').pipe(
      tap((res:any)=>{
        if(res['ok']){
          console.log(res);
          res['animales'].forEach((animal:any,index:any) =>{
            this.animales[index] = animal;

          }) 
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
    // Filtramos los animales que contengan el nombre que coincide con el texto del filtro
    this.animalesfiltrados= this.animales.filter((animal:any) => 
      animal.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
    );
    
    // Actualizamos la lista de animales con el filtro
    dv.value = this.animalesfiltrados;
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
  navegarAnimalSeleccionado(animal:any){
    this.animalSer.setAnimal(animal);
    this.route.navigate(['/animal']);
  }
}
