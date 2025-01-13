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
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0 });
const boxes = [];

// Customize grid dimensions
const gridX = 10; // Number of boxes along the x-axis
const gridY = 3; // Number of boxes along the y-axis
const gridZ = 4; // Number of boxes along the z-axis
const spacing = 1.1;

// Create and position the boxes in a customizable grid
for (let i = 0; i < gridX; i++) {
    for (let j = 0; j < gridY; j++) {
        for (let k = 0; k < gridZ; k++) {
            const box = new THREE.Mesh(geometry, material.clone());
            box.position.x = i * spacing;
            box.position.y = j * spacing;
            box.position.z = k * spacing;
            boxes.push(box);
        }
    }
}

// Position the camera
camera.position.x = -0.9;
camera.position.y = 3.7;
camera.position.z = 16;

// Speed controls
const globalSpeed = 1; // Global speed multiplier (scuffed for now)
var renderSpeed = 0.2 * globalSpeed; // Time to wait (in seconds) before rendering the next row
var moveSpeed = 0.5 * globalSpeed; // Speed of the movement
var fadeSpeed = 0.2 * globalSpeed; // Speed of the opacity increase
var moveDistance = 2; // Fixed amount of distance to move

let currentRow = gridX - 1; // Start from the rightmost row
let currentBoxInRow = 0; // Track the current box in the row

// Function to render one row at a time from right to left
function renderRow() {
    if (currentRow >= 0) {
        if (currentBoxInRow < gridY * gridZ) {
            const j = Math.floor(currentBoxInRow / gridZ);
            const k = currentBoxInRow % gridZ;
            const index = currentRow * gridY * gridZ + j * gridZ + k;
            scene.add(boxes[index]);
            fadeInBox(boxes[index], () => {
                currentBoxInRow++;
                renderRow();
            });
        } else {
            currentRow--;
            currentBoxInRow = 0;
            setTimeout(renderRow, renderSpeed * 1000); // Wait before rendering the next row
        }
    }
}

//Fading the box in
function fadeInBox(box, callback) {
    function fade() {
        if (box.material.opacity < 1) {
            box.material.opacity += fadeSpeed;
            requestAnimationFrame(fade);
        } else {
            animateBox(box, callback);
        }
    }
    fade();
}

//Animate the box to move
function animateBox(box, callback) {
    const targetPosition = box.position.x + moveDistance;
    function move() {
        if (box.position.x < targetPosition) {
            box.position.x += moveSpeed;
            requestAnimationFrame(move);
        } else {
            callback();
        }
    }
    move();
}

// Render the scene
function render() {
    requestAnimationFrame(render);
    controls.update(); // Update controls
    renderer.render(scene, camera);
}

// Log camera position on "p" key press
// Just for testing purposes
window.addEventListener('keydown', (event) => {
    if (event.key === 'p') {
        console.log(`Camera position: x=${camera.position.x}, y=${camera.position.y}, z=${camera.position.z}`);
    }
});

// Start rendering when the button is clicked
document.getElementById('startButton').addEventListener('click', () => {
    render();
    renderRow();
});