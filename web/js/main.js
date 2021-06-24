import * as THREE from "./three/build/three.module.js";
import { EffectComposer } from './three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './three/examples/jsm/postprocessing/RenderPass.js';
import { SMAAPass } from './three/examples/jsm/postprocessing/SMAAPass.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ReinhardToneMapping;
document.body.appendChild( renderer.domElement );


const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
const cube = new THREE.Mesh( boxGeometry, material );
cube.castShadow = true;
scene.add( cube );

const planeGeometry = new THREE.PlaneGeometry(20, 20);
planeGeometry.rotateX(-Math.PI/2)
const plane = new THREE.Mesh(planeGeometry, material);
plane.receiveShadow = true;
//plane.rotation.x -= Math.PI/2;
plane.position.y -= 1;
scene.add(plane);

// const light = new THREE.DirectionalLight(0xffffff, 1);
const light = new THREE.PointLight( 0xffddaa, 60, 0.0, 2);
light.position.set(0, 2, 0);
light.castShadow = true;
scene.add(light);

const ambientLight = new THREE.AmbientLight( 0x101730, 0.5 );
scene.add(ambientLight);

camera.position.z = 5;

const helper = new THREE.CameraHelper( light.shadow.camera );
scene.add( helper );

//postprocessing

let composer = new EffectComposer( renderer );
composer.addPass( new RenderPass( scene, camera ) );

const pass = new SMAAPass( window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio() );
composer.addPass( pass );

function animate() {
	requestAnimationFrame( animate );
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
	// renderer.render( scene, camera );
	composer.render( scene, camera );
}
animate();


function onWindowResize() {

    renderer.setSize( window.innerWidth, window.innerHeight );

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

}
window.addEventListener( 'resize', onWindowResize );