import assert from "node:assert";
import { it } from "node:test";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const controllerFilePath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../api/controller/stationController.mjs"
);

function createRes() {
    return {
        statusCode: null,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(payload) {
            this.body = payload;
            return this;
        }
    };
}

async function loadController(findAllImpl) {
    const source = await readFile(controllerFilePath, "utf8");
    const patchedSource = source.replace(
        "import recuperationTraitementDAO from \"../dao/recuperationTraitementDAO.js\";",
        "const recuperationTraitementDAO = globalThis.__TEST_RECUP_DAO__;"
    ) + `\n// cache-buster: ${Date.now()}-${Math.random()}`;

    globalThis.__TEST_RECUP_DAO__ = { findAll: findAllImpl };

    try {
        const moduleUrl = `data:text/javascript;base64,${Buffer.from(patchedSource).toString("base64")}`;
        const module = await import(moduleUrl);
        return module.default;
    } finally {
        delete globalThis.__TEST_RECUP_DAO__;
    }
}

it("updateBD -> utilise le cache entre deux appels rapproches", async () => {
    let calls = 0;
    const controller = await loadController(async () => {
        calls += 1;
        return [{ id: 1 }, { id: 2 }];
    });

    const first = await controller.updateBD();
    const second = await controller.updateBD();

    assert.deepEqual(first, [{ id: 1 }, { id: 2 }]);
    assert.deepEqual(second, [{ id: 1 }, { id: 2 }]);
    assert.equal(calls, 1);
});

it("getStations -> branche 200 puis 502 si updateBD echoue", async () => {
    const controllerOk = await loadController(async () => [
        { id: 1, name: "Hermeland" }
    ]);
    const resOk = createRes();
    await controllerOk.getStations({}, resOk);
    assert.equal(resOk.statusCode, 200);
    assert.equal(resOk.body.length, 1);

    const controllerKo = await loadController(async () => {
        throw new Error("DAO KO");
    });
    const resKo = createRes();
    await controllerKo.getStations({}, resKo);
    assert.equal(resKo.statusCode, 502);
    assert.equal(resKo.body.message, "DAO KO");
});

it("getStationsByCity -> filtre et normalise la casse", async () => {
    const controller = await loadController(async () => [
        { id: 1, address: { city: "Nantes" } },
        { id: 2, address: { city: "Orvault" } },
        { id: 3, address: { city: "Nantes" } }
    ]);

    const res = createRes();
    await controller.getStationsByCity({ params: { city: "nAnTeS" } }, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.length, 2);
    assert.ok(res.body.every((s) => s.address.city === "Nantes"));
});

it("getStationsByCity -> branche 400 si city vide et [] si ville absente", async () => {
    const controller = await loadController(async () => [
        { id: 1, address: { city: "Nantes" } }
    ]);

    const resBad = createRes();
    await controller.getStationsByCity({ params: { city: "   " } }, resBad);
    assert.equal(resBad.statusCode, 400);
    assert.equal(resBad.body.message, "Ville invalide");

    const resEmpty = createRes();
    await controller.getStationsByCity({ params: { city: "Paris" } }, resEmpty);
    assert.equal(resEmpty.statusCode, 200);
    assert.deepEqual(resEmpty.body, []);
});

it("getStationsByStatus -> filtre et normalise la casse", async () => {
    const controller = await loadController(async () => [
        { id: 1, status: "Disponible" },
        { id: 2, status: "indisponible" },
        { id: 3, status: "DISPONIBLE" }
    ]);

    const res = createRes();
    await controller.getStationsByStatus({ params: { status: "disponible" } }, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.length, 2);
    assert.ok(res.body.every((s) => s.status.toLowerCase() === "disponible"));
});

it("getStationsByStatus -> branche 400 si status vide", async () => {
    const controller = await loadController(async () => []);
    const res = createRes();
    await controller.getStationsByStatus({ params: { status: "" } }, res);
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.message, "Status invalide");
});

it("getStationsNear -> branche 400 si geo invalide", async () => {
    const controller = await loadController(async () => []);
    const res = createRes();
    await controller.getStationsNear({ query: { lat: "abc", lon: "1", radiusKm: "2" } }, res);
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.message, "Paramètres géographiques invalides");
});

it("getStationsNear -> calcule distance, filtre et trie", async () => {
    const controller = await loadController(async () => [
        { id: 1, position: { lat: 47.218, lon: -1.553 } },
        { id: 2, position: { lat: 47.228, lon: -1.553 } },
        { id: 3, position: { lat: null, lon: -1.553 } }
    ]);

    const res = createRes();
    await controller.getStationsNear({ query: { lat: "47.218", lon: "-1.553", radiusKm: "2" } }, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.length, 2);
    assert.deepEqual(res.body.map((s) => s.id), [1, 2]);
    assert.equal(res.body[0].distanceKm, 0);
    assert.ok(res.body[1].distanceKm > 1.1 && res.body[1].distanceKm < 1.2);
});

it("getStationsNear -> borne rayon invalide", async () => {
    const controller = await loadController(async () => []);
    const res = createRes();
    await controller.getStationsNear({ query: { lat: "47.218", lon: "-1.553", radiusKm: "0" } }, res);
    assert.equal(res.statusCode, 400);
});

it("getItineraryBetweenPoints -> branche 400 si coordonnees invalides", async () => {
    const controller = await loadController(async () => []);
    const res = createRes();
    await controller.getItineraryBetweenPoints({ query: { latA: "abc", lonA: "-1.553", latB: "47.230", lonB: "-1.617" } }, res);
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.message, "Paramètres géographiques invalides");
});

it("getItineraryBetweenPoints -> distance et payload verifies", async () => {
    const controller = await loadController(async () => []);
    const res = createRes();
    await controller.getItineraryBetweenPoints({ query: { latA: "47.218", lonA: "-1.553", latB: "47.230", lonB: "-1.617" } }, res);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body.pointA, { lat: 47.218, lon: -1.553 });
    assert.deepEqual(res.body.pointB, { lat: 47.23, lon: -1.617 });
    assert.equal(res.body.type, "trajet direct");
    assert.equal(res.body.distanceKm, 5.014);
});

it("getItineraryBetweenPoints -> borne longitude 180 valide et 181 invalide", async () => {
    const controller = await loadController(async () => []);
    const resOk = createRes();
    await controller.getItineraryBetweenPoints({ query: { latA: "0", lonA: "180", latB: "1", lonB: "180" } }, resOk);
    assert.equal(resOk.statusCode, 200);

    const resKo = createRes();
    await controller.getItineraryBetweenPoints({ query: { latA: "0", lonA: "181", latB: "1", lonB: "0" } }, resKo);
    assert.equal(resKo.statusCode, 400);
    assert.equal(resKo.body.message, "Paramètres géographiques invalides");
});

it("getStationById -> branche 400, 404 et 200", async () => {
    const controller = await loadController(async () => [
        { id: 1, name: "Hermeland" },
        { id: 2, name: "Orvault Centre" }
    ]);

    const resBad = createRes();
    await controller.getStationById({ params: { id: "abc" } }, resBad);
    assert.equal(resBad.statusCode, 400);
    assert.equal(resBad.body.message, "ID station invalide");

    const res404 = createRes();
    await controller.getStationById({ params: { id: "999" } }, res404);
    assert.equal(res404.statusCode, 404);
    assert.equal(res404.body.message, "Station introuvable");

    const res200 = createRes();
    await controller.getStationById({ params: { id: "1" } }, res200);
    assert.equal(res200.statusCode, 200);
    assert.equal(res200.body.id, 1);
    assert.equal(res200.body.name, "Hermeland");
});
