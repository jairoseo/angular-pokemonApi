import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {

  constructor(private http: HttpClient) { }
  
  obtenerListadoPokemones(url: string){
    return this.http.get(url);
  }

  obertenerUnPokemon(url: string){
    return this.http.get(url);
  }

  obtenerEvolucionUrl(url: string){
    return this.http.get(url);
  }

  obtenerEvolucion(url: string){
    return this.http.get(url);
  }

  obtenerEvoluciones(datos: any): string[] {
    const evoluciones: string[] = [];
    function recorrerEvoluciones(nodo: any) {
      if (nodo.species && nodo.species.name) {
        evoluciones.push(nodo.species.name);
      }
      if (nodo.evolves_to && nodo.evolves_to.length > 0) {
        nodo.evolves_to.forEach((evolucion: any) => {
          recorrerEvoluciones(evolucion);
        });
      }
    }
    recorrerEvoluciones(datos.chain);
    return evoluciones;
  }
  
}
