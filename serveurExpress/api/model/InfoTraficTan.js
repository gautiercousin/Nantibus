import { 
    checkRequiredAttributes,
    validateAndAssignRequired,
    validateAndAssignOptional
} from './Validation.js';

class InfoTraficTanException extends Error {
    constructor(message) {
        super(message);
        this.name = "InfoTraficTan Exception";
    }
}

class InfoTraficTan {
    code;
    langue;
    intitule;
    resume;
    dateDebut;
    dateFin;
    heureDebut;
    heureFin;
    perturbationTerminee;
    troncons;
    texteVocal;
    listesArrets;

    static requiredAttributesTypes = new Map([
        ['code', 'string'],
        ['langue', 'number'],
        ['intitule', 'string'],
        ['resume', 'string'],
        ['dateDebut', 'string'],
        ['dateFin', 'string'],
        ['heureDebut', 'string'],
        ['heureFin', 'string'],
        ['perturbationTerminee', 'number'],
        ['troncons', 'string']
    ]);

    static optionalAttributesTypes = new Map([
        ['texteVocal', 'string'],
        ['listesArrets', 'string']
    ]);

    constructor(obj) {
        checkRequiredAttributes(obj, InfoTraficTan.requiredAttributesTypes, InfoTraficTanException, this._camelToSnake.bind(this));
        validateAndAssignRequired(obj, InfoTraficTan.requiredAttributesTypes, this, InfoTraficTanException, this._camelToSnake.bind(this));
        validateAndAssignOptional(obj, InfoTraficTan.optionalAttributesTypes, this, InfoTraficTanException, this._camelToSnake.bind(this));
    }

    _camelToSnake(str) {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }

    toString() {
        return JSON.stringify(this);
    }
}

export default InfoTraficTan;
export { InfoTraficTanException };
