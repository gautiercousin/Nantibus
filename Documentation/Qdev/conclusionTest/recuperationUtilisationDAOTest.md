# Conclusion des tests - `recuperationUtilisationDAO`

## 1) Bilan des tests fonctionnels

Les cas de test `DT1` a `DT5` :

- recuperation des donnees avec succes
- gestion des erreurs reseau
- gestion des erreurs de format JSON
- gestion des erreurs de transmission et de confirmation

### Tableau de suivi

| Cas | Objectif | Etat |
|---|---|---|
| DT1 | `findAll` OK, `stringify` OK, `envoyer` OK, `confirmation` OK -> `return donnees` | OK |
| DT2 | `findAll` en echec -> erreur reseau | OK |
| DT3 | `stringify` en echec -> format invalide | OK |
| DT4 | `envoyer` en echec -> donnees invalides/incompletes | OK |
| DT5 | confirmation invalide (`ok != true`) -> donnees invalides/incompletes | OK |

## 2) Bilan des tests de mutation

Resultat du dernier lancement `npm run mutation` (Stryker) :

- **Score de mutation (`recuperationUtilisationDAO.js`) : 84.62%**
- **Mutants tues : 44**
- **Mutants survivants : 8**
- **Timeout : 0**
- **No coverage : 0**

Le rapport HTML est genere ici :

`serveurExpress/reports/mutation/mutation.html`

## 3) Conclusion

La suite de tests actuelle sur `recuperationUtilisationDAO.js` :

- scenarios fonctionnels principaux verifies
- robustesse correcte face aux erreurs metier et techniques
- score de mutation bon, avec 8 mutants survivants a traiter pour renforcer la suite
