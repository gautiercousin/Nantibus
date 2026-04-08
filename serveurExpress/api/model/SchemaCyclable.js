import GeoShape from './GeoShape.js';
import { 
    checkRequiredAttributes,
    validateAndAssignRequired,
    validateAndAssignOptional
} from './Validation.js';

class SchemaCyclableException extends Error {
    constructor(message) {
        super(message);
        this.name = "SchemaCyclable Exception";
    }
}

class SchemaCyclable {
    id;
    typologie;
    geoShape;
    shapeLength;

    static requiredAttributesTypes = new Map([
        ['id', 'number'],
        ['typologie', 'string'],
        ['geoShape', 'object']
    ]);

    static optionalAttributesTypes = new Map([
        ['shapeLength', 'number']
    ]);

    constructor(obj) {
        checkRequiredAttributes(obj, SchemaCyclable.requiredAttributesTypes, SchemaCyclableException, this._camelToSnake.bind(this));
        validateAndAssignRequired(obj, SchemaCyclable.requiredAttributesTypes, this, SchemaCyclableException, this._camelToSnake.bind(this));
        validateAndAssignOptional(obj, SchemaCyclable.optionalAttributesTypes, this, SchemaCyclableException, this._camelToSnake.bind(this));

        this.geoShape = this.geoShape instanceof GeoShape ? this.geoShape : new GeoShape(this.geoShape);
    }

    _camelToSnake(str) {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }

    toString() {
        return JSON.stringify(this);
    }
}

export default SchemaCyclable;
export { SchemaCyclableException };
