import * as THREE from 'three';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera movement
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI;

// Helper function to create cube vertices
function createCubeVertices(size) {
    const h = size * 0.5;
    const y = size * 1;
    // geometry, side (so left left is left when rendered and left)
    // For vertex (-h, h, -h):
    // x = -h  → left side of cube
    // y = h   → top of cube
    // z = -h  → front of cube
/*
Cube vertex positions:
    top-front-left    top-front-right
    (-h,h,-h)        (h,h,-h)
        +----------+
       /|         /|
      / |        / |
     +----------+  |
     |  |       |  |
     |  +-------|--+
     | /        | /
     |/         |/
     +----------+
    (-h,-h,-h)      (h,-h,-h)
    bottom-front-left  bottom-front-right
*/
    return [
        - h, - h, - h, 
        - h, h, - h,
        h, h, - h,
        h, - h, - h,

        - h, - h, - h,
        - h, - h, h,
        - h, h, h,
        - h, h, - h,

        - h, h, h,
        h, h, h,
        h, h, - h,
        h, h, h,
  
        h, - h, h,
        h, - h, - h,
        h, - h, h,
      - h, - h, h,
    ];
}

// Create cube geometry
const geometry = new LineGeometry();
geometry.setPositions(createCubeVertices(1));

// Create line material
const material = new LineMaterial({
    color: 0xffffff,
    linewidth: 5,
    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight)
});

// Add axes helper (x = red, y = green, z = blue)
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// Create wireframe
const wireframe = new Line2(geometry, material);
scene.add(wireframe);

// Position camera
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Required for damping
    renderer.render(scene, camera);
}
animate();