import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as BABYLON from 'babylonjs';
import '@babylonjs/loaders';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-babylon-habitat',
  standalone: true,
  imports: [
    DialogModule,
    FormsModule,
    TooltipModule,
    InputTextModule,
    ButtonModule,
    SidebarModule,
    RippleModule
  ],
  templateUrl: './babylon-habitat.component.html',
  styleUrls: ['./babylon-habitat.component.css']
})
export class BabylonHabitatComponent {
  @ViewChild('renderCanvas', { static: true }) renderCanvas!: ElementRef<HTMLCanvasElement>;
  display: boolean = false; // Control para mostrar el modal

  // Función para abrir el modal desde otro componente
  abrirModal(modelo3D: any) {
    this.display = true;
    this.initBabylon(modelo3D); // Inicia Babylon.js cuando se abre el modal
  }

  // Función para inicializar Babylon.js
  initBabylon(modelo3D: any): void {
    if (!this.renderCanvas) return;

    const canvas = this.renderCanvas.nativeElement;
    const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

    // Ajustar la resolución del canvas para mejorar la calidad
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      engine.setSize(canvas.width, canvas.height);
    };

    resizeCanvas(); // Aplicar tamaño inicial del canvas

    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); // Fondo transparente

    // Añadir cámara
    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 5, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Establecer límites de zoom (distancia mínima y máxima de la cámara)
    camera.lowerRadiusLimit = 20; // Distancia mínima de la cámara
    camera.upperRadiusLimit = 70; // Distancia máxima de la cámara

    // Configurar la cámara para que no se desplace hacia arriba
    camera.inertia = 0.8;  // Para un movimiento más suave

    camera.panningSensibility = 700; // Reduce para hacer más sensible el arrastre
    camera.allowUpsideDown = false;

    const pointerInput = camera.inputs.attached["pointers"] as BABYLON.ArcRotateCameraPointersInput;
    pointerInput.buttons = [0, 1, 2];  // Permitir clic izquierdo, derecho y medio para mover la cámara
  // Alternativamente, permitir movimiento con teclado (W, A, S, D)
  scene.onKeyboardObservable.add((kbInfo) => {
    const moveSpeed = 0.8;
    switch (kbInfo.type) {
      case BABYLON.KeyboardEventTypes.KEYDOWN:
        switch (kbInfo.event.key) {
          case "w":
            camera.target.z -= moveSpeed;
            break;
          case "s":
            camera.target.z += moveSpeed;
            break;
          case "a":
            camera.target.x -= moveSpeed;
            break;
          case "d":
            camera.target.x += moveSpeed;
            break;
        }
        break;
      }
    });
    // Añadir luz
    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

    // Cargar modelo GLTF
    BABYLON.SceneLoader.ImportMesh("", "assets/habitats/" + modelo3D + '/', modelo3D + '.glb', scene, (meshes) => {
      console.log("Modelo cargado:", meshes);
    });

    // Renderizar la escena
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Ajustar el tamaño del canvas cuando el modal se abra o cambie de tamaño
    setTimeout(() => {
      resizeCanvas();
      engine.resize();
    }, 100);

    window.addEventListener('resize', () => {
      resizeCanvas();
      engine.resize();
    });

    // Eliminar barra de desplazamiento
    canvas.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    canvas.style.margin = '0';
    canvas.style.padding = '0';
  }
}
