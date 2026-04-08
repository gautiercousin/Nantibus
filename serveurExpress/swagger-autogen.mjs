import swaggerAutogen from 'swagger-autogen';
import dotenv from 'dotenv'


dotenv.config()

const serverPort = process.env.PORT || 8080
const APIPATH = process.env.API_PATH || '/api/v0'
const IP = process.env.IP || '127.0.0.1'

const outputFile = './swagger.json';
const endpointsFiles = ['./api/route/*.mjs'];

const config = {
    info: {
        title: 'Nantibus User API Documentation',
        description: '',
    },
    tags: [ ],
    host: IP+':'+serverPort+APIPATH,
    schemes: ['http', 'https'],
};

swaggerAutogen(outputFile, endpointsFiles, config);
