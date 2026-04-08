import transmissionClientDAO from './transmissionClientDAO.js';
import recuperationTraitementDAO from './recuperationTraitementDAO.js';

//Récupération et utilisation des données de l'API vu sur l'automate 4

const recuperationUtilisationDAO = {

    envoyerRequete: async () => {

        // ETAT : Idle 

        try {
            let donnees;
            let data;
            let confirmation;

            // ETAT : EnvoieDemande
            try {
                //ETAT : ATTEnteReponss
                donnees = await recuperationTraitementDAO.findAll();
            } catch (e) {

                // ETAT : ErreurReseau
                throw new Error("Erreur Reseau");
            }

            // ETAT : receptionBrute
            try {
                // ETAT : Parsing Json
                data = JSON.stringify(donnees);
            } catch (e) {
                // ETAT : JsonInvalides
                throw new Error("Json invalides");
            }


            // ETAT : VerificationDonnees
            try {
                confirmation = await transmissionClientDAO.envoyerDonnees({
                    source: "recuperationUtilisation",
                    timestamp: Date.now(),
                    data
                });
                if (!confirmation || confirmation.ok !== true) {
                    throw new Error("Erreur donnees");
                }
            } catch (e) {
                throw new Error("Erreur Donnees");
            }
            

            // ETAT : AttenteReponse
            if (!confirmation || confirmation.ok !== true) {
                throw new Error("jsonInvalides");
            }

            // ETAT : UtilisationDonnees
            
            return donnees;

            //fin
            // Normalemement l'ui devrait se mettre a jour avec ces données.

        } catch (e) {
            if (e.message === "Erreur Reseau") {
                throw new Error("Erreur de réseau lors de la récupération des données");
            } else if (e.message === "Json invalides") {
                throw new Error("Le format des données reçues est invalide");
            } else if (e.message === "Erreur Donnees") {
                throw new Error("Les données reçues sont invalides ou incomplètes");
            } else {
                throw e; 
            }
        }
    }
};

export default recuperationUtilisationDAO;