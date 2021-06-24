import * as THREE from './three/build/three.module.js';
import { Entity, Component } from './entity.js';

const _euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
const _vector = new THREE.Vector3();

const _changeEvent = { type: 'change' };
const _lockEvent = { type: 'lock' };
const _unlockEvent = { type: 'unlock' };

const _PI_2 = Math.PI / 2;

class PlayerEntity extends Entity {

    constructor() {
        super();
    }

}

export { PlayerEntity };
