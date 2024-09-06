import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PokeapiService } from '../../services/pokeapi.service';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { CapitalizarPipe } from '../../pipes/capitalizar.pipe';
import {MatIconModule} from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [HttpClientModule,MatCardModule,MatButtonModule,CapitalizarPipe,MatIconModule,RouterLink],
  providers: [PokeapiService],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.scss'
})
export class ListaComponent implements OnInit{
  
  listaPokemones : any;
  pokemonesCompletos : any[] = [];
  listadoSiguiente : any = '';
  listadoAnterior : any = '';
  urlApiDefault : string = 'https://pokeapi.co/api/v2/pokemon/';
  offset : any = '0';

  constructor(private pokeApi: PokeapiService, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {      
      this.offset = params.get("offset");
      this.offset = this.offset === null ? 0 : this.offset;
    });    
    this.cargarPokemones(this.offset);
  }

  extractQueryParamValue(url: string, paramName: string): number | null {
    if(url){
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      const paramValue = params.get(paramName);
      return paramValue ? parseInt(paramValue, 10) : null;
    }else{
      return 0;
    }
  }  

  cargarPokemones(offset: number = 0){
    this.pokemonesCompletos = [];
    this.pokeApi.obtenerListadoPokemones(this.urlApiDefault+'?offset='+offset+'&limit=20').subscribe({
      next: (data : any) => {
        this.listaPokemones = data;
        this.listadoSiguiente = this.extractQueryParamValue(data.next,'offset');
        this.listadoAnterior = this.extractQueryParamValue(data.previous,'offset');
        this.listaPokemones.results.forEach( (elemnt : any) => {
          this.pokeApi.obertenerUnPokemon(elemnt.url).subscribe({
            next:(data : any) => {
              this.pokemonesCompletos.push(data);
            }
          })
        })        
      },
      error: (err: any) => {console.log(err)}
    })
  } 

  playSound(soundSource: string){
    const audio = new Audio();
    audio.src = soundSource;
    audio.load();
    audio.play();
  }
}