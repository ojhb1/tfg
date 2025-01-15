import { Component } from '@angular/core';
import { LayoutService } from "./service/app.layout.service";
import { CommonModule } from '@angular/common';

@Component({
    standalone:true,
    imports:[
        CommonModule
    ],
    selector: 'app-footer',
    templateUrl: './app.footer.component.html'
})
export class AppFooterComponent {
    constructor(public layoutService: LayoutService) { }
}
