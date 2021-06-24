import * as THREE from "./three/build/three.module.js";
import { EffectComposer } from './three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './three/examples/jsm/postprocessing/RenderPass.js';
import { SMAAPass } from './three/examples/jsm/postprocessing/SMAAPass.js';

import { Controller } from './controller.js';
import { Input } from './input.js';
import { EntityManager } from './entity-manager.js';
import { Camera } from './camera.js';
import { PlayerEntity } from "./entity-player.js";

let renderer, scene, camera, controls, input, player;
let composer;

let cube, plane;
let entityManager;

const clock = new THREE.Clock();

init();
animate();

function init() {

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    document.body.appendChild( renderer.domElement );

    entityManager = new EntityManager();



    // controls
    player = new PlayerEntity();
    entityManager.Add(player);
    camera = new Camera( player, renderer.domElement )
    player.AddComponent(camera);
    input = new Input( player, renderer.domElement )
    player.AddComponent(input);
    controls = new Controller( player, renderer.domElement )
    player.AddComponent(controls);

    window.addEventListener( 'click', function () {controls.lock();});

    //input = new Input( player, renderer.domElement );
    //controls = new Controller( player, renderer.domElement );

    setupTestScene();

    // postprocessing
    composer = new EffectComposer( renderer );
    composer.addPass( new RenderPass( scene, camera.camera ) );

    const pass = new SMAAPass( window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio() );
    composer.addPass( pass );
}

function setupTestScene() {
    const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
    cube = new THREE.Mesh( boxGeometry, material );
    cube.castShadow = true;
    scene.add( cube );

    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    planeGeometry.rotateX(-Math.PI/2)
    plane = new THREE.Mesh(planeGeometry, material);
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

    const helper = new THREE.CameraHelper( light.shadow.camera );
    scene.add( helper );
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {

    const delta = clock.getDelta();
    cube.rotation.x += 0.1 * delta;
    cube.rotation.y += 0.1 * delta;

    entityManager.Update( delta );
    composer.render( delta );
}

function onWindowResize() {

    renderer.setSize( window.innerWidth, window.innerHeight );

    camera.camera.aspect = window.innerWidth / window.innerHeight;
    camera.camera.updateProjectionMatrix();

}
window.addEventListener( 'resize', onWindowResize );