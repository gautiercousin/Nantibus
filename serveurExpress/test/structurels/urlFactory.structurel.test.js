import assert from "node:assert/strict";
import { afterEach, it } from "node:test";
import {
    OPEN_DATA_RESOURCES,
    getOpenDataDatasetBaseUrl,
    getOpenDataResourceBaseUrl,
    getOpenDataRecordsUrl,
    getOpenDataRecordsPageUrl,
    getOpenDataRecordsUrlForResource,
    getInternalApiBaseUrl,
    getInternalTransmissionUrl
} from "../../api/dao/urlFactory.js";

const originalIp = process.env.IP;
const originalPort = process.env.PORT;
const originalApiPath = process.env.API_PATH;

afterEach(() => {
    if (originalIp === undefined) {
        delete process.env.IP;
    } else {
        process.env.IP = originalIp;
    }

    if (originalPort === undefined) {
        delete process.env.PORT;
    } else {
        process.env.PORT = originalPort;
    }

    if (originalApiPath === undefined) {
        delete process.env.API_PATH;
    } else {
        process.env.API_PATH = originalApiPath;
    }
});

it("construit l'URL de base OpenData avec le dataset par defaut", () => {
    const url = getOpenDataDatasetBaseUrl();

    assert.equal(
        url,
        "https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_parking-velos-nantes-metropole-disponibilites/"
    );
});

it("construit l'URL records OpenData avec les parametres par defaut", () => {
    const url = new URL(getOpenDataRecordsUrl());

    assert.equal(
        url.origin + url.pathname,
        "https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_parking-velos-nantes-metropole-disponibilites/records"
    );
    assert.equal(url.searchParams.get("where"), "status = \"Disponible\"");
    assert.equal(url.searchParams.get("order_by"), "number");
    assert.equal(url.searchParams.get("limit"), "-1");
});

it("construit l'URL records OpenData avec des parametres custom", () => {
    const url = new URL(
        getOpenDataRecordsUrl({
            dataset: OPEN_DATA_RESOURCES.parkingsPublics,
            status: "Ferme",
            orderBy: "name",
            limit: 50
        })
    );

    assert.equal(
        url.origin + url.pathname,
        "https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_parkings-publics-nantes/records"
    );
    assert.equal(url.searchParams.get("where"), "status = \"Ferme\"");
    assert.equal(url.searchParams.get("order_by"), "name");
    assert.equal(url.searchParams.get("limit"), "50");
});

it("construit l'URL paginee en ajoutant l'offset", () => {
    const url = getOpenDataRecordsPageUrl(200);

    assert.ok(url.includes("offset=200"));
    assert.ok(url.includes("limit=-1"));
});

it("resout une ressource OpenData connue", () => {
    const baseUrl = getOpenDataResourceBaseUrl("infoTraficTan");
    const recordsUrl = getOpenDataRecordsUrlForResource("infoTraficTan", { limit: 10 });

    assert.equal(
        baseUrl,
        "https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_info-trafic-tan-temps-reel/"
    );
    assert.ok(recordsUrl.startsWith(`${baseUrl}records?`));
    assert.ok(recordsUrl.includes("limit=10"));
});

it("leve une erreur sur une ressource OpenData inconnue", () => {
    assert.throws(
        () => getOpenDataResourceBaseUrl("ressourceInconnue"),
        /Ressource OpenData inconnue/
    );

    assert.throws(
        () => getOpenDataRecordsUrlForResource("ressourceInconnue"),
        /Ressource OpenData inconnue/
    );
});

it("construit l'URL interne depuis les variables d'environnement", () => {
    process.env.IP = "127.0.0.1";
    process.env.PORT = "8081";
    process.env.API_PATH = "/api/v0";

    assert.equal(getInternalApiBaseUrl(), "http://127.0.0.1:8081/api/v0");
    assert.equal(getInternalTransmissionUrl(), "http://127.0.0.1:8081/api/v0/transmission");
});

it("construit l'URL interne depuis des options explicites", () => {
    assert.equal(
        getInternalApiBaseUrl({ ip: "localhost", port: "3000", apiPath: "/api/test" }),
        "http://localhost:3000/api/test"
    );

    assert.equal(
        getInternalTransmissionUrl({ ip: "localhost", port: "3000", apiPath: "/api/test" }),
        "http://localhost:3000/api/test/transmission"
    );
});

