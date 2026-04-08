# Tests de récupération – `Adresse`

## Tests structurels

Le flux principal du constructeur `Adresse` est le suivant :

- lecture des données brutes (objet passé au constructeur)
- vérification de la présence et validité des champs attendus :
    - `adress`
    - `zipcode`
    - `city`
- construction de l’objet `Adresse` si toutes les données sont valides
- sinon, levée d’une `AdressException`

Branches d’erreur principales :

- champ obligatoire manquant
- champ présent mais invalide
- présence de champs parasites non autorisés
- structure incohérente de l’objet d’entrée

![adresseConstructeur](../drawioPng/adresseConstructeur.png)


## Synthèse des chemins

| Chemin | Conditions | Données | Oracle |
|--------|------------|---------|--------|
| ch1 | adress=0, zipcode=0, city=0 | `{ adress: undefined, zipcode: undefined, city: undefined }` | `AdressException` |
| ch2 | adress=0, zipcode=1, city=1 | `{ test: "bug", zipcode: 44000, city: "Nantes" }` | `AdressException` |
| ch3 | adress=1, zipcode=1, city=1 | `{ adress: "3 rue Joffre", zipcode: 44000, city: "Nantes" }` | `Adresse()` |
| ch4 | adress=1, zipcode=0, city=1 | `{ adress: "3 rue Joffre", batman: "Robin", city: "Gotham" }` | `AdressException` |


## Données de test (DT)

| ID  | adress_ok | zipcode_ok | city_ok | Données brutes (DT) | Résultat attendu |
|-----|-----------|------------|---------|----------------------|------------------|
| DT1 | false     | false      | false   | `{ adress: undefined, zipcode: undefined, city: undefined }` | `AdressException` |
| DT2 | false     | true       | true    | `{ test: "bug", zipcode: 44000, city: "Nantes" }` | `AdressException` |
| DT3 | true      | true       | true    | `{ adress: "3 rue Joffre", zipcode: 44000, city: "Nantes" }` | `Adresse()` valide |
| DT4 | true      | false/NA   | true    | `{ adress: "3 rue Joffre", batman: "Robin", city: "Gotham" }` | `AdressException` |


## Correspondance CT ↔ DT

| CT | DT | Chemin principal | Résultat attendu |
|----|----|------------------|------------------|
| CT1 | DT1 | données vides → validation échoue | `throw AdressException` |
| CT2 | DT2 | données partielles + champ parasite → validation échoue | `throw AdressException` |
| CT3 | DT3 | données complètes et valides → construction | `return new Adresse()` |
| CT4 | DT4 | données incohérentes (champ manquant + parasite) → validation échoue | `throw AdressException` |

