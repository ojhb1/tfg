import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {

  private animalSeleccionado: any;

  constructor() {}

  setAnimal(animal: any) {
    this.animalSeleccionado = animal;
    localStorage?.setItem('animal', JSON.stringify(animal)); 
  }

  getAnimal() {
    if (!this.animalSeleccionado) {
      if (typeof window !== 'undefined')
        this.animalSeleccionado = JSON.parse(localStorage?.getItem('animal') || 'null'); 
    }
    return this.animalSeleccionado;
  }
}
