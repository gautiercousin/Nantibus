/**
 * Ce fichier permet d'importer tous les modèles depuis un seul endroit.
 * 
 * Utilisation :
 * import { GonfleursLibreService, AppuisVelos, ParkingsPublics } from './model/index.js';
 */

// Composants de base réutilisables
export { default as Position } from './Position.js';
export { default as Adresse, AdresseException } from './Adresse.js';
export { default as GeoShape, GeoShapeException } from './GeoShape.js';
export { default as Disponibilite, DisponibiliteException } from './Disponibilite.js';
export { PositionException } from './Position.js';

// Modèles vélo
export { default as GonfleursLibreService, GonfleursLibreServiceException } from './GonfleursLibreService.js';
export { default as AppuisVelos, AppuisVelosException } from './AppuisVelos.js';
export { default as AbrisVelos, AbrisVelosException } from './AbrisVelos.js';
export { default as StationsLibreService, StationsLibreServiceException } from './StationsLibreService.js';

// Modèles parking
export { default as ParkingsPublics, ParkingsPublicsException } from './ParkingsPublics.js';
export { default as ParkingsPublicsDisponibilites, ParkingsPublicsDisponibilitesException } from './ParkingsPublicsDisponibilite.js';
export { default as ParkingVelosDisponibilites, ParkingVelosDisponibilitesException } from './ParkingVelosDisponibilites.js';
export { default as ParcsRelais, ParcsRelaisException } from './ParcsRelais.js';
export { default as ParcsRelaisDisponibilites, ParcsRelaisDisponibilitesException } from './ParcsRelaisDisponibilites.js';

// Modèles infrastructure
export { default as SchemaCyclable, SchemaCyclableException } from './SchemaCyclable.js';
export { default as InfoTraficTan, InfoTraficTanException } from './InfoTraficTan.js';

// Anciens modèles (pour compatibilité)
export { default as Station, StationException } from './Station.js';

// Fonctions utilitaires de validation
export { 
    checkRequiredAttributes, 
    checkAttributeType,
    validateAndAssignRequired,
    validateAndAssignOptional,
    camelToSnake,
    snakeToCamel
} from './Validation.js';
