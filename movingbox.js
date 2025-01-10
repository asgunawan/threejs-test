import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Set up the scene, camera, and renderer
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

// Create box geometries and basic materials and combine them into meshes
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const boxes = [];

// Create and position the boxes in a grid
const gridSize = 10;
const spacing = 1.1;
for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        const box = new THREE.Mesh(geometry, material);
        box.position.z = i * spacing;
        box.position.y = j * spacing;
        boxes.push(box);
        scene.add(box);
    }
}

// Position the camera
camera.position.x = 12;
camera.position.y = 12;
camera.position.z = 7;

// Animation variables
let speed = 1;
let stopPosition = 5;
let currentBoxIndex = 0;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Move the boxes to the right in sequence
    if (currentBoxIndex < boxes.length && boxes[currentBoxIndex].position.x < stopPosition) {
        boxes[currentBoxIndex].position.x += speed;
    } else if (currentBoxIndex < boxes.length) {
        currentBoxIndex++;
    }

    controls.update(); // Update controls

    renderer.render(scene, camera);
}

// Start the animation loop
animate();