"use strict"
import express from 'express'
import stationController from '../controller/stationController.mjs'
import gonfleurController from "../controller/gonfleurController.mjs";

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
// Test: curl -i "http://localhost:8081/api/v0/stations/name/gare"
router.get('/stations/name/:name', stationController.getStationsByName)
// Test: curl -i "http://localhost:8081/api/v0/stations/1"
router.get('/stations/:id', stationController.getStationById)

// Test: curl -i "http://localhost:8081/api/v0/stations/available"
router.get('/stations/available', stationController.getAvailableStations)
// Test: curl -i "http://localhost:8081/api/v0/stations/search?city=Nantes&status=Disponible&name=gare&minAvailable=1"
// curl -i "http://localhost:8081/api/v0/stations/search?name=gare"
router.get('/stations/search', stationController.getStationsSearch)


// route pour récupérer les gonfleurs
// Test: curl -i "http://localhost:8081/api/v0/gonfleurs"
router.get('/gonfleurs', gonfleurController.getGonfleurs)
// Test: curl -i "http://localhost:8081/api/v0/gonfleurs/city/Nantes"
router.get('/gonfleurs/city/:city', gonfleurController.getGonfleursByCity)
// Test: curl -i "http://localhost:8081/api/v0/gonfleurs/id/1"
router.get('/gonfleurs/id/:id', gonfleurController.getGonfleurById)


// Test: curl -i "http://localhost:8081/api/v0/stations/id/1"
router.get('/stations/id/:id', stationController.getStationById)



export default router
