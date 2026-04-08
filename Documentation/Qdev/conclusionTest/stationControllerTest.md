# Conclusion des tests - `stationController`

## 1) Bilan des tests fonctionnels

Les cas de test `CT1` a `CT18` couvrent :

- route globale des stations
- filtrage par ville
- filtrage par statut
- recherche geographique (near)
- calcul d'itineraire direct entre 2 points
- recherche par identifiant avec gestion des erreurs (`400`, `404`, `502`)

### Tableau de suivi

| Cas | Objectif | Etat |
|---|---|---|
| CT1-CT2 | `GET /stations` (succes + erreur DAO) | OK |
| CT3-CT5 | `GET /stations/city/:city` (succes + ville invalide + erreur DAO) | OK |
| CT6-CT8 | `GET /stations/status/:status` (succes + status invalide + erreur DAO) | OK |
| CT9-CT11 | `GET /stations/near` (succes + params invalides + erreur DAO) | OK |
| CT12-CT14 | `GET /stations/itinerary` (succes + params invalides + erreur interne) | OK |
| CT15-CT18 | `GET /stations/:id` (succes + id invalide + introuvable + erreur DAO) | OK |

## 2) Bilan des tests structurels

Les tests structurels couvrent les branches principales du controleur :

- branche nominale `200`
- validation des entrees (`400`)
- ressource absente (`404`)
- erreurs de couche DAO / exception (`502`)

### Tableau de suivi

| Cas | Chemin principal | Etat |
|---|---|---|
| CT1 | `getStations -> catch -> 502` | OK |
| CT2 | `getStationsByCity -> city invalide -> 400` | OK |
| CT3 | `getStationsByStatus -> status invalide -> 400` | OK |
| CT4 | `getStationsNear -> params invalides -> 400` | OK |
| CT5 | `getStationsNear -> calcul + tri -> 200` | OK |
| CT6 | `getItineraryBetweenPoints -> params invalides -> 400` | OK |
| CT7 | `getStationById -> id invalide -> 400` | OK |
| CT8 | `getStationById -> introuvable -> 404` | OK |

## 3) Bilan des tests de mutation

Resultat du dernier lancement `npm run mutation` (Stryker) :

- **Score de mutation (`stationController.mjs`) : 64.13%**
- **Mutants tues : 106**
- **Mutants survivants : 66**
- **Timeout : 12**
- **No coverage : 0**

Le rapport HTML est genere ici :

`serveurExpress/reports/mutation/mutation.html`

## 4) Conclusion

La suite de tests actuelle sur `stationController.mjs` :

- couverture fonctionnelle et structurelle en place, avec les routes principales validees
- bonne base de non-regression API (`200`, `400`, `404`, `502`)
- score de mutation encore perfectible sur le controleur (66 survivants), surtout sur les calculs geographiques et certaines branches internes

