"use strict"

import Adresse from "./Adresse.js";
import Position from "./Position.js";
import { 
    checkRequiredAttributes,
    validateAndAssignRequired,
    validateAndAssignOptional
} from './Validation.js';

class StationsLibreServiceException extends Error {
    constructor(message) {
        super(message);
        this.name = "StationsLibreService Exception";
    }
}

class StationsLibreService {
    idobj;
    gid;
    nom;
    adresse;
    commune;
    capaciteNum;
    geoPoint2d;
    localisation;
    cp;
    insee;
    categorie;
    ssCategorie;
    source;
    dateInstal;
    descriptif;
    tel;
    lien;
    ouverture;
    capacite;
    conditions;
    exploitant;
    modele;
    ligneTc;

    static requiredAttributesTypes = new Map([
        ["idobj", "number"],
        ["gid", "number"],
        ["nom", "string"],
        ["adresse", "object"],
        ["commune", "string"],
        ["capaciteNum", "number"],
        ["geoPoint2d", "object"]
    ]);

    static optionalAttributesTypes = new Map([
        ["localisation", "string"],
        ["cp", "number"],
        ["insee", "number"],
        ["categorie", "string"],
        ["ssCategorie", "string"],
        ["source", "string"],
        ["dateInstal", "string"],
        ["descriptif", "string"],
        ["tel", "string"],
        ["lien", "string"],
        ["ouverture", "string"],
        ["capacite", "string"],
        ["conditions", "string"],
        ["exploitant", "string"],
        ["modele", "string"],
        ["ligneTc", "string"]
    ]);

    constructor(obj) {
        checkRequiredAttributes(obj, StationsLibreService.requiredAttributesTypes, StationsLibreServiceException, this._camelToSnake.bind(this));
        validateAndAssignRequired(obj, StationsLibreService.requiredAttributesTypes, this, StationsLibreServiceException, this._camelToSnake.bind(this));
        validateAndAssignOptional(obj, StationsLibreService.optionalAttributesTypes, this, StationsLibreServiceException, this._camelToSnake.bind(this));

        this.adresse = this.adresse instanceof Adresse ? this.adresse : new Adresse(this.adresse);
        this.geoPoint2d = this.geoPoint2d instanceof Position ? this.geoPoint2d : new Position(this.geoPoint2d);
    }

    _camelToSnake(str) {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }

    toString() {
        return JSON.stringify(this);
    }
}

export default StationsLibreService;
export { StationsLibreServiceException };
