"use strict"
import recuperationTraitementGonfleurDAO from "../dao/recuperationTraitementGonfleurDAO.js";
 let lastUpdate = null;
let gonfleursCache = [];

function normalizeText(value) {
    return String(value ?? "").trim().toLowerCase();
}

function toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
}

// Distance en km entre deux points GPS
function distanceKm(lat1, lon1, lat2, lon2) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return 6371 * c;
}

function isValidCoordinate(lat, lon) {
    return lat !== null && lon !== null && lat >= -180 && lat <= 180 && lon >= -90 && lon <= 90;
}

const gonfleurController = {
    // Mettre à jour la base de données si elle est obsolète (plus de 1 minute)
    updateBD: async () =>{
        if (lastUpdate == null || (new Date() - lastUpdate) > 60000) {
            // Mise à jour de la base de données
            gonfleursCache = await recuperationTraitementGonfleurDAO.findAll();
            lastUpdate = new Date();
        }
        return gonfleursCache;
    },
    // Il faudra appeler updateBD pour toutes les requêtes faites ici pour être sûr d'avoir des données à jour

    // Test: curl -i "http://localhost:8081/api/v0/gonfleurs"
    getGonfleurs: async (req, res) => {
        try {
            const gonfleurs = await gonfleurController.updateBD();
            res.status(200).json(gonfleurs);
        } catch (error) {
            res.status(502).json({ message: error.message });
        }
    },

    // Test: curl -i "http://localhost:8081/api/v0/gonfleurs/1"
    getGonfleurById: async (req, res) => {
        try {
            // evite d'appeller l'update si c'est pas nécéssaire
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) {
                return res.status(400).json({ message: "ID gonfleurs invalide" });
            }

            const gonfleurs = await gonfleurController.updateBD();
            const gonfleur = gonfleurs.find((g) => g.gid === id);

            if (!gonfleur) {
                return res.status(404).json({ message: "Gonfleur introuvable" });
            }

            res.status(200).json(gonfleur);
        } catch (error) {
            res.status(502).json({ message: error.message });
        }
    },

    // Test: curl -i "http://localhost:8081/api/v0/gonfleurs/city/Nantes"
    getGonfleursByCity: async (req, res) => {
        try {
            const city = normalizeText(req.params.city);
            if (!city) {
                return res.status(400).json({ message: "Ville invalide" });
            }

            const gonfleurs = await gonfleurController.updateBD();
            const filtered = gonfleurs.filter((g) => normalizeText(g?.commune) === city);
            res.status(200).json(filtered);
        } catch (error) {
            res.status(502).json({ message: error.message });
        }
    },


    // Test: curl -i "http://localhost:8081/api/v0/gonfleurs/near?lat=47.218&lon=-1.553&radiusKm=2"
    getGonfleursNear: async (req, res) => {
        try {
            const lat = toNumber(req.query.lat);
            const lon = toNumber(req.query.lon);
            const radiusKm = toNumber(req.query.radiusKm) ?? 2;

            if (lat === null || lon === null || radiusKm <= 0) {
                return res.status(400).json({ message: "Paramètres géographiques invalides" });
            }

            const gonfleurs = await gonfleurController.updateBD();
            const filtered = gonfleurs
                .filter((g) => toNumber(g?.position?.lat) !== null && toNumber(s?.position?.lon) !== null)
                .map((s) => {
                    const d = distanceKm(lat, lon, s.position.lat, s.position.lon);
                    return { ...s, distanceKm: Number(d.toFixed(3)) };
                })
                .filter((s) => s.distanceKm <= radiusKm)
                .sort((a, b) => a.distanceKm - b.distanceKm);

            res.status(200).json(filtered);
        } catch (error) {
            res.status(502).json({ message: error.message });
        }
    },

    // Test: curl -i "http://localhost:8081/api/v0/gonfleurs/itinerary?latA=47.218&lonA=-1.553&latB=47.230&lonB=-1.617"
    getItineraryBetweenPoints: async (req, res) => {
        try {
            const latA = toNumber(req.query.latA);
            const lonA = toNumber(req.query.lonA);
            const latB = toNumber(req.query.latB);
            const lonB = toNumber(req.query.lonB);

            if (!isValidCoordinate(latA, lonA) || !isValidCoordinate(latB, lonB)) {
                return res.status(400).json({ message: "Paramètres géographiques invalides" });
            }

            const distance = distanceKm(latA, lonA, latB, lonB);

            res.status(200).json({
                pointA: { lat: latA, lon: lonA },
                pointB: { lat: latB, lon: lonB },
                distanceKm: Number(distance.toFixed(3)),
                type: "trajet direct"
            });
        } catch (error) {
            res.status(502).json({ message: error.message });
        }
    }
}
export default gonfleurController
