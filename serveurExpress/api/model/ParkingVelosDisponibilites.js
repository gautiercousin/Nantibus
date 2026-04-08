"use strict"

import Adresse from './Adresse.js';
import Position from './Position.js';
import { 
    checkRequiredAttributes,
    validateAndAssignRequired
} from './Validation.js';

class ParkingVelosDisponibilitesException extends Error {
    constructor(message) {
        super(message);
        this.name = "ParkingVelosDisponibilites Exception";
    }
}

class ParkingVelosDisponibilites {
    name;
    number;
    status;
    accesstype;
    lockertype;
    hassurveillance;
    isfree;
    address;
    zipcode;
    city;
    isoffstreet;
    haselectricsupport;
    isabo;
    capacity;
    availablespots;
    geometrie;
    placesmap;

    static requiredAttributesTypes = new Map([
        ['name', 'string'],
        ['number', 'number'],
        ['status', 'string'],
        ['accesstype', 'string'],
        ['lockertype', 'string'],
        ['hassurveillance', 'string'],
        ['isfree', 'string'],
        ['address', 'object'],
        ['zipcode', 'string'],
        ['city', 'string'],
        ['isoffstreet', 'string'],
        ['haselectricsupport', 'string'],
        ['isabo', 'string'],
        ['capacity', 'number'],
        ['availablespots', 'number'],
        ['geometrie', 'object'],
        ['placesmap', 'string']
    ]);

    constructor(obj) {
        checkRequiredAttributes(obj, ParkingVelosDisponibilites.requiredAttributesTypes, ParkingVelosDisponibilitesException, this._camelToSnake.bind(this));
        validateAndAssignRequired(obj, ParkingVelosDisponibilites.requiredAttributesTypes, this, ParkingVelosDisponibilitesException, this._camelToSnake.bind(this));

        this.address = this.address instanceof Adresse ? this.address : new Adresse(this.address);
        this.geometrie = this.geometrie instanceof Position ? this.geometrie : new Position(this.geometrie);
    }

    _camelToSnake(str) {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }

    toString() {
        return JSON.stringify(this);
    }
}

export default ParkingVelosDisponibilites;
export { ParkingVelosDisponibilitesException };
