# Tests de récupération – `Position`

## Tests structurels

Le flux principal du constructeur `Position` est le suivant :

- lecture des données brutes (objet passé au constructeur)
- vérification de la présence et validité des champs attendus :
    - `lat`
    - `lon`
- contrôle métier :
    - `lat` doit être un nombre compris entre -90 et 90
    - `lon` doit être un nombre compris entre -180 et 180
- construction de l’objet `Position` si toutes les données sont valides
- sinon, levée d’une `PositionException`

Branches d’erreur principales :

- champ obligatoire manquant
- champ présent mais invalide (type incorrect)
- valeur hors bornes
- structure incohérente de l’objet d’entrée

![positionConstructeur](../drawioPng/positionConstructeur.png)

## Synthèse des chemins (équivalent ch1–ch4)

| Chemin | Conditions | Données | Oracle |
|--------|------------|---------|--------|
| ch1 | lat=0, lon=1, bornes=0 | `{ lat: undefined, lon: 10 }` | `PositionException` |
| ch2 | lat=1, lon=1, bornes=1 | `{ lat: 0, lon: 0 }` | `Position()` |
| ch3 | lat=0, lon=0, bornes=0 | `{ lat: "bug" }` | `PositionException` |
| ch4 | lat=1, lon=1, bornes=0 | `{ lat: 100, lon: 180 }` | `PositionException` |


## Données de test (DT)

| ID  | lat_ok | lon_ok | bornes_ok | Données brutes (DT) | Résultat attendu |
|-----|--------|--------|-----------|----------------------|------------------|
| DT1 | false  | true   | false/NA  | `{ lat: undefined, lon: 10 }` | `PositionException` |
| DT2 | true   | true   | true      | `{ lat: 0, lon: 0 }` | `Position()` valide |
| DT3 | false  | false/NA | false/NA | `{ lat: "bug" }` | `PositionException` |
| DT4 | true   | true   | false     | `{ lat: 100, lon: 180 }` | `PositionException` |


## Correspondance CT ↔ DT

| CT | DT | Chemin principal | Résultat attendu |
|----|----|------------------|------------------|
| CT1 | DT1 | lat manquant → validation échoue | `throw PositionException` |
| CT2 | DT2 | données valides → construction | `return new Position()` |
| CT3 | DT3 | lat invalide (type incorrect) → validation échoue | `throw PositionException` |
| CT4 | DT4 | valeurs hors bornes → validation échoue | `throw PositionException` |