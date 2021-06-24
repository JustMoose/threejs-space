import { Entity, Component } from './entity.js';
import {
    Euler,
    Vector3
} from './three/build/three.module.js';

const _euler = new Euler( 0, 0, 0, 'YXZ' );
const _vector = new Vector3();

const _changeEvent = { type: 'change' };
const _lockEvent = { type: 'lock' };
const _unlockEvent = { type: 'unlock' };

const _PI_2 = Math.PI / 2;

class EntityManager {

    constructor( object, domElement ) {
        this.idCounter = 1;
        this.entities = [];
        this.entityDict = {};
    }

    Add(entity, name) {
        if (!name) { //TODO: Might want to update all entity names with a unique id
            name = 'entity_' + this.idCounter;
            this.idCounter += 1;
            entity.SetName(name);
        }
        this.entities.push(entity);
        this.entityDict[name] = entity;
        entity.SetParent(this);
    }

    Get(name) {
        return this.entityDict[name];
    }

    Update( delta ) {
        for ( let e of this.entities ) {
            e.Update(delta);
        }
    }

}

export { EntityManager };
