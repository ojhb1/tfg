
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AppConfigComponent } from './app.config.component';
// No necesitas declarar AppConfigComponent en este módulo
// Si lo necesitas en algún otro módulo, lo importas directamente en ese módulo.

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SidebarModule,
    RadioButtonModule,
    ButtonModule,
    InputSwitchModule,
    AppConfigComponent  // Importa directamente el componente standalone aquí
  ],
  exports: [
    AppConfigComponent  // Exportarlo si es necesario para otros módulos
  ]
})
export class AppConfigModule { }
