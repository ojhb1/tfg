import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  standalone: true,
  selector: 'app-three-scene',
  templateUrl: './three-scene.component.html',
  styleUrls: ['./three-scene.component.css']
})
export class ThreeSceneComponent implements OnInit, OnDestroy {
  @ViewChild('threeCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private mixer!: THREE.AnimationMixer;

  capturedImage: string | null = null;

  constructor() {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.initScene();
    } else {
      console.warn('No se pudo inicializar Three.js: el objeto window no está definido.');
    }
  }

  ngOnDestroy(): void {
    if (this.renderer) {
      // Elimina el canvas asociado
      const canvas = this.renderer.domElement;
      if (canvas.parentElement) {
        canvas.parentElement.removeChild(canvas);
      }
      this.renderer.dispose();
    }
  
    if (this.scene) {
      // Limpia la escena completamente
      while (this.scene.children.length > 0) {
        const child = this.scene.children[0];
        this.scene.remove(child);
  
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    }
  }

  private initScene(): void {
    // Crear la escena
    this.scene = new THREE.Scene();

    // Crear la cámara
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 2, 5); // Ajuste para una mejor vista

    // Crear el renderizador usando el canvas del HTML
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      alpha:true
    });
    this.renderer.setSize(window.innerWidth/1.5, window.innerHeight/1.5);
    this.renderer.setPixelRatio(window.devicePixelRatio); // Mejora la calidad

    // Añadir luz
    const light = new THREE.DirectionalLight(0xffffff, 2);
    const light2 = new THREE.DirectionalLight(0xffffff, 2);
    light2.position.set(-5, 5, -5).normalize();
    light.position.set(5, 5, 5).normalize();
    this.scene.add(light);
    this.scene.add(light2);

    // Cargar el modelo
    const loader = new GLTFLoader();
    loader.load('../../assets/gatoAnimacion1.glb', (gltf) => {
      const model = gltf.scene;

      if (gltf.animations && gltf.animations.length) {
        this.mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
          this.mixer.clipAction(clip).play();
        });
      }

      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) { // Cast a THREE.Mesh
          const mesh = child as THREE.Mesh; // Guardar el cast
          if (mesh.material instanceof THREE.Material) {
            mesh.material.alphaTest = 0.5;
            mesh.material.transparent = true;
            mesh.material.side = THREE.DoubleSide;
          }
        }
      });
      // Obtener bounding box para centrar el modelo
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center); // Centrar el modelo en (0,0,0)
      model.position.y += 1;
      this.scene.add(model);

      // Asegurar que la cámara mire hacia el modelo
      this.camera.lookAt(center);
      this.controls.target.set(center.x, center.y, center.z);
    });

    // Añadir controladores
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // Suaviza el movimiento
    this.controls.dampingFactor = 0.05;
    this.controls.zoomSpeed = 0.5; // Controla la velocidad del zoom

    this.controls.minDistance = 2;  // Distancia mínima 
    this.controls.maxDistance = 40; // Distancia máxima 

    // Ajustar la cámara al cambiar el tamaño de la ventana
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth /1.5, window.innerHeight/1.5);
    });

    // Animar en bucle
    const animate = () => {
      requestAnimationFrame(animate);

      // Actualiza el mezclador de animaciones si existe
      if (this.mixer) {
        this.mixer.update(0.01);  // El valor de deltaTime puede ajustarse
      }

      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
}


  captureImage(): void {
    const dataURL = this.renderer.domElement.toDataURL('image/png'); 
    this.capturedImage = dataURL; 
    console.log('Imagen capturada:', dataURL); 
  }
}
