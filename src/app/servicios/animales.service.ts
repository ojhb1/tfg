import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AnimalesService {
  private apiUrl = 'http://localhost:3000/api/tiposAnimales';
  private apiUrl2 = 'http://localhost:3000/api/animales';
  constructor(private http: HttpClient) {}

  getTipoAnimal(tipoAnimal:any){
    return this.http.get(this.apiUrl+'/'+tipoAnimal);
  }

  getHabitats(animal:any){
    return this.http.get(this.apiUrl2+'/'+animal);
  }
}
