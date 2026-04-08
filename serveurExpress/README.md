# Mise en place du serveur d'API de Nantibus

### Installation de NodeJS
- Télécharger nvm (Node Version Manager) pour gérer les différentes versions de NodeJS :
- Télécharger NodeJS via nvm :
```bash
nvm install --lts
nvm use --lts
```
- Vérifier l'installation de NodeJS et npm :
```bash
node -v
npm -v
```

### Mise en place du projet
- Une fois avoir cloné le projet, se rendre dans le dossier du serveur (**/serveurExpress**) :
```bash
cd serveurExpress
```
- Installer les dépendances du projet :
```bash
npm install
```
- Renommer le fichier **env** en **.env** et changer les variables d'environnement si nécessaire.

### Lancement du serveur
- Lancer le serveur :
```bash
npm start
```

- Lancer tous les tests :
```bash
npm test
```

- Générer la documentation de l'API avec Swagger accessible à l'adresse <LIEN_DU_SERVEUR>/doc :
```bash
npm run start-gendoc
```




