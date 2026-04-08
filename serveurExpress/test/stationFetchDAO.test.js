import assert from "node:assert";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { it, beforeEach, afterEach } from "node:test";

const originalProxy = process.env.https_proxy;
const originalTlsFlag = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
const daoFilePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../api/dao/stationFetchDAO.mjs");
const expectedBaseUrl = "https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_parking-velos-nantes-metropole-disponibilites/records?where=status%20%3D%20%22Disponible%22&order_by=number&limit=-1";

function mockFetchResponse(payload) {
    return {
        async json() {
            return payload;
        }
    };
}

//mock de fetch pour simuler les résultats pour les comparer par la suite
function createFetchSequence(responses) {
    const calls = [];
    let callIndex = 0;

    return {
        calls,
        fetch: async (url, options) => {
            calls.push({ url, options });
            const response = responses[callIndex++];
            if (response instanceof Error) {
                throw response;
            }
            return mockFetchResponse(response);
        }
    };
}

async function loadStationFetchDAO(mockFetch) {
    const source = await readFile(daoFilePath, "utf8");
    const patchedSource = source
        .replace("import fetch from 'node-fetch';", "const fetch = globalThis.__TEST_FETCH__;")
        .replace("import HttpsProxyAgent from 'https-proxy-agent';", "const HttpsProxyAgent = globalThis.__TEST_HTTPS_PROXY_AGENT__;")
        .replace(
            "import { OPEN_DATA_RESOURCES, getOpenDataRecordsUrl, getOpenDataRecordsPageUrl } from './urlFactory.js';",
            "const { OPEN_DATA_RESOURCES, getOpenDataRecordsUrl, getOpenDataRecordsPageUrl } = globalThis.__TEST_URL_FACTORY__;"
        )
        + `\n// cache-buster: ${Date.now()}-${Math.random()}`;

    globalThis.__TEST_FETCH__ = mockFetch;
    globalThis.__TEST_HTTPS_PROXY_AGENT__ = class HttpsProxyAgentMock {
        constructor(proxy) {
            this.proxy = proxy;
        }
    };
    globalThis.__TEST_URL_FACTORY__ = {
        OPEN_DATA_RESOURCES: {
            parkingVelosDisponibilites: "244400404_parking-velos-nantes-metropole-disponibilites"
        },
        getOpenDataRecordsUrl: () => expectedBaseUrl,
        getOpenDataRecordsPageUrl: (offset) => `${expectedBaseUrl}&offset=${offset}`
    };

    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const consoleCalls = { log: [], error: [] };

    console.log = (...args) => {
        consoleCalls.log.push(args);
    };

    console.error = (...args) => {
        consoleCalls.error.push(args);
    };

    try {
        const moduleUrl = `data:text/javascript;base64,${Buffer.from(patchedSource).toString("base64")}`;
        const module = await import(moduleUrl);
        return {
            stationFetchDAO: module.default,
            consoleCalls,
            restoreConsole() {
                console.log = originalConsoleLog;
                console.error = originalConsoleError;
            }
        };
    } catch (err) {
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
        throw err;
    } finally {
        delete globalThis.__TEST_FETCH__;
        delete globalThis.__TEST_HTTPS_PROXY_AGENT__;
        delete globalThis.__TEST_URL_FACTORY__;
    }
}

beforeEach(() => {
    delete process.env.https_proxy;
    if (originalTlsFlag === undefined) {
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    } else {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalTlsFlag;
    }
});

afterEach(() => {
    if (originalProxy === undefined) {
        delete process.env.https_proxy;
    } else {
        process.env.https_proxy = originalProxy;
    }
    if (originalTlsFlag === undefined) {
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    } else {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalTlsFlag;
    }
});

// DT1(agent = null, total_count = 80)	CT1(DT1, json.results)
it("DT1(agent = null, total_count = 80) CT1(DT1, json.results)", async () => {
    const { fetch: mockFetch, calls } = createFetchSequence([
        { total_count: 80, results: [{ id: 1 }, { id: 2 }] }
    ]);

    const { stationFetchDAO, consoleCalls, restoreConsole } = await loadStationFetchDAO(mockFetch);

    try {
        const data = await stationFetchDAO.findAll();

        assert.deepEqual(data, [{ id: 1 }, { id: 2 }]);
        assert.equal(calls.length, 1);
        assert.equal(calls[0].url, expectedBaseUrl);
        assert.equal(calls[0].options?.agent, undefined);
        assert.equal(process.env.NODE_TLS_REJECT_UNAUTHORIZED, "0");
        assert.ok(consoleCalls.log.some((entry) => entry.join(" ") === "Pas de proxy trouvé"));
        assert.equal(consoleCalls.error.length, 0);
    } finally {
        restoreConsole();
    }
});

// DT2(agent = null, total_count = 350) CT2(DT2, concat(all pages))
it("DT2(agent = null, total_count = 350) CT2(DT2, concat(all pages))", async () => {
    const { fetch: mockFetch, calls } = createFetchSequence([
        { total_count: 350, results: [{ p: 0 }] },
        { results: [{ p: 1 }] },
        { results: [{ p: 2 }] },
        { results: [{ p: 3 }] }
    ]);

    const { stationFetchDAO, consoleCalls, restoreConsole } = await loadStationFetchDAO(mockFetch);

    try {
        const data = await stationFetchDAO.findAll();

        assert.deepEqual(data, [{ p: 0 }, { p: 1 }, { p: 2 }, { p: 3 }]);
        assert.deepEqual(calls.map((call) => call.url), [
            expectedBaseUrl,
            `${expectedBaseUrl}&offset=100`,
            `${expectedBaseUrl}&offset=200`,
            `${expectedBaseUrl}&offset=300`
        ]);
        assert.ok(calls.every((call) => call.options === undefined));
        assert.ok(consoleCalls.log.some((entry) => entry.join(" ") === "Pas de proxy trouvé"));
    } finally {
        restoreConsole();
    }
});

// DT3(agent = null, total_count = 400, erreur_page_suivante = true) CT3(DT3, throw error)
it("DT3(agent = null, total_count = 400, erreur_page_suivante = true) CT3(DT3, throw error)", async () => {
    const { fetch: mockFetch, calls } = createFetchSequence([
        { total_count: 400, results: [{ p: 0 }] },
        new Error("Erreur page suivante")
    ]);

    const { stationFetchDAO, consoleCalls, restoreConsole } = await loadStationFetchDAO(mockFetch);

    try {
        await assert.rejects(stationFetchDAO.findAll(), /Erreur page suivante/);
        assert.deepEqual(calls.map((call) => call.url), [
            expectedBaseUrl,
            `${expectedBaseUrl}&offset=100`
        ]);
        assert.equal(consoleCalls.error.length, 1);
        assert.equal(consoleCalls.error[0][0], "Erreur dans stationFetchDAO :");
        assert.equal(consoleCalls.error[0][1], "Erreur page suivante");
    } finally {
        restoreConsole();
    }
});

// DT4(agent = null, fetch_initial_fail = true) CT4(DT4, throw error)
it("DT4(agent = null, fetch_initial_fail = true) CT4(DT4, throw error)", async () => {
    const { stationFetchDAO, consoleCalls, restoreConsole } = await loadStationFetchDAO(async () => {
        throw new Error("Initial fail");
    });

    try {
        await assert.rejects(stationFetchDAO.findAll(), /Initial fail/);
        assert.equal(consoleCalls.error.length, 1);
        assert.equal(consoleCalls.error[0][0], "Erreur dans stationFetchDAO :");
        assert.equal(consoleCalls.error[0][1], "Initial fail");
    } finally {
        restoreConsole();
    }
});


// DT5(agent != null, total_count = 100) CT5(DT5, json.results)
it("DT5(agent != null, total_count = 100) CT5(DT5, json.results)", async () => {
    process.env.https_proxy = "http://proxy:8080";

    let firstCallOptions;

    const { stationFetchDAO, consoleCalls, restoreConsole } = await loadStationFetchDAO(async (url, options) => {
        assert.equal(url, expectedBaseUrl);
        if (!firstCallOptions) {
            firstCallOptions = options;
        }
        return mockFetchResponse({
            total_count: 100,
            results: [{ id: 1 }]
        });
    });

    try {
        const data = await stationFetchDAO.findAll();

        assert.deepEqual(data, [{ id: 1 }]);
        assert.ok(firstCallOptions?.agent);
        assert.equal(firstCallOptions.agent.proxy, "http://proxy:8080");
        assert.ok(consoleCalls.log.some((entry) => entry.join(" ") === "Le proxy est http://proxy:8080"));
        assert.equal(consoleCalls.error.length, 0);
        assert.equal(process.env.NODE_TLS_REJECT_UNAUTHORIZED, undefined);
    } finally {
        restoreConsole();
    }
});

// DT6(agent != null, total_count = 250) CT6(DT6, concat(all pages))
it("DT6(agent != null, total_count = 250) CT6(DT6, concat(all pages))", async () => {
    process.env.https_proxy = "http://proxy:8080";

    const { fetch: mockFetch, calls } = createFetchSequence([
        { total_count: 250, results: [{ p: 0 }] },
        { results: [{ p: 1 }] },
        { results: [{ p: 2 }] }
    ]);

    const { stationFetchDAO, consoleCalls, restoreConsole } = await loadStationFetchDAO(mockFetch);

    try {
        const data = await stationFetchDAO.findAll();

        assert.deepEqual(data, [{ p: 0 }, { p: 1 }, { p: 2 }]);
        assert.deepEqual(calls.map((call) => call.url), [
            expectedBaseUrl,
            `${expectedBaseUrl}&offset=100`,
            `${expectedBaseUrl}&offset=200`
        ]);
        assert.ok(calls.every((call) => call.options?.agent));
        assert.equal(calls[0].options.agent.proxy, "http://proxy:8080");
        assert.ok(consoleCalls.log.some((entry) => entry.join(" ") === "Le proxy est http://proxy:8080"));
    } finally {
        restoreConsole();
    }
});

//DT7(agent != null, total_count = 300, erreur_page_suivante = true) CT7(DT7, throw error)
it("DT7(agent != null, total_count = 300, erreur_page_suivante = true) CT7(DT7, throw error)", async () => {
    process.env.https_proxy = "http://proxy:8080";

    const { fetch: mockFetch, calls } = createFetchSequence([
        { total_count: 300, results: [{ p: 0 }] },
        new Error("Erreur page suivante")
    ]);

    const { stationFetchDAO, consoleCalls, restoreConsole } = await loadStationFetchDAO(mockFetch);

    try {
        await assert.rejects(stationFetchDAO.findAll(), /Erreur page suivante/);
        assert.deepEqual(calls.map((call) => call.url), [
            expectedBaseUrl,
            `${expectedBaseUrl}&offset=100`
        ]);
        assert.ok(calls.every((call) => call.options?.agent));
        assert.equal(consoleCalls.error.length, 1);
        assert.equal(consoleCalls.error[0][0], "Erreur dans stationFetchDAO :");
        assert.equal(consoleCalls.error[0][1], "Erreur page suivante");
    } finally {
        restoreConsole();
    }
});

// DT8(agent != null, fetch_initial_fail = true) CT8(DT8, throw error)
it("DT8(agent != null, fetch_initial_fail = true) CT8(DT8, throw error)", async () => {
    process.env.https_proxy = "http://proxy:8080";

    const { stationFetchDAO, consoleCalls, restoreConsole } = await loadStationFetchDAO(async () => {
        throw new Error("Initial fail");
    });

    try {
        await assert.rejects(stationFetchDAO.findAll(), /Initial fail/);
        assert.equal(consoleCalls.error.length, 1);
        assert.equal(consoleCalls.error[0][0], "Erreur dans stationFetchDAO :");
        assert.equal(consoleCalls.error[0][1], "Initial fail");
    } finally {
        restoreConsole();
    }
});
