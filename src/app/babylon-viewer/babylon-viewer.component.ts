import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders'; 
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { BabylonService } from '../servicios/babylon.service';
import { tap } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [ButtonModule, RippleModule],
  selector: 'app-babylon-viewer',
  templateUrl: './babylon-viewer.component.html',
  styleUrls: ['./babylon-viewer.component.css']
})
export class BabylonViewerComponent implements AfterViewInit, OnDestroy {

  @ViewChild('canvas', { static: true }) canvasElement!: ElementRef;
  private engine!: BABYLON.Engine;
  private scene!: BABYLON.Scene;
  private camera!: BABYLON.ArcRotateCamera;
  private light!: BABYLON.HemisphericLight;
  private directionalLight!: BABYLON.DirectionalLight;
  private mayaActual: any;
  modeloActivado:any;
  rutaCompletaModelo:any;
  hayAnimacion:any = false;
  animacionActivada:any;
  constructor(private babylonService: BabylonService) {}

  ngAfterViewInit(): void {
    // Inicializamos el motor de Babylon.js
    if (typeof navigator !== 'undefined') {
      this.engine = new BABYLON.Engine(this?.canvasElement?.nativeElement, true);

      this.createScene();
    
      // Ejecutar el render loop
      this.engine.runRenderLoop(() => {
        this.scene.render();
      });
  
      // Bloquear el scroll de la página al hacer zoom en el modelo
      this.canvasElement.nativeElement.addEventListener('wheel', (event:any) => {
          event.preventDefault(); // Evita el desplazamiento de la página
      });
      // Ajustar el canvas cuando la ventana cambie de tamaño
      window.addEventListener('resize', () => {
        this.engine.resize();
        
      });
    }
   
  }

  private createScene(): void {
    // Crear la escena
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); // Fondo transparente
    // Crear la cámara
    this.camera = new BABYLON.ArcRotateCamera("camera1", -Math.PI /2, Math.PI / 3, 30, BABYLON.Vector3.Zero(), this.scene);


    this.camera.attachControl(this.canvasElement.nativeElement, true);
    this.camera.lowerRadiusLimit = 50;  // Zoom mínimo (más cerca)
    this.camera.upperRadiusLimit = 150; // Zoom Maximo (mas lejos)
    this.camera.wheelPrecision = 10;  // Valor por defecto es 50, disminúyelo para un zoom más suave
    this.camera.setPosition(new BABYLON.Vector3(0, 5, -10));
    
    // Crear luz ambiental
    this.light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
    this.light.intensity = 1.2; // Aumentar intensidad para mejor iluminación

    // Luz direccional para mejorar sombras
    this.directionalLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-1, -2, -1), this.scene);
    this.directionalLight.position = new BABYLON.Vector3(5, 10, 5);
    this.directionalLight.intensity = 1.5;

    this.babylonService.modelo$.pipe(
      tap((res:any)=>{
        console.log(res);
        this.modeloActivado = res;
        this.rutaCompletaModelo = res?.nombre.toLowerCase();
        this,this.rutaCompletaModelo = 'assets/animales/'+this.rutaCompletaModelo+'/';
        this.animacionActivada = res.animaciones;
        this.animacionActivada = JSON.parse(this.animacionActivada);
        console.log(this.modeloActivado);
        this.loadModel(this.animacionActivada[1]);
      })
    ).subscribe()
  
  }
  inmovil(){
    this.mayaActual.dispose();
    this.loadModel(this.animacionActivada[1]);
  }
  sinAnimar(){
    this.mayaActual.dispose();
    this.loadModel(this.animacionActivada[0]);
  }
  personalizada(){
    this.mayaActual.dispose();
    this.loadModel(this.animacionActivada[2]);
  }
  private async loadModel(modelo:any): Promise<void> {
    try {

      console.log(this.rutaCompletaModelo);
      const result = await BABYLON.SceneLoader.ImportMeshAsync("", this.rutaCompletaModelo, modelo+".glb", this.scene);
      this.mayaActual = result.meshes[0];

      if (this.mayaActual) {
        // Ajustar posición del modelo 
        this.mayaActual.position = new BABYLON.Vector3(0, -2, 0);
        this.mayaActual.scaling = new BABYLON.Vector3(1, 1, 1); // Ajustar escala 
        console.log("Posición del modelo: ", this.mayaActual.position); 
       
        // Centrar la cámara en el modelo
        this.camera.setTarget(this.mayaActual.position); 
        // Establecemos el radio (distancia) de la cámara para que quede en el punto adecuado
        const distance = BABYLON.Vector3.Distance(this.camera.position, this.mayaActual.position);
        this.camera.radius = distance; // Configura el zoom inicial en base a la distancia al modelo

        this.camera.attachControl(this.canvasElement.nativeElement, true);

        this.scene.beginAnimation(this.mayaActual, 0, 100, true);
        console.log("Modelo cargado correctamente:", this.mayaActual);
      } else {
        console.error("No se encontraron mallas en el modelo.");
      }
    } catch (error) {
      console.error("Error al cargar el modelo:", error);
    }
  }

  ngOnDestroy(): void {
    // Detener el motor cuando el componente sea destruido
    if (this.engine) {
      this.engine.dispose();
    }
  }
}
