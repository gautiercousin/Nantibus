"use strict"

import Adresse from "./Adresse.js";
import Position from "./Position.js";
import { checkRequiredAttributes, validateAndAssignRequired } from "./Validation.js";

class StationException extends Error {
    constructor(message) {
        super(message);
        this.name = "Station Exception";
    }
}

class Station {
    id;
    name;
    status;
    address;
    capacity;
    available_spots;
    position;

    static requiredAttributesTypes = new Map([
        ["id", "number"],
        ["name", "string"],
        ["status", "string"],
        ["address", "object"],
        ["capacity", "number"],
        ["available_spots", "number"],
        ["position", "object"]
    ]);

    constructor(obj) {
        checkRequiredAttributes(obj, Station.requiredAttributesTypes, StationException, this._camelToSnake.bind(this));
        validateAndAssignRequired(obj, Station.requiredAttributesTypes, this, StationException, this._camelToSnake.bind(this));

        this.address = this.address instanceof Adresse ? this.address : new Adresse(this.address);
        this.position = this.position instanceof Position ? this.position : new Position(this.position);
    }

    _camelToSnake(str) {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }

    toString() {
        return JSON.stringify(this)
    }
}

export default Station;
export { StationException };
