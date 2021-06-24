import * as THREE from './three/build/three.module.js';
import { Entity, Component } from './entity.js';

const _euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
const _vector = new THREE.Vector3();

const _changeEvent = { type: 'change' };
const _lockEvent = { type: 'lock' };
const _unlockEvent = { type: 'unlock' };

const _PI_2 = Math.PI / 2;

class Input extends Component {

    constructor( object, domElement ) {
        super();
        this.SetParent(object);
        this.moveForward = false;
        this.moveBackward = false;
        this.moveRight = false;
        this.moveLeft = false;
        this.canJump = false;
    }

    Init() {
        document.addEventListener( 'keydown', this.onKeyDown.bind(this) );
        document.addEventListener( 'keyup', this.onKeyUp.bind(this) );
    }

    onKeyDown = function ( event ) {

        switch ( event.code ) {

            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = true;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = true;
                break;

            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = true;
                break;

            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = true;
                break;

            case 'Space':
                if ( this.canJump === true ) velocity.y += 350;
                this.canJump = false;
                break;

        }

    };

    onKeyUp = function ( event ) {

        switch ( event.code ) {

            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = false;
                break;

        }

    };


}

export { Input };
