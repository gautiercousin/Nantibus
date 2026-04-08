"use strict"

import Adresse from "./Adresse.js";
import Position from "./Position.js";

/** StationException est une exception levée lors de la création d'une Station. */
class StationException extends Error {

    /**
     * Constructeur de StationException.
     * @param message Message de l'exception
     */
    constructor(message) {
        super(message);
        this.name = "Station Exception"
    }
}

/** Map qui répertorie les attributs et leurs types respectifs. */
const attributesTypes =new Map([
    ["id","number"],
    ["name","string"],
    ["status","string"],
    ["address","object"],
    ["capacity","number"],
    ["availableSpots","number"],
    ["position","object"],
])

/** Station est une classe qui représente une station. */
class Station {
    id
    name
    status
    address
    capacity
    availableSpots
    position

    /**
     * Constructeur de Station.
     * Elle vérifie les types et la présence des données.
     *
     * @param obj Objet contenant les attributs de la station (id, name, status, address, capacity, availableSpots, position)
     */
    constructor(obj) {
        if (obj.id === undefined && obj.name === undefined && obj.status === undefined && obj.capacity === undefined && obj.availableSpots) {
            throw new StationException("Invalid type (id, name, status, capacity and availableSpots undefined)")
        }

        const objAttributesTypes =new Map(Object.entries(obj).map(([key,value])=>
            [key, typeof value]
        ))

        // Vérification des types de l'objet donné
        if (!(attributesTypes.size === objAttributesTypes.size &&
            Array.from(attributesTypes.keys())
                .every((key) => attributesTypes.get(key) === objAttributesTypes.get(key))
        )) {
            throw new StationException("Invalid type (one or some types are invalid)")
        }

        this.id = obj.id
        this.name = obj.name
        this.status = obj.status
        this.address = new Adresse(obj.address)
        this.capacity = obj.capacity
        this.availableSpots = obj.availableSpots
        this.position = new Position(obj.position)
    }

    /**
     * toString de Station.
     * @return string Représentation de la station au format JSON
     */
    toString() {
        return JSON.stringify({
            id : this.id,
            name: this.name,
            status: this.status,
            address: this.address,
            capacity: this.capacity,
            availableSpots: this.availableSpots,
            position: this.position
        })
    }
}

export default Station