
"use strict"

/** AdresseException est une exception levée lors de la création d'une Adresse. */
class AdresseException extends Error {

    /**
     * Constructeur de AdresseException.
     * @param message Message de l'exception
     */
    constructor(message) {
        super(message);
        this.name = "Adresse Exception"
    }
}

/** Map qui répertorie les attributs et leurs types respectifs. */
const attributesTypes =new Map([
    ["address","string"],
    ["city","string"],
    ["zipcode","number"]
])

/** Adresse est une classe qui repertorie une adresse et sa ville. */
class Adresse {
    address
    city
    zipcode

    /**
     * Constructeur d'Adresse.
     * Elle vérifie les types et la présence des données.
     *
     * @param obj Objet contenant les attributs de l'adresse (address, city, zipcode)
     */
    constructor(obj){
        if (obj.address === undefined && obj.city  === undefined && obj.zipcode === undefined) {
            throw new AdresseException("Invalid object (missing address, city or zipcode)")
        }
        const objAttributesTypes =new Map(Object.entries(obj).map(([key,value])=>
            [key, typeof value]
        ))

        // Vérification des types de l'objet donné
        if (!(attributesTypes.size === objAttributesTypes.size &&
            Array.from(attributesTypes.keys())
                .every((key) => attributesTypes.get(key) === objAttributesTypes.get(key))
        )) {
            throw new AdresseException("Invalid type (address and city must be strings, zipcode must be a number)")
        }

        this.address = obj.address
        this.zipcode = obj.zipcode
        this.city = obj.city
    }

    /**
     * toString de Adresse.
     * @return string Représentation de l'adresse au format JSON
     */
    toString() {
        return JSON.stringify({
            address: this._address,
            zipcode: this._zipcode,
            city: this._city
        });
    }

    /**
     * get address.
     * @return Adresse de la station
     */
    get address() {
        return this._address;
    }

    /**
     * get zipcode.
     * @return Code postal de la ville de la station
     */
    get zipcode() {
        return this._zipcode;
    }

    /**
     * get city.
     * @return Ville de la station
     */
    get city() {
        return this._city;
    }
}

export default Adresse