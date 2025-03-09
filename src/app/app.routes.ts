import { Routes } from '@angular/router';

//PAGINAS PRINCIPALES
import {IndexComponent} from './paginas/index/index.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AnimalComponent } from './paginas/animal/animal.component';
import { AvesComponent } from './paginas/aves/aves.component';
import { PecesComponent } from './paginas/peces/peces.component';
import { AnfibiosComponent } from './paginas/anfibios/anfibios.component';
import { ReptilesComponent } from './paginas/reptiles/reptiles.component';
import { AnimalElegidoComponent } from './paginas/animal-elegido/animal-elegido.component';
import { InsectosComponent } from './paginas/insectos/insectos.component';

export const routes: Routes = [
    {
        //LAYOUT PRINCIPAL
        path: '', 
        component:AppLayoutComponent,
        children:[
           {path:'', component: IndexComponent},
           {path:'mamiferos', component: AnimalComponent},
           {path:'aves', component: AvesComponent},
           {path:'peces', component: PecesComponent},
           {path:'anfibios', component: AnfibiosComponent},
           {path:'reptiles', component: ReptilesComponent},
           {path:'insectos', component: InsectosComponent},
           {path:'animal', component: AnimalElegidoComponent}
        ]
        
        }
];
