# Serveur Express pour l'API de Nantibus

## Mise en place de l'API sur la machine Serveur

### Mise en place sur les PC de l'IUT

1. Ouvrez un terminal sur le conteneur Ubuntu (profil de base)
2. Clonez le repository dans le répertoire souhaité
```bash
git clone https://gitlab.univ-nantes.fr/pub/but/but2/sae4/groupe1/eq_1_02_maanli-nael_touraine-melyna_cousin-gautier_terrien-swan.git
```   
3. Déplacez-vous dans le répertoire **serveurExpress** du dépot
```bash
cd eq_1_02_maanli-nael_touraine-melyna_cousin-gautier_terrien-swan/serveurExpress/
``` 
4. Effectuez les installations de node nécessaires
```bash
nvm install --lts
nvm use --lts
```
5. Installez les modules nécessaires au bon fonctionnement du serveur
```bash
npm i
```
6. Renommez le fichier env en .env (env --> .env)
```bash
mv env .env
```

Le serveur est prêt pour son utilisation !


### Mise en place sur des PC externes (les autres)

1. Assurez-vous d'avoir la version LongTermSupport de node avec npm sont installés sur votre machine

Lien pour l'installer : https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

2. Clonez le repository dans le répertoire souhaité
```bash
git clone https://gitlab.univ-nantes.fr/pub/but/but2/sae4/groupe1/eq_1_02_maanli-nael_touraine-melyna_cousin-gautier_terrien-swan.git
```   
3. Déplacez-vous dans le répertoire **serveurExpress** du dépot
```bash
cd eq_1_02_maanli-nael_touraine-melyna_cousin-gautier_terrien-swan/serveurExpress/
```
4. Installez les modules nécessaires au bon fonctionnement du serveur
```bash
npm i
```
5. Renommez le fichier env en .env (env --> .env)
```bash
mv env .env
```

## Utilisation du serveur

Pour le démarrer, il suffit d'exécuter la commande suivante dans le dossier **serveurExpress** du dépôt :
```bash
npm start
```

Pour y accéder, il suffit de se rendre à l'adresse suivante dans votre navigateur :
```
http://localhost:8081
```
**Pour les PC de l'IUT :** Il faudra aller chercher l'adresse IP du conteneur Ubuntu pour y accéder depuis les autres PC. Pour cela, exécutez la commande suivante dans le terminal du conteneur :
```bash
ip a
```

L'adresse IP du conteneur est celle qui est associée à l'interface **host0**. 
Vous pourrez alors accéder au serveur en remplaçant "localhost" par cette adresse IP dans l'URL (ex : http://172.x.x.x:8081).

## Les routes de l'API

- **GET /doc** : Affiche la documentation de l'API (Swagger)
- **GET /api/v0/stations** : Récupère la liste de toutes les stations
- **GET /api/v0/stations/:id** : Récupère les informations d'une station à partir de son ID

## Lancer les tests

Pour lancer les tests, il suffit d'exécuter cette commandedans le dossier **serveurExpress** du dépôt :
```bash
npm test
```
