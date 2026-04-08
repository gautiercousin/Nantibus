"use strict"

import Adresse from "./Adresse.js";
import GeoShape from "./GeoShape.js";
import Position from "./Position.js";
import { 
    checkRequiredAttributes,
    validateAndAssignRequired,
    validateAndAssignOptional
} from './Validation.js';

class AbrisVelosException extends Error {
    constructor(message) {
        super(message);
        this.name = "AbrisVelos Exception";
    }
}

class AbrisVelos {
    identifiant;
    nom;
    adresse;
    codePostal;
    commune;
    geoShape;
    geoPoint2d;
    origine;
    categorie;
    sousCategorie;
    source;
    dateInstallation;
    descriptif;
    localisation;
    codeInsee;
    quartier;
    pole;
    telephone;
    lien;
    ouverture;
    capacite;
    conditions;
    exploitant;
    modele;
    ligneTc;
    globalid;
    createur;
    dateCreation;
    dateModification;
    gid;

    static requiredAttributesTypes = new Map([
        ["identifiant", "number"],
        ["nom", "string"],
        ["adresse", "object"],
        ["codePostal", "string"],
        ["commune", "string"],
        ["geoShape", "object"],
        ["geoPoint2d", "object"]
    ]);

    static optionalAttributesTypes = new Map([
        ["origine", "string"],
        ["categorie", "string"],
        ["sousCategorie", "string"],
        ["source", "string"],
        ["dateInstallation", "string"],
        ["descriptif", "string"],
        ["localisation", "string"],
        ["codeInsee", "string"],
        ["quartier", "string"],
        ["pole", "string"],
        ["telephone", "string"],
        ["lien", "string"],
        ["ouverture", "string"],
        ["capacite", "string"],
        ["conditions", "string"],
        ["exploitant", "string"],
        ["modele", "string"],
        ["ligneTc", "string"],
        ["globalid", "string"],
        ["createur", "string"],
        ["dateCreation", "string"],
        ["dateModification", "string"],
        ["gid", "number"]
    ]);

    constructor(obj) {
        checkRequiredAttributes(obj, AbrisVelos.requiredAttributesTypes, AbrisVelosException, this._camelToSnake.bind(this));
        validateAndAssignRequired(obj, AbrisVelos.requiredAttributesTypes, this, AbrisVelosException, this._camelToSnake.bind(this));
        validateAndAssignOptional(obj, AbrisVelos.optionalAttributesTypes, this, AbrisVelosException, this._camelToSnake.bind(this));

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

export default AbrisVelos;
export { AbrisVelosException };
