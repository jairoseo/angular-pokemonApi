import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PokeapiService } from '../../services/pokeapi.service';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { CapitalizarPipe } from '../../pipes/capitalizar.pipe';
import {MatIconModule} from '@angular/material/icon';
import { isPlatformBrowser, CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-ver',
  standalone: true,
  imports: [HttpClientModule,MatCardModule,MatButtonModule,CapitalizarPipe,MatIconModule,RouterLink,CommonModule],
  providers: [PokeapiService],
  templateUrl: './ver.component.html',
  styleUrl: './ver.component.scss',
})
export class VerComponent implements OnInit {

  id : string = '';
  offset : string = '';
  evolucion : string = '';
  verPokemon : any = '';
  verUrlEvolucion : any = '';
  evoluciones: any[] = [];

  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private pokeApi : PokeapiService, 
    private renderer: Renderer2, 
    private el: ElementRef,  
    @Inject(PLATFORM_ID) 
    private platformId: Object,
    private location: Location){ }  

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.setStyle(document.body, 'background-image', 'url("/wp4717691-gameboy-pokemon-wallpapers.jpg")');
      this.renderer.setStyle(document.body, 'background-size', 'cover');
    }
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.offset = params['offset'];
      this.evolucion = params['evolucion'];
    });
    this.cargarPokemon(this.id);
  }

  async cargarPokemon(id: string) {
    try {
      const pokemon: any = await this.pokeApi.obertenerUnPokemon(`https://pokeapi.co/api/v2/pokemon/${id}`).toPromise();
      this.verPokemon = pokemon;
  
      const speciesData: any = await this.pokeApi.obtenerEvolucionUrl(`https://pokeapi.co/api/v2/pokemon-species/${id}`).toPromise();
      const evolutionChainData: any = await this.pokeApi.obtenerEvolucion(speciesData.evolution_chain.url).toPromise();
      
      const evoluciones: any = this.pokeApi.obtenerEvoluciones(evolutionChainData);
      
      for (const element of evoluciones) {
        if (element !== this.verPokemon.name) {
          const evolucionPokemon: any = await this.pokeApi.obertenerUnPokemon(`https://pokeapi.co/api/v2/pokemon/${element}`).toPromise();
          this.evoluciones.push({
            nombre: evolucionPokemon.name,
            imagen: evolucionPokemon.sprites.front_default,
            id: evolucionPokemon.id,
            offset: this.offset
          });
        }
      }
    } catch (err: any) {
      if (err.status === 404) {
        this.router.navigate(['/']);
      } else {
        console.error(err);
      }
    }
  }
  

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.removeStyle(document.body, 'background-image');
    }
  }

  playSound(soundSource: string){
    const audio = new Audio();
    audio.src = soundSource;
    audio.load();
    audio.play();
  }
    
  goBack(): void {
    this.location.back();
  }
}