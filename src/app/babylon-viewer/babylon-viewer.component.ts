import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, SimpleChanges, Input, ViewChildren, QueryList } from '@angular/core';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders'; 
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { BabylonService } from '../servicios/babylon.service';
import { tap } from 'rxjs/operators';
import { NgIf , NgFor} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api/menuitem';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Menu, MenuModule } from 'primeng/menu';
import { OverlayPanel } from 'primeng/overlaypanel';
import { NgClass } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { ChangeDetectorRef } from '@angular/core';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MiniPreviewComponent } from '../minipreviewcomponent/minipreviewcomponent.component';
import {MapaComponent} from '../mapa/mapa.component';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { Modelo3DComponent } from '../modelo3-dcomponent/modelo3-dcomponent.component';
import { BabylonIconosComponent } from '../babylon-iconos/babylon-iconos.component';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  group
} from '@angular/animations';
@Component({
  standalone: true,
  imports: [ButtonModule,ImageModule, BabylonIconosComponent,MenuModule, FormsModule,InputSwitchModule,RippleModule,SplitButtonModule,OverlayPanelModule,NgIf,NgClass,MiniPreviewComponent,NgFor,CarouselModule,MapaComponent,DialogModule,Modelo3DComponent],
  selector: 'app-babylon-viewer',
  animations: [
    trigger('slideAnimation', [
      transition(':increment', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ],
  templateUrl: './babylon-viewer.component.html',
  styleUrls: ['./babylon-viewer.component.css']
})
export class BabylonViewerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('menu') menu!: Menu;
  @ViewChild('canvas', { static: true }) canvasElement!: ElementRef;
  @ViewChild('op') op!: OverlayPanel;
  @ViewChild('sonidos') sonidos!: OverlayPanel;
  @ViewChild(MiniPreviewComponent) componenteMini!: MiniPreviewComponent;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  private engine!: BABYLON.Engine;
  private scene!: BABYLON.Scene;
  private camera!: BABYLON.ArcRotateCamera;
  private light!: BABYLON.HemisphericLight;
  private directionalLight!: BABYLON.DirectionalLight;
  private mayaActual: any;
  mostrarMapa:any;
  private tarjetasCaracteristicas: BABYLON.Mesh[] = []; 
  mostrarEtiquetas:any = true;
  ocultarHud:any = false;
  modeloActivado:any;
  animalCountries:any;
  rutaCompletaModelo:any;
  camaraTamanyo:any;
  animal:any;
  hayAnimacion:any = false;
  audios: HTMLAudioElement[] = [];
  intervaloActualizarProgreso: any;
  animacionActivada:any;
  sonidoAnimal:any;
  alimentacionMostrar:any = false;
  historySlides: any[] = [];
  displayHistory:any = false;
  currentSlide = 0;
  private resizeObserver!: ResizeObserver;
  mapaComp: any;
  constructor(private babylonService: BabylonService, private cdRef: ChangeDetectorRef) {}
  selectedModelo: string | null = null;
  activeSlideIndex = 0;
  public mouseDownX = 0;
  public mouseUpX = 0;  
  animationDirection: 'left' | 'right' = 'right';

  nextSlide(): void {
    if (this.currentSlide < this.historySlides.length - 1) {
      this.animationDirection = 'right';
      this.currentSlide++;
    }
  }
  
  prevSlide(): void {
    if (this.currentSlide > 0) {
      this.animationDirection = 'left';
      this.currentSlide--;
    }
  }
  get isFirstSlide(): boolean {
    // Si no hay slides, considera que estamos en la primera
    return this.currentSlide === 0;
  }
  
  get isLastSlide(): boolean {
    // Si no hay slides, considera que estamos en la última también
    const len = this.historySlides?.length ?? 0;
    return this.currentSlide >= len - 1;
  }


  onSlideChange(event: any) {
    // Esperamos un tick de Angular para que el slide ya esté visible
    console.log(this.animalIconos[this.activeSlideIndex]);
    this.activeSlideIndex = event.page;

  }
  ocultarHudd(){
    this.ocultarHud = !this.ocultarHud;
    this.alternarEtiquetas();

  }
  carouselResponsiveOptions: any[] = [
      {
        breakpoint: '4024px',
        numVisible: 1,
        numScroll: 1
    },
    {
        breakpoint: '1024px',
        numVisible: 1,
        numScroll: 1
    },
    {
        breakpoint: '768px',
        numVisible: 1,
        numScroll: 1
    },
    {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
    }
  ];



  ngAfterViewInit(): void {
    // Inicializamos el motor de Babylon.js
    if (typeof navigator !== 'undefined') {
      this.engine = new BABYLON.Engine(this?.canvasElement?.nativeElement, true);
      this.engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
      this.engine.resize();
      this.createScene();

      // Ejecutar el render loop
      this.engine.runRenderLoop(() => {
        this.scene.render();
      });
      this.engine.getRenderingCanvas()!.addEventListener('pointermove', (evt: PointerEvent) => {
        const pick = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
        if (pick?.hit && pick.pickedMesh?.metadata?.tooltip) {
          // primero actualizamos texto y coordenadas
          this.tooltipText = pick.pickedMesh.metadata.tooltip;
    
          const rect = this.canvasElement.nativeElement.getBoundingClientRect();
          this.tooltipX = evt.clientX - rect.left + 10;
          this.tooltipY = evt.clientY - rect.top + 10;
    
          // sólo al final activamos su visibilidad
          this.showTooltip = true;
        } else {
          this.showTooltip = false;
        }
      });
      // Bloquear el scroll de la página al hacer zoom en el modelo
      this.canvasElement.nativeElement.addEventListener('wheel', (event:any) => {
          event.preventDefault(); // Evita el desplazamiento de la página
      });
      this.resizeObserver = new ResizeObserver(() => {
        if (this.engine) {
          this.engine.resize();
        }
      });
      
      this.resizeObserver.observe(this.canvasElement.nativeElement);
      // Ajustar el canvas cuando la ventana cambie de tamaño
      window.addEventListener('resize', () => {
        this.engine.resize();

      });
    }
   
  }
  overlayVisible = false;
  @ViewChild('tooltipRef') tooltipRef!: ElementRef;
  tooltipText = '';
  tooltipX = 0;
  tooltipY = 0;
  showTooltip = false;
  animalIconos:any = [];
  onOverlayShow() {
    this.overlayVisible = true;
  }
  private crearTarjetasCaracteristicas(): void {
    const radio = 50;
    const altura = 3;
  
    // 1) Ahora definimos descriptor + ruta de icono
    const caracteristicas = [
      { descripcion: 'Caza',   iconoUrl: 'assets/caza.png'   },
      { descripcion: 'Comportamiento', iconoUrl: 'assets/comportamiento.png' },
      { descripcion: 'Reproducción', iconoUrl: 'assets/reproduccion.png' },
      { descripcion: 'Comunicación', iconoUrl: 'assets/comunicacion.png' },
      { descripcion: 'Historia', iconoUrl: 'assets/historia.png' },
      { descripcion: 'Alimentación', iconoUrl: 'assets/alimentacion.png' },
      { descripcion: 'Hábitat', iconoUrl: 'assets/habitat.png' }
      
      
    ];
    const numeroPlanos = caracteristicas.length;
  
    caracteristicas.forEach((c, indice) => {
      // 2) Creamos el plano
      const plano = BABYLON.MeshBuilder.CreatePlane(`plano${indice}`, { size: 9 }, this.scene);
      const angulo = (2 * Math.PI / numeroPlanos) * indice;
      plano.position = new BABYLON.Vector3(
        Math.cos(angulo) * radio,
        altura,
        Math.sin(angulo) * radio
      );
      plano.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
      plano.metadata = { tooltip: c.descripcion };
      // 3) Creamos el material y cargamos la textura del icono
      const material = new BABYLON.StandardMaterial(`mat${indice}`, this.scene);
      material.diffuseTexture = new BABYLON.Texture(c.iconoUrl, this.scene);
      material.diffuseTexture.hasAlpha = true;              // si tu PNG tiene canal alpha
      material.useAlphaFromDiffuseTexture = true;           // para recortar fondo
      material.backFaceCulling = false;                     // se vea desde ambos lados
      plano.material = material;
  
      // 4) Acción clicable
      plano.actionManager = new BABYLON.ActionManager(this.scene);
      plano.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPickTrigger,
          () => {
            switch(c.descripcion){
              case 'Historia':
                this.displayHistory = true;
              break;
              case 'Alimentación':
                this.alimentacionMostrar = true;
              break;
           
            }
           
          }
        )
      );
  
      this.tarjetasCaracteristicas.push(plano);
    });
    
    // 5) Animación de órbita automática
    this.scene.registerBeforeRender(() => {
      this.tarjetasCaracteristicas.forEach(plano => {
        plano.rotateAround(
          BABYLON.Vector3.Zero(),
          BABYLON.Axis.Y,
          0.002
        );
      });
    });
  }
  reproducirSonido(index: number) {
    let audio = this.audios[index];
  
    if (!audio) {
      audio = new Audio(this.sonidoAnimal[index].archivo);
      this.audios[index] = audio;
  
      // Cuando termine, resetear estado
      audio.addEventListener('ended', () => {
        this.sonidoAnimal[index].reproduciendo = false;
      });
    }
  
    if (audio.paused) {
      audio.play();
      this.sonidoAnimal[index].reproduciendo = true;
    } else {
      audio.pause();
      this.sonidoAnimal[index].reproduciendo = false;
    }
  }
  pausarSonido(index: number) {
    const audio = this.audios[index];
    if (audio) {
      audio.pause();
      this.sonidoAnimal[index].reproduciendo = false;
    }
  }
  
  obtenerProgreso(index: number): number {
    const audio = this.audios[index];
    if (audio) {
      return (audio.currentTime / audio.duration) * 100;
    }
    return 0;
  }
  
  obtenerTiempoActual(index: number): string {
    const audio = this.audios[index];
    if (audio) {
      const minutos = Math.floor(audio.currentTime / 60);
      const segundos = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
      return `${minutos}:${segundos}`;
    }
    return '0:00';
  }
  private createScene(): void {
    // Crear la escena
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); // Fondo transparente
    // Crear la cámara
    this.camera = new BABYLON.ArcRotateCamera("camera1", -Math.PI /2, Math.PI / 3, 30, BABYLON.Vector3.Zero(), this.scene);


    this.camera.attachControl(this.canvasElement.nativeElement, true);
    this.camera.lowerRadiusLimit = 70;  // Zoom mínimo (más cerca)
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
        this.modeloActivado = res;
        this.rutaCompletaModelo = res?.nombre.toLowerCase();
        this,this.rutaCompletaModelo = 'assets/animales/'+this.rutaCompletaModelo+'/';
        this.camaraTamanyo = res.tamanyoAnimal;
        this.animalCountries = res.paisesAnimal;
   
        this.historySlides = JSON.parse(res.historia);
        console.log(this.historySlides);
        this.animal = res;
        if (this.animal && this.animal.alimentacion) {
          try {
            const alimentacion = JSON.parse(this.animal.alimentacion);
            this.animalIconos = Object.entries(alimentacion).map(([tipo, descripcion]) => ({
              tipo,
              descripcion
            }));
            console.log(this.animalIconos);
          } catch (error) {
            console.error('Error al parsear alimentación:', error);
            this.animalIconos = [];
          }
        }
        this.sonidoAnimal = JSON.parse(res.sonidosAnimal);
        this.animacionActivada = res.animaciones;
        console.log(this.animalCountries);
        this.cdRef.detectChanges();
        console.log(this.animacionActivada);
        this.loadModel(this.animacionActivada[1].archivo);
      })
    ).subscribe()
    this.crearTarjetasCaracteristicas();

  }
  onMapaDialogShow() {
    setTimeout(() => {
      this.mapaComp?.forceResize();
    }, 100); // delay para asegurar que el modal esté totalmente visible
  }
  alternarEtiquetas(): void {
    if (this.tarjetasCaracteristicas.length === 0) {
      this.crearTarjetasCaracteristicas();
    }
  
    this.mostrarEtiquetas = !this.mostrarEtiquetas;
  
    this.tarjetasCaracteristicas.forEach(plano => {
      plano.isVisible = this.mostrarEtiquetas;
    });
  }
  private eliminarModeloAnterior(): void {
    // Detener todas las animaciones
    if (this.scene.animationGroups && this.scene.animationGroups.length > 0) {
      this.scene.animationGroups.forEach(ag => ag.stop());
      this.scene.animationGroups.forEach(ag => ag.dispose());
    }
  
    // Eliminar mallas
    if (this.mayaActual) {
      if (Array.isArray(this.mayaActual)) {
        this.mayaActual.forEach(mesh => {
          if (mesh && mesh.dispose) mesh.dispose();
        });
      } else {
        this.mayaActual.dispose && this.mayaActual.dispose();
      }
      this.mayaActual = null;
    }
  }
  public isDragging = false;
  onMouseDown(event: MouseEvent) {
    this.mouseDownX = event.clientX;
    this.isDragging = false;
  }
  
  onMouseMove(event: MouseEvent) {
    const diff = Math.abs(this.mouseDownX - event.clientX);
    if (diff > 5) {
      this.isDragging = true;
    }
  }
  
  onMouseUp(event: MouseEvent) {
    this.mouseUpX = event.clientX;
  }
  aplicarAnimacion(animacionClick: any) {
    if (this.isDragging) {
      // No fue un clic real, fue un arrastre
      this.isDragging = false;
      return;
    }

    this.selectedModelo = animacionClick;

    this.loadModel(this.selectedModelo);
  }
 
    private estaCargando = false;

    private async loadModel(modelo: any): Promise<void> {
      if (!this.scene || this.scene.isDisposed) {
        console.warn("La escena ha sido eliminada o no está inicializada.");
        return;
      }
    
      if (this.estaCargando) {
        console.log("Carga en proceso, ignorando clic adicional...");
        return;
      }
    
      this.estaCargando = true;
      this.eliminarModeloAnterior();
      console.log(modelo);
      try {
        console.log(this.rutaCompletaModelo);
        const result = await BABYLON.SceneLoader.ImportMeshAsync("", this.rutaCompletaModelo, modelo, this.scene);
        this.mayaActual = result.meshes;
 
        if (this.mayaActual && this.mayaActual.length > 0) {
          const meshPrincipal = this.mayaActual[0];
    
          // Posición y escala
          meshPrincipal.position = new BABYLON.Vector3(0, -2, 0);
          meshPrincipal.scaling = new BABYLON.Vector3(1, 1, 1);
    
          // Cámara centrada
          this.camera.setTarget(meshPrincipal.position);
          const distance = BABYLON.Vector3.Distance(this.camera.position, meshPrincipal.position);
          this.camera.radius = distance;
          this.camera.attachControl( this.canvasElement.nativeElement, true);
          console.log(result.animationGroups);
          // ✅ Gestionar animaciones con animationGroups
          if (result.animationGroups?.length) {
            // Detener y desactivar todas las animaciones
            result.animationGroups.forEach(group => group.stop());
          
            const indexAnimacion = 0;
            const animGroup = result.animationGroups[indexAnimacion];
            if (animGroup) {
              animGroup.start(true);
              console.log(`Reproduciendo animación: ${animGroup.name}`);
            }
          }
    
          console.log("Modelo cargado correctamente:", this.mayaActual);
        } else {
          console.error("No se encontraron mallas en el modelo.");
        }
      } catch (error) {
        console.error("Error al cargar el modelo:", error);
      } finally {
        this.estaCargando = false;
      }
  }
  cambiarCuadro:any= false;
  cerrarCuadro(){
    this.cambiarCuadro = !this.cambiarCuadro;
  }
  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    // Detener el motor cuando el componente sea destruido
    if (this.engine) {
      this.engine?.dispose();
    }
  }
}
