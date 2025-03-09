import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BabylonService {

  private modeloSubject = new BehaviorSubject<string>('gato.glb');  // El modelo inicial
  modelo$ = this.modeloSubject.asObservable();  // Observable que se usa para escuchar cambios

  constructor(){}
  // Método para actualizar el modelo
  actualizarModelo(nuevoModelo: string) {
    this.modeloSubject.next(nuevoModelo);  // Notificamos a todos los suscriptores
  }
  
}
