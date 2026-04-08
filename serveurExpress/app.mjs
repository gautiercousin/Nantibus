"use strict"
import express from "express";
import swaggerUi from 'swagger-ui-express'
import swaggerJson from './swagger.json' with {type: 'json'};
import dotenv from 'dotenv'

// Import des variables d'environnement
dotenv.config()
//api path
const APIPATH = process.env.API_PATH || '/api/v0'

const app = express()

// Chargement des middlewares pour les CORS
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin",'*');
    res.setHeader("Access-Control-Allow-Methods",'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers",'Content-Type,Authorization');
    next();
})

// Pour traiter les requêtes en JSON
app.use(express.json())

// Ajout de la route pour la documentation de l'API
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerJson))

// Chargement des routes de l'API
const {default: routes}  = await import ('./api/route/route.mjs')
app.use(APIPATH+'/',routes)

// Message par défaut
app.use((error,req,res,next)=>{
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message
    res.status(status).json({message:message})
})

// Message par défaut pour la racine
app.get('/',(req,res,next)=>{
    res.status(200).json({message:'Bienvenue sur l\'API de Nantibus! Faites un tour sur /doc pour voir la documentation de l\'API'})
})

// Message par défaut pour les routes non trouvées
app.use((req,res,next)=>{
    res.status(404).json({message:'Tu me vois tu me vois plus :/ (Erreur 404)'})
})

export default app;
