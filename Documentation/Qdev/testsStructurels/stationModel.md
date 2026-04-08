# Tests de récupération – `Station`

## Tests structurels

Le flux principal du constructeur `Station` est le suivant :

- lecture des données brutes (objet passé au constructeur)
- vérification de la présence et validité des champs attendus :
    - `id`
    - `name`
    - `status`
    - `capacity`
    - `availableSpots`
    - `adress` (objet `Adresse`)
    - `position` (objet `Position`)
- contrôle métier :
    - `capacity >= 0`
    - `availableSpots >= 0`
    - `availableSpots <= capacity`
- construction de l’objet `Station` si toutes les données sont valides
- sinon, levée d’une `StationException`

Branches d’erreur principales :

- champ obligatoire manquant
- champ présent mais invalide (type incorrect)
- valeurs incohérentes (ex : availableSpots > capacity)
- objets `adress` ou `position` invalides
- présence de champs parasites non autorisés

![stationConstructeur](../drawioPng/stationConstructeur.png)

## Synthèse des chemins (équivalent ch1–ch4)

| Chemin | Conditions | Données | Oracle |
|--------|------------|---------|--------|
| ch1 | id=0, structure=0, mapping=0, bornes=0 | `{ id: undefined }` | `StationException` |
| ch2 | id=1, structure=0, mapping=0, bornes=0 | `{ id: 3, name: "Bonjour", status: "Dispo", capacity: 0, availableSpots: 0, position: {}, adress: {}, test: "Ne passe pas" }` | `StationException` |
| ch3 | id=1, structure=1, mapping=1, bornes=1 | `{ id: 10, name: "Cholet", status: "Dispo", capacity: 10, availableSpots: 5, adress: {...}, position: {...} }` | `Station()` |
| ch4 | id=1, structure=1, mapping=1, bornes=0 | `{ id: 10, name: "Nael", status: "Indisponible", capacity: 15, availableSpots: 20, adress: {...}, position: {...} }` | `StationException` |


## Données de test (DT)

| ID  | id_ok | structure_ok | mapping_ok | bornes_ok | Données brutes (DT) | Résultat attendu |
|-----|-------|--------------|------------|-----------|----------------------|------------------|
| DT1 | false | false/NA     | false/NA   | false/NA  | `{ id: undefined }` | `StationException` |
| DT2 | true  | false        | false/NA   | false/NA  | `{ id: 3, name: "Bonjour", status: "Dispo", capacity: 0, availableSpots: 0, position: {}, adress: {}, test: "Ne passe pas" }` | `StationException` |
| DT3 | true  | true         | true       | true      | `{ id: 10, name: "Cholet", status: "Dispo", capacity: 10, availableSpots: 5, adress: {adress: "3 rue de la paix", zipcode: 75001, city: "Paris"}, position: {lat: -45, lon: 50} }` | `Station()` valide |
| DT4 | true  | true         | true       | false     | `{ id: 10, name: "Nael", status: "Indisponible", capacity: 15, availableSpots: 20, adress: {adress: "3 rue de la paix", zipcode: 75001, city: "Paris"}, position: {lat: -45, lon: 50} }` | `StationException` |


## Correspondance CT ↔ DT

| CT | DT | Chemin principal | Résultat attendu |
|----|----|------------------|------------------|
| CT1 | DT1 | id manquant → validation échoue | `throw StationException` |
| CT2 | DT2 | structure invalide (champs parasites, objets internes invalides) | `throw StationException` |
| CT3 | DT3 | données valides → construction | `return new Station()` |
| CT4 | DT4 | incohérence métier (availableSpots > capacity) | `throw StationException` |