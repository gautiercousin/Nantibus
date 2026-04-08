import { 
    checkRequiredAttributes,
    validateAndAssignRequired
} from './Validation.js';

class ParkingPublicsDisponibilitesException extends Error {
    constructor(message) {
        super(message);
        this.name = "ParkingPublicsDisponibilites Exception";
    }
}

class ParkingPublicsDisponibilites {
    grpIdentifiant;
    grpNom;
    grpStatut;
    grpDisponible;
    grpExploitation;
    grpComplet;
    grpHorodatage;

    static requiredAttributesTypes = new Map([
        ['grpIdentifiant', 'number'],
        ['grpNom', 'string'],
        ['grpStatut', 'number'],
        ['grpDisponible', 'number'],
        ['grpExploitation', 'number'],
        ['grpComplet', 'number'],
        ['grpHorodatage', 'string']
    ]);

    constructor(obj) {
        checkRequiredAttributes(obj, ParkingPublicsDisponibilites.requiredAttributesTypes, ParkingPublicsDisponibilitesException, this._camelToSnake.bind(this));
        validateAndAssignRequired(obj, ParkingPublicsDisponibilites.requiredAttributesTypes, this, ParkingPublicsDisponibilitesException, this._camelToSnake.bind(this));
    }

    _camelToSnake(str) {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }

    toString() {
        return JSON.stringify(this);
    }
}

export default ParkingPublicsDisponibilites;
export { ParkingPublicsDisponibilitesException };
