"use strict"
import express from 'express'
import recuperationUtilisationDAO from '../dao/recuperationUtilisationDAO.js'
import stationController from '../controller/stationController.mjs'

const router = express.Router()

// route pour récupérer les stations
// Test: curl -i "http://localhost:8081/api/v0/stations"
router.get('/stations', stationController.getStations)
// Test: curl -i "http://localhost:8081/api/v0/stations/city/Nantes"
router.get('/stations/city/:city', stationController.getStationsByCity)
// Test: curl -i "http://localhost:8081/api/v0/stations/status/Disponible"
router.get('/stations/status/:status', stationController.getStationsByStatus)
// Test: curl -i "http://localhost:8081/api/v0/stations/near?lat=47.218&lon=-1.553&radiusKm=2"
router.get('/stations/near', stationController.getStationsNear)
// Test: curl -i "http://localhost:8081/api/v0/stations/itinerary?latA=47.218&lonA=-1.553&latB=47.230&lonB=-1.617"
router.get('/stations/itinerary', stationController.getItineraryBetweenPoints)
// Test: curl -i "http://localhost:8081/api/v0/stations/1"
router.get('/stations/:id', stationController.getStationById)

// route pour l'automate 3
router.post("/transmission", (req, res) => {
    console.log("Données reçues :", req.body)
    res.json({ confirmation: true })
})


// route pour l'automate 4
router.get("/utilisation", (req, res) => {
    console.log("Requête d'utilisation reçue")

    recuperationUtilisationDAO.envoyerRequete()
        .then((donneesTransmission) => {
            res.json(donneesTransmission)
        })
        .catch((error) => {
            res.status(502).json({ message: error.message })
        })
})

export default router
