import * as THREE from './three/build/three.module.js';
import { Entity, Component } from './entity.js';

const _euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
const _vector = new THREE.Vector3();

const _changeEvent = { type: 'change' };
const _lockEvent = { type: 'lock' };
const _unlockEvent = { type: 'unlock' };

const _PI_2 = Math.PI / 2;

class Controller extends Component { //EventDispatcher {

    constructor( object, domElement ) {

        super();
        this.SetParent(object);
        this.Init(domElement)
        this.Connect();
    }

    Init(domElement ) {
        if ( domElement === undefined ) {

            console.warn( 'THREE.PointerLockControls: The second parameter "domElement" is now mandatory.' );
            domElement = document.body;

        }

        this.input = this.GetComponent('Input');

        this.domElement = domElement;
        this.isLocked = true;

        // Set to constrain the pitch of the object
        // Range is 0 to Math.PI radians
        this.minPolarAngle = 0; // radians
        this.maxPolarAngle = Math.PI; // radians
    }

    Connect() {
        this.domElement.ownerDocument.addEventListener( 'mousemove', this.onMouseMove.bind(this) );
        this.domElement.ownerDocument.addEventListener( 'pointerlockchange', this.onPointerlockChange.bind(this) );
        this.domElement.ownerDocument.addEventListener( 'pointerlockerror', this.onPointerlockError.bind(this) );
    };

    Disconnect() {
        this.domElement.ownerDocument.removeEventListener( 'mousemove', this.onMouseMove.bind(this) );
        this.domElement.ownerDocument.removeEventListener( 'pointerlockchange', this.onPointerlockChange.bind(this) );
        this.domElement.ownerDocument.removeEventListener( 'pointerlockerror', this.onPointerlockError.bind(this) );
    };

    Update() {
    }

    onMouseMove( event ) {
        if ( this.isLocked === false ) return;
        const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
        _euler.setFromQuaternion( this.parent.rotation );
        _euler.y -= movementX * 0.002;
        _euler.x -= movementY * 0.002;
        _euler.x = Math.max( _PI_2 - this.maxPolarAngle, Math.min( _PI_2 - this.minPolarAngle, _euler.x ) );
        this.parent.rotation.setFromEuler( _euler );
        //this.dispatchEvent( _changeEvent );
    }


    onPointerlockChange() {
        if ( this.domElement.ownerDocument.pointerLockElement === this.domElement ) {
            //this.dispatchEvent( _lockEvent );
            this.isLocked = true;
        } else {
            //this.dispatchEvent( _unlockEvent );
            this.isLocked = false;
        }
    }

    onPointerlockError() {
        console.error( 'THREE.PointerLockControls: Unable to use Pointer Lock API' );
    }

    dispose() {
        this.disconnect();
    };

    getObject() { // retaining this method for backward compatibility
        return this.parent;
    };

    getDirection() {
        const direction = new THREE.Vector3( 0, 0, - 1 );
        return function ( v ) {
            return v.copy( direction ).applyQuaternion( this.parent.quaternion );
        };
    };

    moveForward( distance ) {
        // move forward parallel to the xz-plane
        // assumes object.up is y-up
        _vector.setFromMatrixColumn( this.parent.matrix, 0 );
        _vector.crossVectors( this.parent.up, _vector );
        this.parent.position.addScaledVector( _vector, distance );
    };

    moveRight( distance ) {
        _vector.setFromMatrixColumn( this.parent.matrix, 0 );
        this.parent.position.addScaledVector( _vector, distance );
    };

    lock() {
        this.domElement.requestPointerLock();
    };

    unlock() {
        this.domElement.ownerDocument.exitPointerLock();
    };



}

export { Controller };
