import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PokeapiService } from '../../services/pokeapi.service';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { CapitalizarPipe } from '../../pipes/capitalizar.pipe';
import {MatIconModule} from '@angular/material/icon';
import { isPlatformBrowser, CommonModule } from '@angular/common';

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
  verPokemon : any = '';
  verUrlEvolucion : any = '';
  evoluciones: string[] = [];

  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private pokeApi : PokeapiService, 
    private renderer: Renderer2, 
    private el: ElementRef,  
    @Inject(PLATFORM_ID) 
    private platformId: Object){ }  

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      this.renderer.setStyle(document.body, 'background-image', 'url("/wp4717691-gameboy-pokemon-wallpapers.jpg")');
      this.renderer.setStyle(document.body, 'background-size', 'cover');
    }

    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.offset = params['offset'];
    });

    this.pokeApi.obertenerUnPokemon('https://pokeapi.co/api/v2/pokemon/'+this.id).subscribe({
      next:(data : any) => {
        this.verPokemon = data;
          this.pokeApi.obertenerUnPokemon('https://pokeapi.co/api/v2/pokemon-species/'+this.id).subscribe({
            next : (data : any) => {
                this.pokeApi.obtenerEvolucion(data.evolution_chain.url).subscribe({
                  next: (data : any) => {
                    console.log(this.pokeApi.obtenerEvoluciones(data));
                  }
                })
            }
          })   
      },
      error: (err: any) => {
        if(err.status === 404){ this.router.navigate(['/']); }else{ console.log(err); }
      }
    })
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
}