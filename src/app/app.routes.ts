import { Routes } from '@angular/router';
import { ListaComponent } from './components/lista/lista.component';
import { VerComponent } from './components/ver/ver.component';

export const routes: Routes = [
    {
        path : '',
        component : ListaComponent
    },    
    {
        path: 'pokemon/:id/:offset',
        component : VerComponent
    },
    {
        path: 'pokemon/:id/:offset/:evolucion',
        component : VerComponent
    }
];
