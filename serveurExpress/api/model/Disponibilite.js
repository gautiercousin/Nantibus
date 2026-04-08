"use strict"

import { checkRequiredAttributes, validateAndAssignRequired } from './Validation.js';

class DisponibiliteException extends Error {
    constructor(message) {
        super(message);
        this.name = "Disponibilite Exception";
    }
}

class Disponibilite {
    grpIdentifiant;
    grpNom;
    grpStatut;
    grpDisponible;
    grpExploitation;
    grpComplet;
    grpHorodatage;

    static requiredAttributesTypes = new Map([
        ["grpIdentifiant", "string"],
        ["grpNom", "string"],
        ["grpStatut", "number"],
        ["grpDisponible", "number"],
        ["grpExploitation", "number"],
        ["grpComplet", "number"],
        ["grpHorodatage", "string"]
    ]);

    constructor(obj) {
        checkRequiredAttributes(obj, Disponibilite.requiredAttributesTypes, DisponibiliteException, this._camelToSnake.bind(this));
        validateAndAssignRequired(obj, Disponibilite.requiredAttributesTypes, this, DisponibiliteException, this._camelToSnake.bind(this));
    }

    _camelToSnake(str) {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    }

    toString() {
        return JSON.stringify(this)
    }
}

export default Disponibilite;
export { DisponibiliteException };
