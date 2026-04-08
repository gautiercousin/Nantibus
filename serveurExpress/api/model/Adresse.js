
"use strict"

import { checkRequiredAttributes, validateAndAssignRequired } from './Validation.js';

class AdresseException extends Error {
    constructor(message) {
        super(message);
        this.name = "Adresse Exception";
    }
}

class Adresse {
    address;
    city;
    zipcode;

    static requiredAttributesTypes = new Map([
        ["address", "string"],
        ["city", "string"],
        ["zipcode", "number"]
    ]);

    constructor(obj) {
        checkRequiredAttributes(obj, Adresse.requiredAttributesTypes, AdresseException, this._camelToSnake.bind(this));
        validateAndAssignRequired(obj, Adresse.requiredAttributesTypes, this, AdresseException, this._camelToSnake.bind(this));
    }

    _camelToSnake(str) {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }

    toString() {
        return JSON.stringify(this);
    }
}

export default Adresse;
export { AdresseException };
