import fetch from 'node-fetch';
import HttpsProxyAgent from 'https-proxy-agent';
import { OPEN_DATA_RESOURCES, getOpenDataRecordsUrl, getOpenDataRecordsPageUrl } from './urlFactory.js';

function buildAgent() {
    const proxy = process.env.https_proxy;
    if (proxy !== undefined) {
        console.log(`Le proxy est ${proxy}`);
        return new HttpsProxyAgent(proxy);
    }

    // Pour pouvoir consulter un site avec un certificat invalide
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    console.log("Pas de proxy trouvé");
    return null;
}

function resolveDataset(resourceNameOrDataset) {
    return OPEN_DATA_RESOURCES[resourceNameOrDataset] ?? resourceNameOrDataset;
}

async function fetchPaginatedRecords(agent, queryOptions) {
    const pageSize = queryOptions.pageSize ?? 100;
    const baseUrl = getOpenDataRecordsUrl(queryOptions);

    let response = agent ? await fetch(baseUrl, { agent }) : await fetch(baseUrl);
    let json = await response.json();

    const data = Array.isArray(json.results) ? [...json.results] : [];
    const totalCount = Number(json.total_count ?? data.length);
    const totalPages = Math.ceil(totalCount / pageSize);

    for (let page = 1; page < totalPages; page++) {
        const pagedUrl = getOpenDataRecordsPageUrl(page * pageSize, queryOptions);
        response = agent ? await fetch(pagedUrl, { agent }) : await fetch(pagedUrl);
        json = await response.json();
        if (Array.isArray(json.results)) {
            data.push(...json.results);
        }
    }

    return data;
}

const stationFetchDAO = {
    async findAllByResource(resourceNameOrDataset, options = {}) {
        try {
            const agent = buildAgent();
            const queryOptions = {
                dataset: resolveDataset(resourceNameOrDataset),
                status: options.status,
                orderBy: options.orderBy,
                limit: options.limit,
                pageSize: options.pageSize
            };

            return await fetchPaginatedRecords(agent, queryOptions);
        } catch (err) {
            console.error("Erreur dans stationFetchDAO :", err.message);
            throw err;
        }
    },

    // findAll retourne parking velos
    async findAll() {
        return this.findAllByResource("parkingVelosDisponibilites");
    }
};

export default stationFetchDAO;
