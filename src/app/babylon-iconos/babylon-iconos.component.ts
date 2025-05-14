import { NgStyle } from '@angular/common';
import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy, SimpleChanges } from '@angular/core';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { createWriteStream } from 'fs';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-babylon-iconos',
  template: `
    <div class="babylon-container">
      <canvas #canvas></canvas>
      <div
        class="babylon-tooltip"
        [ngStyle]="{ 
          left: tooltipX + 'px', 
          top: tooltipY + 'px',
          opacity: showTooltip ? '1' : '0'
        }"
      >
        {{ tooltipText }}
      </div>
    </div>
  `,
  styleUrls: ['./babylon-iconos.component.css'],
  standalone: true,
  imports: [NgStyle]
})

export class BabylonIconosComponent implements AfterViewInit, OnDestroy {
  @Input() nombre: any;
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;
  tarjetasCaracteristicas: any[] = [];

  private engine!: BABYLON.Engine;
  private scene!: BABYLON.Scene;
  private camera!: BABYLON.ArcRotateCamera;
  private modelo: BABYLON.AbstractMesh | null = null;
  public mouseDownX = 0;
  public mouseUpX = 0;
  @ViewChild('tooltipRef') tooltipRef!: ElementRef;
  tooltipText = '';
  tooltipX = 0;
  tooltipY = 0;
  showTooltip = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nombre'] && changes['nombre'].currentValue && this.scene) {
      this.limpiarTarjetas();
      this.crearTarjetasCaracteristicas();
    }
  }

  private crearTarjetasCaracteristicas(): void {
    const radio = 20;
    const altura = 3;
    let caracteristicas: { descripcion: string, iconoUrl: string }[] = [];

    const imagenes = this.nombre.descripcion.imagenes;
    switch (this.nombre?.tipo) {
      case 'carne':
      case 'peces':
      case 'plantas':
        Object.entries(imagenes).forEach(([descripcion, iconoUrl], index) => {
          caracteristicas[index] = {
            descripcion: descripcion.toString(),
            iconoUrl: 'assets/' + iconoUrl
          };
        });
        break;
    }

    const numeroPlanos = caracteristicas.length;

    caracteristicas.forEach((c, indice) => {
      const plano = BABYLON.MeshBuilder.CreatePlane(`plano${indice}`, { size: 13 }, this.scene);
      const angulo = (2 * Math.PI / numeroPlanos) * indice;
      plano.position = new BABYLON.Vector3(
        Math.cos(angulo) * radio,
        altura,
        Math.sin(angulo) * radio
      );
      plano.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
      plano.metadata = { tooltip: c.descripcion };

      const material = new BABYLON.StandardMaterial(`mat${indice}`, this.scene);
      material.diffuseTexture = new BABYLON.Texture(c.iconoUrl, this.scene);
      material.diffuseTexture.hasAlpha = true;
      material.useAlphaFromDiffuseTexture = true;
      material.backFaceCulling = false;
      plano.material = material;

      plano.actionManager = new BABYLON.ActionManager(this.scene);

      // 🟢 Acción al hacer clic (si lo deseas)
      plano.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPickTrigger,
          () => {
            switch (c.descripcion) {
              case 'Pollo':
                console.log('Has clickado en pollo');
                break;
              case 'Alimentación':
                break;
            }
          }
        )
      );

      this.tarjetasCaracteristicas.push(plano);
    });

    this.scene.registerBeforeRender(() => {
      this.tarjetasCaracteristicas.forEach((plano: any) => {
        plano.rotateAround(
          BABYLON.Vector3.Zero(),
          BABYLON.Axis.Y,
          0.002
        );
      });
    });
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }

    const canvas = this.canvasRef?.nativeElement;

    if (!canvas) {
      console.error('Canvas no disponible.');
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          // Inicializar Babylon solo cuando el canvas tenga dimensiones válidas
          observer.disconnect();
          this.inicializarBabylon(canvas);
        }
      }
    });

    observer.observe(canvas);
  }

  private inicializarBabylon(canvas: HTMLCanvasElement): void {
    console.log('Inicializando Babylon con modelo:', this.nombre);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    canvas.width = width;
    canvas.height = height;

    this.engine = new BABYLON.Engine(canvas, true);
    this.engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
    this.engine.resize();

    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    this.camera = new BABYLON.ArcRotateCamera(
      "camera1",
      -Math.PI / 2,     // alpha (horizontal angle)
      Math.PI / 3,      // beta (vertical angle) ⬅️ más chico que PI/2 para que mire desde arriba
      120,              // radius
      BABYLON.Vector3.Zero(),
      this.scene
    );

    this.camera.attachControl(canvas, true);
    this.camera.lowerRadiusLimit = 60;
    this.camera.upperRadiusLimit = 60;
    this.camera.wheelPrecision = 20;
    this.camera.setPosition(new BABYLON.Vector3(0, 5, -10));

    const hemiLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), this.scene);
    hemiLight.intensity = 0.8;
    hemiLight.diffuse = new BABYLON.Color3(1, 1, 1);
    hemiLight.groundColor = new BABYLON.Color3(0.2, 0.2, 0.2);

    // Luz direccional (como luz solar)
    const dirLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-1, -2, -1), this.scene);
    dirLight.position = new BABYLON.Vector3(50, 100, 50);
    dirLight.intensity = 1;
    dirLight.diffuse = new BABYLON.Color3(1, 1, 1);
    this.crearTarjetasCaracteristicas();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
    this.engine.getRenderingCanvas()!.addEventListener('pointermove', (evt: PointerEvent) => {
      const canvasRect = canvas.getBoundingClientRect();
      const x = evt.clientX - canvasRect.left;
      const y = evt.clientY - canvasRect.top;

      const pick = this.scene.pick(x, y);

      if (pick?.hit && pick.pickedMesh?.metadata?.tooltip) {
        this.tooltipText = pick.pickedMesh.metadata.tooltip;
        this.tooltipX = evt.clientX - canvasRect.left + 10;
        this.tooltipY = evt.clientY - canvasRect.top + 10;

        this.showTooltip = true;
      } else {
        this.showTooltip = false;
      }
    });

          window.addEventListener('resize', () => {
            this.engine.resize();
          });
        }

  private limpiarTarjetas(): void {
    this.tarjetasCaracteristicas.forEach(plano => plano.dispose());
    this.tarjetasCaracteristicas = [];
  }

  ngOnDestroy(): void {
    this.engine?.dispose();
  }
}
