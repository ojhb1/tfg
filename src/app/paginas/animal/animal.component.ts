import { Component } from '@angular/core';
import { DataView, DataViewModule } from 'primeng/dataview';
import { ThreeSceneComponent } from '../../three-scene/three-scene.component';
import { SelectItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-animal',
  standalone: true,
  imports: [DataViewModule,InputTextModule,ThreeSceneComponent,NgIf],
  templateUrl: './animal.component.html',
  styleUrl: './animal.component.css'
})
export class AnimalComponent {
  animales:any;
  constructor(){
  
  }
  ngOnInit(): void {
    console.warn('AnimalComponent: ngOnInit called');
  }
  ngOnDestroy(): void {
    console.warn('AnimalComponent: ngOnDestroy called');
  }
  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  } 
}
