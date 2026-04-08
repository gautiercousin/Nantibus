"use strict"

/** PositionException est une exception levée lors de la création d'une Position. */
class PositionException extends Error {

    /**
     * Constructeur de PositionException.
     * @param message Message de l'exception
     */
    constructor(message) {
        super(message);
        this.name = "Position Exception"
    }
}

/** Map qui répertorie les attributs et leurs types respectifs. */
const attributesTypes =new Map([
    ["lat","number"],
    ["lon","number"]
])

/** Position est une classe qui représente un point géographique. */
class Position {
    lat
    lon

    /**
     * Constructeur de Position.
     * Elle vérifie les types et la présence des données.
     * Elle accepte uniquement les :
     *                  latitudes : latitude > 180 et latitude < -180
     *                  longitude : longitude < -90 || longitude > 90
     * Sinon elle renvoie une PositionException.
     *
     * @param obj Objet contenant les attributs de la position (lat, lon)
     */
    constructor(obj) {
        if (obj.lat === undefined || obj.lon === undefined){
            throw new PositionException("Invalid type (latitude or longitude undefined)")
        }
        const objAttributesTypes =new Map(Object.entries(obj).map(([key,value])=>
            [key, typeof value]
        ))

        // Vérification des types de l'objet donné
        if (!(attributesTypes.size === objAttributesTypes.size &&
            Array.from(attributesTypes.keys())
                .every((key) => attributesTypes.get(key) === objAttributesTypes.get(key))
        )) {
            throw new PositionException("Invalid type (latitude and longitude must be numbers)")
        }

        // Vérification de la cohérence des données
        if (obj.lat > 180 || obj.lat < -180 || obj.lon < -90 || obj.lon >90){
            throw new PositionException("Invalid value (latitude must be between -180 and 180, longitude must be between -90 and 90)")
        }

        this.lat = obj.lat
        this.lon = obj.lon
    }

    /**
     * toString de Position.
     * @return Représentation de la position au format JSON
     */
    toString(){
        return JSON.stringify({lat: this.lat, lon: this.lon})
    }

    /**
     * get latitude.
     * @return Latitude de la station
     */
    get latitude () {
        return this.lat
    }

    /**
     * get longitude.
     * @return Longitude de la station
     */
    get longitude () {
        return this.lon
    }
}

export default Position