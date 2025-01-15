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
    this.camera.position.set(0, 1, 5);

    // Crear el renderizador usando el canvas del HTML
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      alpha: true // Permite la transparencia
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Añadir luz
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    this.scene.add(light);

    // Cargar el modelo
    const loader = new GLTFLoader();
    loader.load('../../assets/gato.glb', (gltf) => {
      this.scene.add(gltf.scene);
    });

    // Añadir controladores
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Animar en bucle
    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }
}
