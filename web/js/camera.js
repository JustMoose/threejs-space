import * as THREE from './three/build/three.module.js';
import { Entity, Component } from './entity.js';

const _euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
const _vector = new THREE.Vector3();

const _changeEvent = { type: 'change' };
const _lockEvent = { type: 'lock' };
const _unlockEvent = { type: 'unlock' };

const _PI_2 = Math.PI / 2;

class Camera extends Component {

    constructor( object, domElement ) {
        super();
        this.SetParent(object);
            // camera
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.z = 5;
    }

    Update() {
        this.rotation = this.parent.rotation;
        this.camera.setRotationFromQuaternion(this.rotation);
        this.position = this.parent.position;
        this.camera.position.copy(this.parent.position);

    }
}

export { Camera };
