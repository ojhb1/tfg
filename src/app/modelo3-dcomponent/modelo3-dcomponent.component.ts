import { Component, ElementRef, Input, AfterViewInit, ViewChild, Inject, PLATFORM_ID, OnDestroy, NgZone, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import { Color4 } from '@babylonjs/core/Maths/math.color';

@Component({
  selector: 'app-modelo-3d',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="width: 100%; height: 100%;">
      <canvas #canvas3D style="width: 100%; height: 100%; display: block;"></canvas>
    </div>
  `,
})
export class Modelo3DComponent implements AfterViewInit, OnDestroy {
  @Input() modeloUrl!: string;
  @Output() arrastreDetectado = new EventEmitter<boolean>();
  @ViewChild('canvas3D', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private resizeObserver?: ResizeObserver;
  private engine!: BABYLON.Engine;
  private scene!: BABYLON.Scene;
  private resizeListener!: () => void;
  private startX = 0;
  private startY = 0;
  private wasDragging = false;
  private clickThreshold = 4;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    // Desconectamos el detector de cambios para que nada de aquí lo active
    this.cdr.detach();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Ejecutamos TODO fuera de Angular para que no dispare CD
    this.ngZone.runOutsideAngular(() => {
      const canvas = this.canvasRef.nativeElement;
      this.engine = new BABYLON.Engine(canvas, true);
      this.scene = new BABYLON.Scene(this.engine);
      this.resizeObserver = new ResizeObserver(() => {
        this.engine.resize();
      });
      
      this.resizeObserver.observe(canvas);
      // Fondo transparente
      this.scene.clearColor = new Color4(0, 0, 0, 0);

      // Cámara fija
      const camera = new BABYLON.ArcRotateCamera(
        'camera',
        0,
        Math.PI / 2,
        15, // más lejos aun
        BABYLON.Vector3.Zero(),
        this.scene
      );
      camera.attachControl(canvas, true);
      camera.lowerRadiusLimit = camera.upperRadiusLimit = 120;

      // Luz
      new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene);

      // Cargamos el modelo
      BABYLON.SceneLoader.Append('', this.modeloUrl, this.scene, () => {
        this.engine.runRenderLoop(() => this.scene.render());
      });

      // Resize
      this.resizeListener = () => this.engine.resize();
      window.addEventListener('resize', this.resizeListener);

      // Interceptamos puntero para drag/vs click SIN disparar Angular CD
      canvas.addEventListener('pointerdown', (e: PointerEvent) => {
        this.startX = e.clientX; this.startY = e.clientY; this.wasDragging = false;
      });
      canvas.addEventListener('pointermove', (e: PointerEvent) => {
        const dx = Math.abs(e.clientX - this.startX), dy = Math.abs(e.clientY - this.startY);
        if (dx > this.clickThreshold || dy > this.clickThreshold) this.wasDragging = true;
      });
      canvas.addEventListener('pointerup', () => {
        // Para emitir el evento al padre, volvemos A Angular
        this.ngZone.run(() => this.arrastreDetectado.emit(this.wasDragging));
      });
    });
  }

  ngOnDestroy(): void {
    if (this.engine) {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
      this.engine.stopRenderLoop();
      this.scene.dispose();
      this.engine.dispose();
    }
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }
}
