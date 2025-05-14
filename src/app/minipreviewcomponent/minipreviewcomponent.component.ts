import { Component, Input, AfterViewInit, ElementRef, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { HostListener } from '@angular/core';
import internal from 'stream';
@Component({
  selector: 'app-mini-preview',
  standalone: true,
  templateUrl: './minipreviewcomponent.component.html',
  styleUrls: ['./minipreviewcomponent.component.css']
})
export class MiniPreviewComponent implements AfterViewInit, OnDestroy {
  @Input() urlGlobal!: string;
  @Input() modeloUrl!: string;
  @Input() tamanyoAnimal!: number;
  @Input() animacionNombre!: string;
  @Output() animacionSeleccionada = new EventEmitter<string>();

  @ViewChild('miniCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private engine!: BABYLON.Engine;
  private scene!: BABYLON.Scene;
  private camera!: BABYLON.ArcRotateCamera;
  private resizeObserver!: ResizeObserver;
  startX = 0;
  startY = 0;
  wasDragging = false;
  clickThreshold = 4;
  
  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.wasDragging = false;
  }
  
  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    const dx = Math.abs(event.clientX - this.startX);
    const dy = Math.abs(event.clientY - this.startY);
    if (dx > this.clickThreshold || dy > this.clickThreshold) {
      this.wasDragging = true;
    }
  }

  @HostListener('pointerup', ['$event'])
  onPointerUp(event: PointerEvent): void {
    if (!this.wasDragging) {
      // Es un click real
      this.animacionSeleccionada.emit(this.modeloUrl);
    }
  }
  // Handle the click event for animation selection
  handleClick() {
    console.log(this.modeloUrl);
    this.animacionSeleccionada.emit(this.modeloUrl);
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') {
      return; // Estamos en SSR, no hacer nada
    }
    console.log(this.tamanyoAnimal);
    const canvas = this.canvasRef.nativeElement;
    console.log('🔍 urlGlobal:', this.urlGlobal);
    console.log('🔍 modeloUrl:', this.modeloUrl);
    console.log(this.animacionNombre);
    // Establece la resolución del canvas según el tamaño del contenedor
    this.updateCanvasSize(canvas);
  
    // Configura el motor de Babylon
    this.engine = new BABYLON.Engine(canvas, true);
    this.engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
  
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); // Fondo transparente
  
    // Configura la cámara
    this.camera = new BABYLON.ArcRotateCamera(
      "camera",
      0,
      Math.PI / 2,
      10,
      BABYLON.Vector3.Zero(),
      this.scene
    );
    this.camera.attachControl(canvas, false);
    this.camera.lowerRadiusLimit = 10 * this.tamanyoAnimal + (this.tamanyoAnimal * 2);
    this.camera.upperRadiusLimit = 10 * this.tamanyoAnimal + (this.tamanyoAnimal * 2);
    this.camera.wheelPrecision = 20;
    this.camera.setTarget(BABYLON.Vector3.Zero());
    this.camera.minZ = 0.1;
    this.camera.maxZ = 1000;
  
    // Luz
    new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), this.scene);
  
    // Cargar el modelo
    console.log(this.modeloUrl);
    this.loadModel(this.modeloUrl);
  
    // Loop de renderizado
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  
    // Reajustar el canvas en redimensionamiento
    window.addEventListener('resize', () => {
      this.updateCanvasSize(canvas);
      this.engine.resize();
    });
    this.resizeObserver = new ResizeObserver(() => {
      this.updateCanvasSize(this.canvasRef.nativeElement);
    });
    this.resizeObserver.observe(this.canvasRef.nativeElement);
  }
  
  private updateCanvasSize(canvas: HTMLCanvasElement) {
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
  
    canvas.width = width * ratio;
    canvas.height = height * ratio;
  
    this.engine?.resize(); // Asegura que Babylon actualice su buffer interno
  }

  private loadModel(url: string): void {
    // Cargar el modelo GLB desde la URL
    console.log("👉 Cargando modelo:", this.animacionNombre);
    console.log(url);
    console.log(this.urlGlobal);
    BABYLON.SceneLoader.Append(this.urlGlobal, url, this.scene, () => {
      const root = this.scene.getMeshByName('__root__') as BABYLON.TransformNode;

      if (root) {
        const bounding = root.getHierarchyBoundingVectors();
        const size = bounding.max.subtract(bounding.min);
        const maxSize = Math.max(size.x, size.y, size.z);
        const scaleFactor = 10 / maxSize;

        root.scaling = new BABYLON.Vector3(scaleFactor, scaleFactor, scaleFactor);
        if(this.tamanyoAnimal == 1 )
          root.position = new BABYLON.Vector3(0, 0, 0);
        else
          root.position = new BABYLON.Vector3(0, -this.tamanyoAnimal, 0);
        root.rotation = new BABYLON.Vector3(0, Math.PI, 0); // Gira 180 grados
      }
    }, null, (scene, message) => {
      console.error(`Error cargando modelo "${url}":`, message);
    });
  }

  ngOnDestroy(): void {
    // Destruir el motor de Babylon al destruir el componente
    this.engine?.dispose();
    this.resizeObserver?.disconnect();
  }
}
