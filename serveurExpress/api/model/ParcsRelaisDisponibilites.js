import Position from './Position.js';
import Disponibilite from './Disponibilite.js';
import { 
    checkRequiredAttributes,
    validateAndAssignRequired
} from './Validation.js';
import Adresse from './Adresse.js';

class ParcsRelaisDisponibilitesException extends Error {
    constructor(message) {
        super(message);
        this.name = "ParcsRelaisDisponibilites Exception";
    }
}

class ParcsRelaisDisponibilites {
    disponibilite;
    idobj;
    nomComplet;
    adresse;
    location;
    placesDisponibles;

    static requiredAttributesTypes = new Map([
        ['disponibilite', 'object'],
        ['idobj', 'string'],
        ['nomComplet', 'string'],
        ['adresse', 'object'],
        ['location', 'object'],
        ['placesDisponibles', 'string']
    ]);

    constructor(obj) {
       checkRequiredAttributes(obj, ParcsRelaisDisponibilites.requiredAttributesTypes, ParcsRelaisDisponibilitesException, this._camelToSnake.bind(this));
        validateAndAssignRequired(obj, ParcsRelaisDisponibilites.requiredAttributesTypes, this, ParcsRelaisDisponibilitesException, this._camelToSnake.bind(this));

        this.disponibilite = this.disponibilite instanceof Disponibilite
            ? this.disponibilite
            : new Disponibilite(this.disponibilite);
        this.adresse = this.adresse instanceof Adresse ? this.adresse : new Adresse(this.adresse);
        this.location = this.location instanceof Position ? this.location : new Position(this.location);
    }

    _camelToSnake(str) {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }

    toString() {
        return JSON.stringify(this);
    }
}

export default ParcsRelaisDisponibilites;
export { ParcsRelaisDisponibilitesException };
