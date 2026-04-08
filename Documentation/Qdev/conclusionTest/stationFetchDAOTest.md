# Conclusion des tests - `stationFetchDAO`

## 1) Bilan des tests fonctionnels

Les cas de test `DT1` a `DT8` :

- sans proxy : retour simple, pagination, erreurs
- avec proxy : retour simple, pagination selon comportement actuel, erreurs

### Tableau de suivi

| Cas | Objectif | Etat |
|---|---|---|
| DT1 | Sans proxy, `total_count = 80`, retour `results` | OK |
| DT2 | Sans proxy, pagination multi-pages | OK |
| DT3 | Sans proxy, erreur page suivante | OK |
| DT4 | Sans proxy, erreur initiale `fetch` | OK |
| DT5 | Avec proxy, `total_count = 100`, retour `results` | OK |
| DT6 | Avec proxy, pagination (comportement actuel valide) | OK |
| DT7 | Avec proxy, erreur page suivante | OK |
| DT8 | Avec proxy, erreur initiale `fetch` | OK |


## 2) Bilan des tests de mutation

Resultat du dernier lancement `npm run mutation` (Stryker) :

- **Score de mutation (`stationFetchDAO.mjs`) : 82.86%**
- **Mutants tues : 29**
- **Mutants survivants : 6**
- **Timeout : 0**
- **No coverage : 0**

Le rapport HTML est genere ici :

`serveurExpress/reports/mutation/mutation.html`

## 3) Conclusion

La suite de tests actuelle sur `stationFetchDAO.mjs` :

- scenarios fonctionnels principaux verifies
- score de mutation correct mais perfectible (6 mutants survivants)
- pas de timeout sur ce dernier run
