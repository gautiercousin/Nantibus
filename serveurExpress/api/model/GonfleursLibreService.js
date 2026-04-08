"use strict"

import Adresse from "./Adresse.js";
import GeoShape from "./GeoShape.js";
import { 
    checkRequiredAttributes,
    validateAndAssignRequired,
    validateAndAssignOptional
} from './Validation.js';

class GonfleursLibreServiceException extends Error {
    constructor(message) {
        super(message);
        this.name = "GonfleursLibreService Exception";
    }
}

class GonfleursLibreService {
    gid;
    nom;
    commune;
    geoShape;
    categorie;
    ssCateg;
    source;
    dateInstal;
    descriptif;
    localisation;
    adresse;
    cp;
    insee;
    tel;
    lien;
    ouverture;
    capaciteNum;
    conditions;
    exploitant;
    modele;
    ligneTc;

    static requiredAttributesTypes = new Map([
        ["gid", "number"],
        ["geoShape", "object"]
    ]);

    static optionalAttributesTypes = new Map([
        ["nom", "string"],
        ["commune", "string"],
        ["categorie", "string"],
        ["ssCateg", "string"],
        ["source", "string"],
        ["dateInstal", "string"],
        ["descriptif", "string"],
        ["localisation", "string"],
        ["adresse", "string"],
        ["cp", "number"],
        ["insee", "number"],
        ["tel", "string"],
        ["lien", "string"],
        ["ouverture", "string"],
        ["capaciteNum", "number"],
        ["conditions", "string"],
        ["exploitant", "string"],
        ["modele", "string"],
        ["ligneTc", "number"]
    ]);

    constructor(obj) {
        checkRequiredAttributes(obj, GonfleursLibreService.requiredAttributesTypes, GonfleursLibreServiceException, this._camelToSnake.bind(this));
        validateAndAssignRequired(obj, GonfleursLibreService.requiredAttributesTypes, this, GonfleursLibreServiceException, this._camelToSnake.bind(this));
        validateAndAssignOptional(obj, GonfleursLibreService.optionalAttributesTypes, this, GonfleursLibreServiceException, this._camelToSnake.bind(this));

        this.geoShape = this.geoShape instanceof GeoShape ? this.geoShape : new GeoShape(this.geoShape);
        try {
            this.adresse = this.adresse === null || this.adresse instanceof Adresse ? this.adresse : new Adresse({address : this.adresse, city: this.commune,zipcode : this.cp});
        } catch (e) {
            
        }


    }

    _camelToSnake(str) {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }

    toString() {
        return JSON.stringify(this);
    }
}

export default GonfleursLibreService;
export { GonfleursLibreServiceException };
