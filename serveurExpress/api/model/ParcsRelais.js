import Adresse from './Adresse.js';
import Position from './Position.js';
import { 
    checkRequiredAttributes,
    validateAndAssignRequired,
    validateAndAssignOptional
} from './Validation.js';
import {Adresse} from "./index.js";

class ParcsRelaisException extends Error {
    constructor(message) {
        super(message);
        this.name = "ParcsRelais Exception";
    }
}

class ParcsRelais {
    idobj;
    nomComplet;
    commune;
    adresse;
    codePostal;
    location;
    libtype;
    telephone;
    siteWeb;
    twitter;
    longWgs84;
    latWgs84;
    presentation;
    capaciteVoiture;
    capacitePmr;
    capaciteVehiculeElectrique;
    capaciteMoto;
    capaciteVelo;
    serviceVelo;
    stationnementVelo;
    stationnementVeloSecurise;
    autresServiceMobProx;
    services;
    moyenPaiement;
    conditionsDAcces;
    exploitant;
    quartier;
    accesTransportCommun;
    nomUsuel;

    static requiredAttributesTypes = new Map([
        ['idobj', 'string'],
        ['nomComplet', 'string'],
        ['commune', 'string'],
        ['adresse', 'object'],
        ['codePostal', 'string'],
        ['location', 'object']
    ]);

    static optionalAttributesTypes = new Map([
        ['libtype', 'string'],
        ['telephone', 'string'],
        ['siteWeb', 'string'],
        ['twitter', 'string'],
        ['longWgs84', 'number'],
        ['latWgs84', 'number'],
        ['presentation', 'string'],
        ['capaciteVoiture', 'number'],
        ['capacitePmr', 'number'],
        ['capaciteVehiculeElectrique', 'number'],
        ['capaciteMoto', 'number'],
        ['capaciteVelo', 'number'],
        ['serviceVelo', 'string'],
        ['stationnementVelo', 'string'],
        ['stationnementVeloSecurise', 'string'],
        ['autresServiceMobProx', 'string'],
        ['services', 'string'],
        ['moyenPaiement', 'string'],
        ['conditionsDAcces', 'string'],
        ['exploitant', 'string'],
        ['quartier', 'string'],
        ['accesTransportCommun', 'string'],
        ['nomUsuel', 'string']
    ]);

    constructor(obj) {
        checkRequiredAttributes(obj, ParcsRelais.requiredAttributesTypes, ParcsRelaisException, this._camelToSnake.bind(this));
        validateAndAssignRequired(obj, ParcsRelais.requiredAttributesTypes, this, ParcsRelaisException, this._camelToSnake.bind(this));
        validateAndAssignOptional(obj, ParcsRelais.optionalAttributesTypes, this, ParcsRelaisException, this._camelToSnake.bind(this));
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

export default ParcsRelais;
export { ParcsRelaisException };
