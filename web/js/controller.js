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
        this.isLocked = false;

        this.direction = new THREE.Vector3();
        this.velocity = new THREE.Vector3();

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

    Update( delta ) {
        this.direction.z = Number( this.input.moveForward ) - Number( this.input.moveBackward );
        this.direction.x = Number( this.input.moveRight ) - Number( this.input.moveLeft );
        this.direction.normalize(); // this ensures consistent movements in all directions
        if ( this.input.moveForward || this.input.moveBackward ) this.velocity.z -= this.direction.z * 400.0 * delta;
        if ( this.input.moveLeft || this.input.moveRight ) this.velocity.x -= this.direction.x * 400.0 * delta;
        this.moveRight( - this.velocity.x * delta );
        this.moveForward( - this.velocity.z * delta );
        //TODO: Remove this and add damping!
        this.velocity.x = 0
        this.velocity.z = 0;
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
        // _vector.setFromMatrixColumn( this.parent.matrix, 0 );
        // _vector.crossVectors( this.parent.up, _vector );
        // this.parent.position.addScaledVector( _vector, distance );
        const tempVector = new THREE.Vector3( 0, 0, -1 );
        tempVector.applyQuaternion(this.parent.rotation);
        tempVector.y = 0;
        tempVector.normalize;
        // FIXME: Eliminate the up down movement
        //tempVector.crossVectors( this.parent.up, tempVector );
        this.parent.position.addScaledVector( tempVector, distance );
    };

    moveRight( distance ) {
        // _vector.setFromMatrixColumn( this.parent.matrix, 0 );
        // this.parent.position.addScaledVector( _vector, distance );
        const tempVector = new THREE.Vector3( 1, 0, 0 );
        tempVector.applyQuaternion(this.parent.rotation);
        tempVector.y = 0;
        tempVector.normalize;
        this.parent.position.addScaledVector( tempVector, distance );
    };

    lock() {
        this.domElement.requestPointerLock();
    };

    unlock() {
        this.domElement.ownerDocument.exitPointerLock();
    };



}

export { Controller };
