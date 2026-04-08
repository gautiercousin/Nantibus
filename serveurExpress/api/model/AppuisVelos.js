"use strict"

import GeoShape from "./GeoShape.js";
import Position from "./Position.js";
import { 
    checkRequiredAttributes,
    validateAndAssignRequired,
    validateAndAssignOptional
} from './Validation.js';

class AppuisVelosException extends Error {
    constructor(message) {
        super(message);
        this.name = "AppuisVelos Exception";
    }
}

class AppuisVelos {
    gid;
    cycNbPlace;
    cycType;
    commune;
    geoShape;
    geoPoint2d;
    cycModele;
    cycCouvert;
    codePole;
    pole;
    codeInsee;
    quartier;

    static requiredAttributesTypes = new Map([
        ["gid", "string"],
        ["cycNbPlace", "number"],
        ["cycType", "string"],
        ["commune", "string"],
        ["geoShape", "object"],
        ["geoPoint2d", "object"]
    ]);

    static optionalAttributesTypes = new Map([
        ["cycModele", "string"],
        ["cycCouvert", "string"],
        ["codePole", "number"],
        ["pole", "string"],
        ["codeInsee", "number"],
        ["quartier", "string"]
    ]);

    constructor(obj) {
    checkRequiredAttributes(obj, AppuisVelos.requiredAttributesTypes, AppuisVelosException, this._camelToSnake.bind(this));
        validateAndAssignRequired(obj, AppuisVelos.requiredAttributesTypes, this, AppuisVelosException, this._camelToSnake.bind(this));
        validateAndAssignOptional(obj, AppuisVelos.optionalAttributesTypes, this, AppuisVelosException, this._camelToSnake.bind(this));
        
         this.geoShape = this.geoShape instanceof GeoShape ? this.geoShape : new GeoShape(this.geoShape);
        this.geoPoint2d = this.geoPoint2d instanceof Position ? this.geoPoint2d : new Position(this.geoPoint2d);
 
    
    }

    _camelToSnake(str) {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }

    toString() {
        return JSON.stringify(this);
    }
}

export default AppuisVelos;
export { AppuisVelosException };
