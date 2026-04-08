import Station from "../model/Station.js";
import stationFetchDAO from "./stationFetchDAO.mjs";
/*
* Récupération et traitement des données de l'API vu sur l'automate 2
 */

const recuperationTraitementDAO = {

    // findAll pour récupérer toutes les stations disponibles
    findAll: async () => {

        // Etat initial : Idle
        try {

            // Le DAO commun gère la récupération, le proxy et la pagination
            const data = await stationFetchDAO.findAllByResource("parkingVelosDisponibilites");

            // ETAT : VerificationDonnees
            if (!Array.isArray(data)) {
                throw new Error("Données incohérentes");
            }

            // ÉTAT : Traitement
            // Conversion des types + objets métier
            const stations = data.map(s => {

                const stationObj = {
                    id: Number(s.number),
                    name: s.name,
                    status: s.status,

                    address: {
                        address: s.address,
                        zipcode: Number(s.zipcode),
                        city: s.city
                    },

                    capacity: Number(s.capacity),
                    available_spots: Number(s.availablespots ?? 0),

                    position: {
                        lat: s.geometrie.lat,
                        lon: s.geometrie.lon
                    }
                };

                try {
                    return new Station(stationObj);

                } catch (e) {
                    console.error("Station invalide :", stationObj);
                    console.error("Erreur :", e);
                    throw new Error("Erreur dans les données reçues");
                }
            });

            // ETAT : DonneesPretes
            // !CS.reponse
            return stations;

        } catch (err) {

            // ETAT : ErreurReseau / ErreurFormat / ErreurDonnees
            // !CS.err
            console.error("Erreur dans recuperationTraitementDAO :", err.message);
            throw err;

        }

        // Retour à Idle
    }
};

export default recuperationTraitementDAO;
