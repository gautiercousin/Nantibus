"use strict"

import { checkRequiredAttributes, validateAndAssignRequired } from './Validation.js';

class PositionException extends Error {
    constructor(message) {
        super(message);
        this.name = "Position Exception";
    }
}

class Position {
    lat;
    lon;

    static requiredAttributesTypes = new Map([
        ["lat", "number"],
        ["lon", "number"]
    ]);

    constructor(obj) {
        checkRequiredAttributes(obj, Position.requiredAttributesTypes, PositionException, this._camelToSnake.bind(this));
        validateAndAssignRequired(obj, Position.requiredAttributesTypes, this, PositionException, this._camelToSnake.bind(this));

        if (this.lat > 180 || this.lat < -180 || this.lon < -90 || this.lon > 90) {
            throw new PositionException("Invalid value (latitude must be between -180 and 180, longitude must be between -90 and 90)");
        }
    }

    _camelToSnake(str) {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }

    toString() {
        return JSON.stringify(this);
    }

    
}

export default Position;
export { PositionException };
