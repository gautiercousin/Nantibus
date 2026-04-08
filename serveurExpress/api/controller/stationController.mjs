"use strict"
import recuperationTraitementDAO from "../dao/recuperationTraitementDAO.js";
let lastUpdate = null;
let stationsCache = [];

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
    return lat !== null && lon !== null && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

const stationController = {
    // Mettre à jour la base de données si elle est obsolète (plus de 1 minute)
    updateBD: async () =>{
        if (lastUpdate == null || (new Date() - lastUpdate) > 60000) {
            // Mise à jour de la base de données
            stationsCache = await recuperationTraitementDAO.findAll();
            lastUpdate = new Date();
        }
        return stationsCache;
    },
    // Il fauda appeler updateBD pour toutes les requetes faites ici pour être sûr d'avoir des données à jour

    // Test: curl -i "http://localhost:8081/api/v0/stations"
    getStations: async (req, res) => {
        try {
            const stations = await stationController.updateBD();
            res.status(200).json(stations);
        } catch (error) {
            res.status(502).json({ message: error.message });
        }
    },

    // Test: curl -i "http://localhost:8081/api/v0/stations/id/1"
    getStationById: async (req, res) => {
        try {
            // evite d'appeller l'update si c'est pas nécéssaire
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) {
                return res.status(400).json({ message: "ID station invalide" });
            }

            const stations = await stationController.updateBD();
            const station = stations.find((s) => s.id === id);

            if (!station) {
                return res.status(404).json({ message: "Station introuvable" });
            }

            res.status(200).json(station);
        } catch (error) {
            res.status(502).json({ message: error.message });
        }
    },

    // Test: curl -i "http://localhost:8081/api/v0/stations/city/Nantes"
    getStationsByCity: async (req, res) => {
        try {
            const city = normalizeText(req.params.city);
            if (!city) {
                return res.status(400).json({ message: "Ville invalide" });
            }

            const stations = await stationController.updateBD();
            const filtered = stations.filter((s) => normalizeText(s?.address?.city) === city);
            res.status(200).json(filtered);
        } catch (error) {
            res.status(502).json({ message: error.message });
        }
    },

    // Test: curl -i "http://localhost:8081/api/v0/stations/status/Disponible"
    getStationsByStatus: async (req, res) => {
        try {
            const status = normalizeText(req.params.status);
            if (!status) {
                return res.status(400).json({ message: "Status invalide" });
            }

            const stations = await stationController.updateBD();
            const filtered = stations.filter((s) => normalizeText(s?.status) === status);
            res.status(200).json(filtered);
        } catch (error) {
            res.status(502).json({ message: error.message });
        }
    },

    // Test: curl -i "http://localhost:8081/api/v0/stations/near?lat=47.218&lon=-1.553&radiusKm=2"
    getStationsNear: async (req, res) => {
        try {
            const lat = toNumber(req.query.lat);
            const lon = toNumber(req.query.lon);
            const radiusKm = toNumber(req.query.radiusKm) ?? 2;

            if (lat === null || lon === null || radiusKm <= 0) {
                return res.status(400).json({ message: "Paramètres géographiques invalides" });
            }

            const stations = await stationController.updateBD();
            const filtered = stations
                .filter((s) => toNumber(s?.position?.lat) !== null && toNumber(s?.position?.lon) !== null)
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

    // Test: curl -i "http://localhost:8081/api/v0/stations/itinerary?latA=47.218&lonA=-1.553&latB=47.230&lonB=-1.617"
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
    },
    // Test: curl -i "http://localhost:8081/api/v0/stations/name/gare"
    getStationsByName: async (req, res) => {
        try {
            const stations = await stationController.updateBD();
            const name = req.params.name.toString().trim()
            if (name === undefined || name == null){
                return res.status(400).json({ message: "parametre name invalide" });
            }
            const stationsFiltre = stations.filter((s)=>s.name.toLowerCase().includes(req.params.name.toLowerCase()))
            if (stationsFiltre.length === 0){
                return res.status(404).json({ message: `aucune station nommée de la sorte existe` });
            }
            res.status(200).json(stationsFiltre);
        } catch (error) {
            res.status(502).json({ message: error.message });
        }
    },

    // Test: curl -i "http://localhost:8081/api/v0/stations/available"
    getAvailableStations: async (req, res) => {
        try {
            const stations = await stationController.updateBD();
            const filtered = stations.filter((s) => {
                const spots = toNumber(s?.availableSpots);
                return spots !== null && spots > 0;
            });
            res.status(200).json(filtered);
        } catch (error) {
            res.status(502).json({ message: error.message });
        }
    },

    // Test: curl -i "http://localhost:8081/api/v0/stations/search?city=Nantes&status=Disponible&name=gare&minAvailable=1"
    // curl -i "http://localhost:8081/api/v0/stations/search?name=gare"
    getStationsSearch: async (req, res) => {
        try {
            const city = normalizeText(req.query.city);
            const status = normalizeText(req.query.status);
            const name = normalizeText(req.query.name);

            let minAvailable = null;
            if (req.query.minAvailable !== undefined) {
                minAvailable = toNumber(req.query.minAvailable);
                if (minAvailable === null || minAvailable < 0) {
                    return res.status(400).json({ message: "minAvailable invalide" });
                }
            }

            const stations = await stationController.updateBD();
            const filtered = stations.filter((s) => {
                const byCity = !city || normalizeText(s?.address?.city) === city;
                const byStatus = !status || normalizeText(s?.status) === status;
                const byName = !name || normalizeText(s?.name).includes(name);
                const byMinAvailable = minAvailable === null || ((toNumber(s?.availableSpots) ?? -1) >= minAvailable);
                return byCity && byStatus && byName && byMinAvailable;
            });

            res.status(200).json(filtered);
        } catch (error) {
            res.status(502).json({ message: error.message });
        }
    },


}
export default stationController
