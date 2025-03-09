import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EtiquetasService {
  private apiUrl = 'http://localhost:3000/api/animalEtiquetas';
  constructor(private http: HttpClient) {}

  getTipoAnimal(tipoAnimal:any){
    return this.http.get(this.apiUrl+'/'+tipoAnimal);
  }
}
