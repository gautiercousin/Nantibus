"use strict"

/**
 * Vérifie si une valeur est du type attendu
 * @param {*} value - Valeur à vérifier
 * @param {string} expectedType - Type attendu ('string', 'number', 'object', etc.)
 * @returns {boolean}
 */
export function isValidType(value, expectedType) {
    return typeof value === expectedType;
}

/**
 * Vérifie si un objet a tous les champs obligatoires
 * @param {Object} obj - Objet à vérifier
 * @param {Array<string>} requiredFields - Liste des champs obligatoires
 * @returns {Array<string>} - Liste des champs manquants (vide si OK)
 */
export function getMissingFields(obj, requiredFields) {
    return requiredFields.filter(field => obj[field] === undefined);
}

/**
 * Vérifie le type d'un attribut unique (supporte types primitifs ET classes)
 * @param {any} value - Valeur à vérifier
 * @param {string|Function} expectedType - Type attendu ('string', 'number', 'array', 'object') ou classe (Position, GeoShape, etc.)
 * @param {string} fieldName - Nom du champ (pour le message d'erreur)
 * @param {Function} ExceptionClass - Classe d'exception à lever
 * @throws {ExceptionClass} Si le type n'est pas valide
 */
export function checkAttributeType(value, expectedType, fieldName, ExceptionClass) {
    // Cas 1 : expectedType est une fonction/classe (Position, GeoShape, Adresse, etc.)
    if (typeof expectedType === 'function') {
        if (!(value instanceof expectedType)) {
            throw new ExceptionClass(
                `Invalid type for ${fieldName}: expected instance of ${expectedType.name}, got ${typeof value}`
            );
        }
        return;
    }
    
    // Cas 2 : expectedType === "array"
    if (expectedType === "array") {
        if (!Array.isArray(value)) {
            throw new ExceptionClass(`Invalid type for ${fieldName}: expected array, got ${typeof value}`);
        }
        return;
    }
    
    // Cas 3 : expectedType === "object"
    if (expectedType === "object") {
        if (typeof value !== "object" || value === null || Array.isArray(value)) {
            throw new ExceptionClass(`Invalid type for ${fieldName}: expected object, got ${typeof value}`);
        }
        return;
    }
    
    // Cas 4 : Type primitif (string, number, boolean)
    if (!isValidType(value, expectedType)) {
        throw new ExceptionClass(`Invalid type for ${fieldName}: expected ${expectedType}, got ${typeof value}`);
    }
}

/**
 * Vérifie que tous les champs d'un objet ont les types attendus
 * @param {Object} obj - Objet à vérifier
 * @param {Map<string, string>|Object} fieldTypes - Map ou objet des champs et de leurs types attendus
 * @param {Function} ExceptionClass - Classe d'exception à lever en cas d'erreur
 * @throws {ExceptionClass} Si un champ a un type invalide
 */
export function validateObjectAttributes(obj, fieldTypes, ExceptionClass) {
    if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
        throw new ExceptionClass(`Expected an object, got ${typeof obj}`);
    }

    // Gérer Map ou objet classique
    const entries = fieldTypes instanceof Map ? fieldTypes.entries() : Object.entries(fieldTypes);

    for (const [fieldName, expectedType] of entries) {
        const value = obj[fieldName];
        checkAttributeType(value, expectedType, fieldName, ExceptionClass);
    }
}

/**
 * Convertit camelCase en snake_case
 * @param {string} str - String en camelCase
 * @returns {string} - String en snake_case
 */
export function camelToSnake(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Convertit snake_case en camelCase
 * @param {string} str - String en snake_case
 * @returns {string} - String en camelCase
 */
export function snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Vérifie la présence de tous les champs obligatoires dans un objet (format API).
 * @param {Object} obj - Objet à valider (format snake_case de l'API)
 * @param {Map} requiredAttributesMap - Map<camelCase, type|Class>
 * @param {Function} ExceptionClass - Classe d'exception à lever
 * @param {Function} camelToSnakeFn - Fonction de conversion camelCase → snake_case
 * @throws {ExceptionClass} Si un champ obligatoire est manquant
 */
export function checkRequiredAttributes(obj, requiredAttributesMap, ExceptionClass, camelToSnakeFn) {
    const missingFields = [];
    
    for (const [camelAttr] of requiredAttributesMap) {
        const snakeAttr = camelToSnakeFn(camelAttr);
        if (obj[snakeAttr] === undefined) {
            missingFields.push(snakeAttr);
        }
    }
    
    if (missingFields.length > 0) {
        throw new ExceptionClass(
            `Missing required field(s): ${missingFields.join(', ')}`
        );
    }
}

/**
 * Valide et assigne tous les champs obligatoires (avec support des classes).
 * @param {Object} obj - Objet source (format API snake_case)
 * @param {Map} requiredAttributesMap - Map<camelCase, type|Class>
 * @param {Object} targetInstance - Instance cible (this dans le constructeur)
 * @param {Function} ExceptionClass - Classe d'exception
 * @param {Function} camelToSnakeFn - Fonction de conversion camelCase → snake_case
 */
export function validateAndAssignRequired(obj, requiredAttributesMap, targetInstance, ExceptionClass, camelToSnakeFn) {
    for (const [camelAttr, expectedType] of requiredAttributesMap) {
        const snakeAttr = camelToSnakeFn(camelAttr);
        const value = obj[snakeAttr];
        
        // Si expectedType est une classe (Position, GeoShape, etc.)
        if (typeof expectedType === 'function') {
            try {
                targetInstance[camelAttr] = new expectedType(value);
            } catch (error) {
                throw new ExceptionClass(
                    `Invalid ${expectedType.name} for attribute '${snakeAttr}': ${error.message}`
                );
            }
        } else {
            // Type primitif (string, number, array, object)
            checkAttributeType(value, expectedType, snakeAttr, ExceptionClass);
            targetInstance[camelAttr] = value;
        }
    }
}

/**
 * Valide et assigne tous les champs optionnels (avec support des classes).
 * @param {Object} obj - Objet source (format API snake_case)
 * @param {Map} optionalAttributesMap - Map<camelCase, type|Class>
 * @param {Object} targetInstance - Instance cible (this dans le constructeur)
 * @param {Function} ExceptionClass - Classe d'exception
 * @param {Function} camelToSnakeFn - Fonction de conversion camelCase → snake_case
 */
export function validateAndAssignOptional(obj, optionalAttributesMap, targetInstance, ExceptionClass, camelToSnakeFn) {
    for (const [camelAttr, expectedType] of optionalAttributesMap) {
        const snakeAttr = camelToSnakeFn(camelAttr);
        const value = obj[snakeAttr];
        
        // Champ absent ou null → assigner null
        if (value === undefined || value === null) {
            targetInstance[camelAttr] = null;
            continue;
        }
        
        // Si expectedType est une classe (Position, GeoShape, etc.)
        if (typeof expectedType === 'function') {
            try {
                targetInstance[camelAttr] = new expectedType(value);
            } catch (error) {
                throw new ExceptionClass(
                    `Invalid ${expectedType.name} for optional attribute '${snakeAttr}': ${error.message}`
                );
            }
        } else {
            // Type primitif (string, number, array, object)
            checkAttributeType(value, expectedType, snakeAttr, ExceptionClass);
            targetInstance[camelAttr] = value;
        }
    }
}
