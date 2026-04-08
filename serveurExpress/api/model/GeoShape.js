"use strict"

import { checkRequiredAttributes, validateAndAssignRequired, validateAndAssignOptional } from './Validation.js';
import Position from './Position.js';
class GeoShapeException extends Error {
    constructor(message) {
        super(message);
        this.name = "GeoShape Exception";
    }
}

class GeoShape {
    type;
    geometry;
    properties;

    static requiredAttributesTypes = new Map([
        ["type", "string"],
        ["geometry", "object"]
    ]);

    static optionalAttributesTypes = new Map([
        ["properties", "object"]
    ]);

    constructor(obj) {
        checkRequiredAttributes(obj, GeoShape.requiredAttributesTypes, GeoShapeException, this._camelToSnake.bind(this));
        validateAndAssignRequired(obj, GeoShape.requiredAttributesTypes, this, GeoShapeException, this._camelToSnake.bind(this));
        validateAndAssignOptional(obj, GeoShape.optionalAttributesTypes, this, GeoShapeException, this._camelToSnake.bind(this));

        if (typeof this.geometry.type !== "string") {
            throw new GeoShapeException("geometry.type must be a string");
        }

        if (!Array.isArray(this.geometry.coordinates)) {
            throw new GeoShapeException("geometry.coordinates must be an array");
        }

        this.properties = this.properties ?? {};
    }

    _camelToSnake(str) {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }

    toString() {
        return JSON.stringify(this);
    }
    toPosition() {
        if (this.geometry.type == "Polygon") {
            let meanLat = 0;
            let meanLng = 0;
            let count = 0;

            const calculateMean = (coordinates) => {
                if (typeof coordinates[0] === "number" && typeof coordinates[1] === "number") {
                    meanLng += coordinates[0];
                    meanLat += coordinates[1];
                    count++;
                } else if (Array.isArray(coordinates)) {
                    coordinates.forEach(calculateMean);
                }
            };

            calculateMean(this.geometry.coordinates);

            if (count === 0) {
                throw new GeoShapeException("No valid coordinates found to calculate mean position");
            }

            return new Position({ lat: meanLat / count, lng: meanLng / count });
        } else if (this.geometry.type === "Point") {
    
            const [lng, lat] = this.geometry.coordinates;
            return new Position({ lat, lng });
        } else {
            throw new GeoShapeException(`Unsupported geometry type: ${this.geometry.type}`);
        }

    }
}

export default GeoShape;
export { GeoShapeException };
