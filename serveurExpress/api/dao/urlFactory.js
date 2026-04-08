// Toutes des donnees viennent de Nantes Métropole
const OPEN_DATA_BASE_URL = "https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets";
// Data par défault pour les stations de vélos en libre-service
const OPEN_DATA_STATION_DATASET = "244400404_parking-velos-nantes-metropole-disponibilites";

export const OPEN_DATA_RESOURCES = {
    stationsLibreService: "244400404_stations-velos-libre-service-nantes-metropole",
    parkingVelosDisponibilites: "244400404_parking-velos-nantes-metropole-disponibilites",
    gonfleursLibreService: "244400404_gonfleurs-libre-service-nantes-metropole",
    abrisVelos: "244400404_abris-velos-nantes-metropole",
    appuisVelos: "244400404_appuis-velos-nantes-metropole",
    schemaCyclable: "244400404_schema-directeur-infrastructures-cyclables-nantes-metropole",
    infoTraficTan: "244400404_info-trafic-tan-temps-reel",
    parkingsPublics: "244400404_parkings-publics-nantes",
    parkingsPublicsDisponibilites: "244400404_parkings-publics-nantes-disponibilites",
    parcsRelais: "244400404_parcs-relais-nantes-metropole",
    parcsRelaisDisponibilites: "244400404_parcs-relais-nantes-metropole-disponibilites"
};

// transforme en requete URL
function buildQuery(params) {
    return new URLSearchParams(params).toString();
}

// URL de base
export function getOpenDataDatasetBaseUrl(dataset = OPEN_DATA_STATION_DATASET) {
    return `${OPEN_DATA_BASE_URL}/${dataset}/`;
}

// url de base d'une ressource
export function getOpenDataResourceBaseUrl(resourceName) {
    const dataset = OPEN_DATA_RESOURCES[resourceName];
    if (!dataset) {
        throw new Error(`Ressource OpenData inconnue: ${resourceName}`);
    }
    return getOpenDataDatasetBaseUrl(dataset);
}

// recuperation info
export function getOpenDataRecordsUrl({
    dataset = OPEN_DATA_STATION_DATASET,
    status = "Disponible",
    orderBy = "number",
    limit = -1
} = {}) {
    let query
    if (dataset === "244400404_gonfleurs-libre-service-nantes-metropole") {
        query = buildQuery({
            limit: String(limit)
        });
    } else {
        query = buildQuery({
            where: `status = "${status}"`,
            order_by: orderBy,
            limit: String(limit)
        });
    }

    return `${getOpenDataDatasetBaseUrl(dataset)}records?${query}`;
}

// pagination
export function getOpenDataRecordsPageUrl(offset, options = {}) {
    const baseUrl = getOpenDataRecordsUrl(options);
    return `${baseUrl}&offset=${offset}`;
}

// recuperation info en fonction de la ressource
export function getOpenDataRecordsUrlForResource(resourceName, options = {}) {
    const dataset = OPEN_DATA_RESOURCES[resourceName];
    if (!dataset) {
        throw new Error(`Ressource OpenData inconnue: ${resourceName}`);
    }
    return getOpenDataRecordsUrl({ ...options, dataset });
}

// url de l'API
export function getInternalApiBaseUrl({
    ip = process.env.IP,
    port = process.env.PORT,
    apiPath = process.env.API_PATH
} = {}) {
    return `http://${ip}:${port}${apiPath}`;
}

// pour transmission
export function getInternalTransmissionUrl(options = {}) {
    return `${getInternalApiBaseUrl(options)}/transmission`;
}


