import Adresse from './Adresse.js';
import Position from './Position.js';
import { 
    checkRequiredAttributes,
    validateAndAssignRequired,
    validateAndAssignOptional
} from './Validation.js';

class ParkingsPublicsException extends Error {
    constructor(message) {
        super(message);
        this.name = "ParkingsPublics Exception";
    }
}

class ParkingsPublics {
    idobj;
    nomComplet;
    commune;
    adresse;
    codePostal;
    location;
    libcategorie;
    libtype;
    telephone;
    siteWeb;
    presentation;
    capaciteVoiture;
    accesPmr;
    capacitePmr;
    capaciteVehiculeElectrique;
    capaciteMoto;
    capaciteVelo;
    serviceVelo;
    stationnementVelo;
    stationnementVeloSecurise;
    accesTransportsCommuns;
    moyenPaiement;
    conditionsDAcces;
    exploitant;
    infosComplementaires;

    static requiredAttributesTypes = new Map([
        ['idobj', 'string'],
        ['nomComplet', 'string'],
        ['commune', 'string'],
        ['adresse', 'object'],
        ['codePostal', 'string'],
        ['location', 'object']
    ]);

    static optionalAttributesTypes = new Map([
        ['libcategorie', 'string'],
        ['libtype', 'string'],
        ['telephone', 'string'],
        ['siteWeb', 'string'],
        ['presentation', 'string'],
        ['capaciteVoiture', 'number'],
        ['accesPmr', 'string'],
        ['capacitePmr', 'number'],
        ['capaciteVehiculeElectrique', 'number'],
        ['capaciteMoto', 'number'],
        ['capaciteVelo', 'number'],
        ['serviceVelo', 'string'],
        ['stationnementVelo', 'string'],
        ['stationnementVeloSecurise', 'string'],
        ['accesTransportsCommuns', 'string'],
        ['moyenPaiement', 'string'],
        ['conditionsDAcces', 'string'],
        ['exploitant', 'string'],
        ['infosComplementaires', 'string']
    ]);

    constructor(obj) {
       checkRequiredAttributes(obj, ParkingsPublics.requiredAttributesTypes, ParkingsPublicsException, this._camelToSnake.bind(this));
        validateAndAssignRequired(obj, ParkingsPublics.requiredAttributesTypes, this, ParkingsPublicsException, this._camelToSnake.bind(this));
        validateAndAssignOptional(obj, ParkingsPublics.optionalAttributesTypes, this, ParkingsPublicsException, this._camelToSnake.bind(this));

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

export default ParkingsPublics;
export { ParkingsPublicsException };
