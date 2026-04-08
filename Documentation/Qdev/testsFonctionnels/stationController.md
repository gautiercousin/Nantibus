# Tests fonctionnels - `stationController`

## Etape n1

L'oracle verifie, selon la route appelee, que le controleur retourne :

- un `200` avec les donnees attendues,
- ou un code d'erreur metier (`400`, `404`, `502`) avec le bon message.

## Etape n2

Le comportement depend :

- des parametres de route (`id`, `city`, `status`),
- des parametres de requete (`lat`, `lon`, `radiusKm`, `latA`, `lonA`, `latB`, `lonB`),
- de `updateBD()` (cache + appel DAO),
- des erreurs potentielles de la couche DAO.

## Etape n3

Les cas de test suivent strictement l'ordre des routes de `serveurExpress/api/route/route.mjs`.

## Table de decision

| Conditions / Oracle | CT1 | CT2 | CT3 | CT4 | CT5 | CT6 | CT7 | CT8 | CT9 | CT10 | CT11 | CT12 | CT13 | CT14 | CT15 | CT16 | CT17 | CT18 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Route = `GET /stations` | X | X |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |
| Route = `GET /stations/city/:city` |   |   | X | X | X |   |   |   |   |   |   |   |   |   |   |   |   |   |
| Route = `GET /stations/status/:status` |   |   |   |   |   | X | X | X |   |   |   |   |   |   |   |   |   |   |
| Route = `GET /stations/near` |   |   |   |   |   |   |   |   | X | X | X |   |   |   |   |   |   |   |
| Route = `GET /stations/itinerary` |   |   |   |   |   |   |   |   |   |   |   | X | X | X |   |   |   |   |
| Route = `GET /stations/:id` |   |   |   |   |   |   |   |   |   |   |   |   |   |   | X | X | X | X |
| Parametres invalides (ville/status/geo/id) |   |   |   | X |   |   | X |   |   | X |   |   | X |   |   | X |   |   |
| Erreur DAO / updateBD |   | X |   |   | X |   |   | X |   |   | X |   |   |   |   |   |   | X |
| Ressource introuvable (`id` absent) |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   | X |   |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Oracle: `200` | X |   | X |   |   | X |   |   | X |   |   | X |   |   | X |   |   |   |
| Oracle: `400` |   |   |   | X |   |   | X |   |   | X |   |   | X |   |   | X |   |   |
| Oracle: `404` |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   | X |   |
| Oracle: `502` |   | X |   |   | X |   |   | X |   |   | X |   |   | X |   |   |   | X |

## Cas de tests (ordre des routes)

### 1) `GET /stations` -> `getStations`

| CT | DT | Resultat attendu |
|---|---|---|
| CT1 | `updateBD` retourne une liste valide | `200` + tableau de stations |
| CT2 | `updateBD` leve une erreur | `502` + `{ message: error.message }` |

### 2) `GET /stations/city/:city` -> `getStationsByCity`

| CT | DT | Resultat attendu |
|---|---|---|
| CT3 | `city = Nantes`, donnees avec villes mixtes | `200` + stations de `Nantes` uniquement |
| CT4 | `city` vide/invalide | `400` + `ville invalide` |
| CT5 | erreur DAO (`updateBD`) | `502` + message d'erreur |

### 3) `GET /stations/status/:status` -> `getStationsByStatus`

| CT | DT | Resultat attendu |
|---|---|---|
| CT6 | `status = Disponible` | `200` + stations filtrees |
| CT7 | `status` vide/invalide | `400` + `status invalide` |
| CT8 | erreur DAO (`updateBD`) | `502` + message d'erreur |

### 4) `GET /stations/near?lat=&lon=&radiusKm=` -> `getStationsNear`

| CT | DT | Resultat attendu |
|---|---|---|
| CT9 | `lat/lon` valides, `radiusKm=2` | `200` + stations proches triees par distance |
| CT10 | `radiusKm <= 0` ou coordonnees invalides | `400` + `parametres geographiques invalides` |
| CT11 | erreur DAO (`updateBD`) | `502` + message d'erreur |

### 5) `GET /stations/itinerary?latA=&lonA=&latB=&lonB=` -> `getItineraryBetweenPoints`

| CT | DT | Resultat attendu |
|---|---|---|
| CT12 | points A/B valides | `200` + `{ pointA, pointB, distanceKm, type }` |
| CT13 | un des points invalide | `400` + `parametres geographiques invalides` |
| CT14 | erreur interne inattendue | `502` + message d'erreur |

### 6) `GET /stations/:id` -> `getStationById`

| CT | DT | Resultat attendu |
|---|---|---|
| CT15 | `id` entier existant | `200` + station correspondante |
| CT16 | `id` non entier (`abc`, `1.2`) | `400` + `id station invalide` |
| CT17 | `id` entier mais absent | `404` + `station introuvable` |
| CT18 | erreur DAO (`updateBD`) | `502` + message d'erreur |

