'use strict'

import dotenv from 'dotenv'
import {mongoose} from 'mongoose';

// Import des variables d'environnement
dotenv.config()

// Mise en place des constantes de configuration (port du serveur, url de la base de données, nom de la base de données)
const serverPort = process.env.PORT || 8081
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017'
const mongoDB = process.env.MONGO_DB || 'tpDB'

// Environnements possibles : PROD ou TEST (PROD par défaut)
const env = (new URL(import.meta.url)).searchParams.get('ENV') ||process.env.ENV || 'PROD'
console.log(`env : ${env}`)

    // Mise en place de la connexion à la base de données
    if (env==='TEST') {
        // En environnement de test, on utilise une base de données en mémoire (la BD de production ne sera impactée).
        const {MongoMemoryServer}  = await import('mongodb-memory-server')
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri)
        console.log("Mongo en mémoire : " + uri)
    } else {
        await mongoose.connect(mongoURL + '/' + mongoDB)
        console.log("Mongo en : "+ mongoURL + '/' + mongoDB)
    }

    const {default: app}  = await import ('./app.mjs')

    // Lancement du serveur HTTP
    const server = app.listen(serverPort, () =>
        console.log(`L'application écoute sur le port : ${serverPort}`)
    )


    // Pour les interruptions utilisateur (souvent pour l'arrêt du serveur).
    for (let signal of ["SIGTERM", "SIGINT"])
        process.on(signal,  () => {
            console.info(`${signal} signal interruption reçu.`)
            console.log("Fermeture du serveur HTTP.");
            server.close(async (err) => {
                console.log("Serveur HTTP fermé.")
                await mongoose.connection.close()
                console.log("Connexion à la BD MongoDB terminée.")
                process.exit(err ? 1 : 0)
            });
        });


export default server

