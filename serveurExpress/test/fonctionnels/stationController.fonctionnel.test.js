import assert from "node:assert";
import { beforeEach, afterEach, it } from "node:test";
import request from "supertest";

import app from "../../app.mjs";
import stationController from "../../api/controller/stationController.mjs";

const baseStations = [
    {
        id: 1,
        name: "Hermeland",
        status: "Disponible",
        address: { city: "Nantes" },
        position: { lat: 47.218, lon: -1.553 }
    },
    {
        id: 2,
        name: "Orvault Centre",
        status: "Indisponible",
        address: { city: "Orvault" },
        position: { lat: 47.24, lon: -1.6 }
    },
    {
        id: 3,
        name: "Commerce",
        status: "Disponible",
        address: { city: "Nantes" },
        position: { lat: 47.213, lon: -1.557 }
    }
];

let originalUpdateBD;

beforeEach(() => {
    originalUpdateBD = stationController.updateBD;
});

afterEach(() => {
    stationController.updateBD = originalUpdateBD;
});

it("GET /api/v0/stations -> 200 avec la liste", async () => {
    stationController.updateBD = async () => baseStations;

    const res = await request(app).get("/api/v0/stations");

    assert.equal(res.status, 200);
    assert.equal(res.body.length, 3);
    assert.equal(res.body[0].id, 1);
});

it("GET /api/v0/stations/city/Nantes -> 200 avec stations filtrees", async () => {
    stationController.updateBD = async () => baseStations;

    const res = await request(app).get("/api/v0/stations/city/Nantes");

    assert.equal(res.status, 200);
    assert.equal(res.body.length, 2);
    assert.ok(res.body.every((s) => s.address.city === "Nantes"));
});

it("GET /api/v0/stations/status/Disponible -> 200 avec stations filtrees", async () => {
    stationController.updateBD = async () => baseStations;

    const res = await request(app).get("/api/v0/stations/status/Disponible");

    assert.equal(res.status, 200);
    assert.equal(res.body.length, 2);
    assert.ok(res.body.every((s) => s.status === "Disponible"));
});

it("GET /api/v0/stations/near -> 200 et stations proches triees", async () => {
    stationController.updateBD = async () => baseStations;

    const res = await request(app).get("/api/v0/stations/near?lat=47.218&lon=-1.553&radiusKm=2");

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.length >= 1);
    assert.ok(res.body[0].distanceKm <= 2);
});

it("GET /api/v0/stations/itinerary -> 200 avec trajet direct", async () => {
    const res = await request(app)
        .get("/api/v0/stations/itinerary?latA=47.218&lonA=-1.553&latB=47.230&lonB=-1.617");

    assert.equal(res.status, 200);
    assert.equal(res.body.type, "trajet direct");
    assert.ok(typeof res.body.distanceKm === "number");
});

it("GET /api/v0/stations/1 -> 200 avec une station", async () => {
    stationController.updateBD = async () => baseStations;

    const res = await request(app).get("/api/v0/stations/id/1");

    assert.equal(res.status, 200);
    assert.equal(res.body.id, 1);
});
