"use strict"

import assert from "node:assert";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { it, afterEach } from "node:test";

const daoFilePath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../api/dao/recuperationTraitementDAO.js"
);

const originalStringify = JSON.stringify;

// Mock de la classe Station avec validation
class MockStation {
    constructor(obj) {
        // Valider que l'id est un nombre valide (pas NaN)
        if (!Number.isFinite(obj.id)) {
            throw new Error("Invalid id");
        }
        // Valider que les attributs requis sont présents et du bon type
        if (obj.position === null || obj.position === undefined || 
            obj.position.lat === undefined || obj.position.lon === undefined) {
            throw new Error("Invalid position");
        }
        
        this.id = obj.id;
        this.name = obj.name;
        this.status = obj.status;
        this.address = obj.address;
        this.capacity = obj.capacity;
        this.availableSpots = obj.availableSpots;
        this.position = obj.position;
    }
}

// Mock de la classe ParkingVelosDisponibilites avec validation
class MockParkingVelosDisponibilites {
    constructor(obj) {
        // Valider que les attributs requis sont présents
        if (!obj.number || !obj.name || !obj.geometrie) {
            throw new Error("Invalid ParkingVelosDisponibilites");
        }
        if (!obj.geometrie.lat || !obj.geometrie.lon) {
            throw new Error("Invalid geometrie");
        }
        
        // Assigner tous les attributs
        Object.assign(this, obj);
    }
}

async function loadRecuperationTraitementDAO({ mockData }) {
    const source = await readFile(daoFilePath, "utf8");
    
    const patchedSource = source
        .replace(
            "import Station from \"../model/Station.js\";",
            "const Station = globalThis.__TEST_STATION__;"
        )
        .replace(
            "import stationFetchDAO from \"./stationFetchDAO.mjs\";",
            "const stationFetchDAO = globalThis.__TEST_STATION_FETCH_DAO__;"
        ) + `\n// Cache-buster: ${Date.now()}-${Math.random()}`;

    globalThis.__TEST_STATION__ = MockStation;
    
    globalThis.__TEST_STATION_FETCH_DAO__ = {
        findAllByResource: mockData
    };

    try {
        const moduleUrl = `data:text/javascript;base64,${Buffer.from(patchedSource).toString("base64")}`;
        const module = await import(moduleUrl);
        return module.default;
    } finally {
        delete globalThis.__TEST_STATION__;
        delete globalThis.__TEST_STATION_FETCH_DAO__;
    }
}

afterEach(() => {
    JSON.stringify = originalStringify;
});


it("CT1(DT1(fetch_ok = true, data_array_ok = true, station_valide = true)) -> Stations", async () => {
    const mockData = async () => [
        {
            number: "1",
            name: "Station Centre",
            status: "Disponible",
            address: "Place Royale",
            zipcode: "44000",
            city: "Nantes",
            capacity: 20,
            availablespots: 5,
            geometrie: { lat: 47.2134, lon: -1.5491 }
        },
        {
            number: "2",
            name: "Station Gare",
            status: "Disponible",
            address: "Place de la Gare",
            zipcode: "44000",
            city: "Nantes",
            capacity: 30,
            availablespots: 15,
            geometrie: { lat: 47.1234, lon: -1.4567 }
        }
    ];

    const recuperationTraitementDAO = await loadRecuperationTraitementDAO({ mockData });
    const stations = await recuperationTraitementDAO.findAll();

    assert.strictEqual(stations.length, 2);
    assert.strictEqual(stations[0].id, 1);
    assert.strictEqual(stations[0].name, "Station Centre");
    assert.strictEqual(stations[0].capacity, 20);
    assert.strictEqual(stations[0].availableSpots, 5);
    assert.strictEqual(stations[1].id, 2);
    assert.strictEqual(stations[1].availableSpots, 15);
});

it("CT2(DT2(fetch_ok = false)) -> Error", async () => {
    const mockData = async () => {
        throw new Error("Erreur réseau lors de la requête API");
    };

    const recuperationTraitementDAO = await loadRecuperationTraitementDAO({ mockData });

    try {
        await recuperationTraitementDAO.findAll();
        assert.fail("Une jetée d'exception aurait dû avoir lieu");
    } catch (e) {
        assert.strictEqual(e.message, "Erreur réseau lors de la requête API");
    }
});

it("CT3(DT3(fetch_ok = true, data_array_ok = false)) -> Error", async () => {
    const mockData = async () => "not an array";

    const recuperationTraitementDAO = await loadRecuperationTraitementDAO({ mockData });

    try {
        await recuperationTraitementDAO.findAll();
        assert.fail("Une jetée d'exception aurait dû avoir lieu");
    } catch (e) {
        assert.strictEqual(e.message, "Données incohérentes");
    }
});

it("CT4(DT4(fetch_ok = true, data_array_ok = true, station_valide = false)) -> Error", async () => {
    const mockData = async () => [{
        number: "1",
        name: "Station 1",
        status: "Disponible",
        address: "123 rue Test",
        zipcode: "44000",
        city: "Nantes",
        capacity: 20,
        availablespots: 5,
        geometrie: { lat: 47.2 }
    }];

    const recuperationTraitementDAO = await loadRecuperationTraitementDAO({ mockData });

    try {
        await recuperationTraitementDAO.findAll();
        assert.fail("Une jetée d'exception aurait dû avoir lieu");
    } catch (e) {
        assert.strictEqual(e.message, "Erreur dans les données reçues");
    }
});
