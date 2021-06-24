import * as THREE from './three/build/three.module.js';

// TODO: Might need to add a Message/Handler system with Broadcast function
// FIXME: 
// NOTE: 
class Entity {
    constructor() {
        this.name = null;
        this.components = {};

        this.position = new THREE.Vector3();
        this.rotation = new THREE.Quaternion();

        this.parent = null;
    }

    SetParent(o) {
        this.parent = o;
    }

    AddComponent(component) {
        component.SetParent(this);
        this.components[component.constructor.name] = component;
        component.Init();
    }

    Update(delta) {
        for (let c in this.components) {
          this.components[c].Update(delta);
        }
    }

    GetComponent(n) {
        return this.components[n];
    }

    SetName(n) {
        this.name = n;
    }

};

class Component {
    constructor() {
        this.parent = null;
    }

    Init() {}

    SetParent(p) {
        this.parent = p;
    }

    GetComponent(n) {
        return this.parent.GetComponent(n);
    }

    Update(delta) {}
}

export { Entity };
export { Component };