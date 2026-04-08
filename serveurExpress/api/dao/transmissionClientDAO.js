"use strict";
import { getInternalTransmissionUrl } from './urlFactory.js';

class TransmissionException extends Error {
    constructor(message) {
        super(message);
        this.name = "TransmissionException";
    }
}

const url = getInternalTransmissionUrl();


const transmissionDAO = {

    envoyerDonnees: async (donnees) => {

        // ETAT : AttenteDonnees
        if (!donnees) {
            throw new TransmissionException("donneesInvalides");
        }

        try {
            // ETAT : VerificationDonnees
            //donneesRecues
            if (!transmissionDAO._verifierDonnees(donnees)) {
                throw new TransmissionException("donneesInvalides");
            }

            // ETAT : PreparationPayload
            // verifier
            const payload = transmissionDAO._preparerPayload(donnees);

            // ETAT : Serialisation
            // preparer
            let serialise;
            try {
                serialise = JSON.stringify(payload);
            } catch (e) {
                throw new TransmissionException("erreurSerialisation");
            }

            // ETAT : Envoi
            //serializer
            let reponse;
            try {
                reponse = await transmissionDAO._envoyer(serialise);
            } catch (e) {
                throw new TransmissionException("erreurTransmission");
            }

            // ETAT : AttenteConfirmation
            // envoyer
            const confirmation = await transmissionDAO._attendreConfirmation(reponse);

            if (!confirmation) {
                throw new TransmissionException("timeout");
            }

            // ETAT : ConfirmationOK
            // confirmation
            return { ok: true, message: "Transmission confirmée" };

        } catch (err) {

            if (err.message === "donneesInvalides") {
                console.error("ErreurDonnees :", err.message);
            }
            else if (err.message === "erreurSerialisation") {
                console.error("ErreurSerialisation :", err.message);
            }
            else if (err.message === "timeout") {
                console.error("ErreurTimeout :", err.message);
            }
            else if (err.message.startsWith("HTTP")) {
                console.error("ErreurHTTP :", err.message);
            }
            else {
                console.error("ErreurTransmission :", err.message);
            }

            throw err;
        }


    },

    // Méthodes privées utilisées dans le processus

    _verifierDonnees(d) {
        return typeof d === "object" && Object.keys(d).length > 0;
    },

    _preparerPayload(d) {
        return {
            timestamp: Date.now(),
            contenu: d
        };
    },

    async _envoyer(serialise) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: serialise,
                signal: controller.signal
            });

            clearTimeout(timeout);

            if (!response.ok) {
                throw new TransmissionException("HTTP" + response.status);
            }

            return response;

        } catch (e) {
            if (e.name === "AbortError") {
                throw new TransmissionException("timeout");
            }
            throw new TransmissionException("erreurTransmission");
        }
    },

    async _attendreConfirmation(response) {
        try {
            const json = await response.json();
            return json.confirmation === true;
        } catch (e) {
            throw new TransmissionException("erreurSerialisation");
        }
    }
};

export default transmissionDAO;
