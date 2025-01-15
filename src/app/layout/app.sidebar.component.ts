import { Component, ElementRef } from '@angular/core';
import { LayoutService } from "./service/app.layout.service";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppMenuComponent } from './app.menu.component';

@Component({
    standalone:true,
    imports:[
        CommonModule,
        RouterModule,
        AppMenuComponent
    ],
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html'
})
export class AppSidebarComponent {
    constructor(public layoutService: LayoutService, public el: ElementRef) { }
}

