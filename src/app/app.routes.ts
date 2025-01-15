import { Routes } from '@angular/router';

//PAGINAS PRINCIPALES
import {IndexComponent} from './paginas/index/index.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AnimalComponent } from './paginas/animal/animal.component';

export const routes: Routes = [
    {
        //LAYOUT PRINCIPAL
        path: '', 
        component:AppLayoutComponent,
        children:[
           {path:'', component: IndexComponent},
           {path:'mamiferos', component: AnimalComponent}
        ]
        
        }
];
