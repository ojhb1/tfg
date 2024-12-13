import { Routes } from '@angular/router';

//PAGINAS PRINCIPALES
import {IndexComponent} from './paginas/index/index.component';

export const routes: Routes = [
    {
        //LAYOUT PRINCIPAL
        path: '', 
        component: IndexComponent
        }
];
