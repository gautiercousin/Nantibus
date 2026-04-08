import stationFetchDAO from "./stationFetchDAO.mjs";
import Gonfleur from "../model/GonfleursLibreService.js";

/*
* Récupération et traitement des données de l'API vu sur l'automate 2
 */

const recuperationTraitementGonfleurDAO = {

    // findAll pour récupérer tous les gonfleurs disponibles
    findAll: async () => {
        // Etat initial : Idle
        try {

            // Le DAO commun gère la récupération, le proxy et la pagination
            const data = await stationFetchDAO.findAllByResource("gonfleursLibreService");

            // ETAT : VerificationDonnees
            if (!Array.isArray(data)) {
                throw new Error("Données incohérentes");
            }

            // ÉTAT : Traitement
            // Conversion des types + objets métier
            const gonfleurs = data.map(g => {
                const gonfleurObj = {
                    gid: Number(g.gid),
                    categorie: g.categorie,
                    ss_categ: g.ss_categ,
                    source: g.source,
                    date_instal: g.date_instal,
                    nom: g.nom,
                    descriptif: g.descriptif,
                    localisation: g.localisation,
                    adresse: g.adresse,
                    cp: Number(g.cp),
                    insee: Number(g.insee),
                    commune: g.commune,
                    tel: g.tel,
                    lien: g.lien,
                    ouverture: g.ouverture,
                    capacite_num: Number(g.capacite_num),
                    conditions: g.conditions,
                    exploitant: g.exploitant,
                    modele: g.modele,
                    ligne_tc: Number(g.ligne_tc),
                    geo_shape: {
                        type: g.geo_shape.type,
                        geometry: {
                            coordinates: g.geo_shape.geometry.coordinates.map(Number),
                            type: g.geo_shape.geometry.type
                        },
                        properties: g.geo_shape.properties
                    }
                }

                try {
                    return new Gonfleur(gonfleurObj);

                } catch (e) {
                    console.error("Gonfleur invalide :", gonfleurObj);
                    console.error("Erreur :", e);
                    throw new Error("Erreur dans les données reçues");
                }
            });


            // ETAT : DonneesPretes
            // !CS.reponse
            return gonfleurs;

        } catch (err) {

            // ETAT : ErreurReseau / ErreurFormat / ErreurDonnees
            // !CS.err
            console.error("Erreur dans recuperationTraitementDAO :", err.message);
            throw err;

        }

        // Retour à Idle
    }
};

export default recuperationTraitementGonfleurDAO;
