import assert from "node:assert";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { it, afterEach } from "node:test";

const daoFilePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../api/dao/transmissionClientDAO.js"
);

// Variables pour sauvegarder les originaux
const originalConsoleError = console.error;
let consoleCalls = [];

// Fonction utilitaire pour créer une réponse fetch mockée
function mockFetchResponse(payload, ok = true, status = 200) {
  return {
    ok,
    status,
    async json() {
      if (payload instanceof Error) {
        throw payload;
      }
      return payload;
    }
  };
}

// Fonction utilitaire pour charger le DAO avec fetch mocké
async function loadTransmissionClientDAO(mockFetch) {
  const source = await readFile(daoFilePath, "utf8");
  
  // Capturer console.error
  const localConsoleCalls = [];
  const mockConsoleError = (...args) => {
    localConsoleCalls.push(args);
  };

  // Remplacer les dépendances par des mocks
  const patchedSource = source
    .replace(
      "import { getInternalTransmissionUrl } from './urlFactory.js';",
      'const getInternalTransmissionUrl = () => "http://test.com/api";'
    )
    .replace(
      '"use strict";',
      '"use strict";\nconst console = { error: globalThis.__TEST_CONSOLE_ERROR__ };'
    )
    + `\nglobalThis.fetch = globalThis.__TEST_FETCH__;\n// cache-buster: ${Date.now()}-${Math.random()}`;

  globalThis.__TEST_FETCH__ = mockFetch;
  globalThis.__TEST_CONSOLE_ERROR__ = mockConsoleError;

  try {
    const moduleUrl = `data:text/javascript;base64,${Buffer.from(patchedSource).toString("base64")}`;
    const module = await import(moduleUrl);
    return {
      transmissionDAO: module.default,
      consoleCalls: localConsoleCalls,
      restoreConsole() {
        console.error = originalConsoleError;
      }
    };
  } finally {
    delete globalThis.__TEST_FETCH__;
    delete globalThis.__TEST_CONSOLE_ERROR__;
  }
}

// Fonction utilitaire pour créer un objet avec référence circulaire
function createCircularObject() {
  const obj = { a: 1 };
  obj.circular = obj;
  return obj;
}

afterEach(() => {
  console.error = originalConsoleError;
});

// DT1(donnees = {a: 1}, fetch 200, response.json() = {confirmation: true}) 
// CT1(DT1, {ok: true, message: "Transmission confirmée"})
it("DT1(donnees = {a: 1}, fetch 200, response.json() = {confirmation: true}) CT1(DT1, {ok: true, message: 'Transmission confirmée'})", async () => {
  let fetchCalled = false;
  let fetchBody = null;

  const { transmissionDAO, restoreConsole } = await loadTransmissionClientDAO(
    async (url, options) => {
      fetchCalled = true;
      fetchBody = options.body;
      return mockFetchResponse({ confirmation: true }, true, 200);
    }
  );

  try {
    const result = await transmissionDAO.envoyerDonnees({ a: 1 });

    assert.deepEqual(result, { ok: true, message: "Transmission confirmée" });
    assert.equal(fetchCalled, true);
    
    // Vérifier que le payload contient timestamp et contenu
    const payload = JSON.parse(fetchBody);
    assert.ok(payload.timestamp);
    assert.equal(typeof payload.timestamp, "number");
    assert.deepEqual(payload.contenu, { a: 1 });
  } finally {
    restoreConsole();
  }
});

// DT2(donnees = null) 
// CT2(DT2, throw TransmissionException("donneesInvalides"))
it("DT2(donnees = null) CT2(DT2, throw TransmissionException('donneesInvalides'))", async () => {
  let fetchCalled = false;

  const { transmissionDAO, restoreConsole } = await loadTransmissionClientDAO(
    async () => {
      fetchCalled = true;
      return mockFetchResponse({ confirmation: true });
    }
  );

  try {
    await assert.rejects(
      transmissionDAO.envoyerDonnees(null),
      (err) => {
        assert.equal(err.name, "TransmissionException");
        assert.equal(err.message, "donneesInvalides");
        return true;
      }
    );

    assert.equal(fetchCalled, false);
    // Note: console.error n'est pas appelé car l'exception est lancée avant le try-catch
  } finally {
    restoreConsole();
  }
});

// DT3(donnees = {}) 
// CT3(DT3, throw TransmissionException("donneesInvalides"))
it("DT3(donnees = {}) CT3(DT3, throw TransmissionException('donneesInvalides'))", async () => {
  let fetchCalled = false;

  const { transmissionDAO, consoleCalls: calls, restoreConsole } = await loadTransmissionClientDAO(
    async () => {
      fetchCalled = true;
      return mockFetchResponse({ confirmation: true });
    }
  );

  try {
    await assert.rejects(
      transmissionDAO.envoyerDonnees({}),
      (err) => {
        assert.equal(err.name, "TransmissionException");
        assert.equal(err.message, "donneesInvalides");
        return true;
      }
    );

    assert.equal(fetchCalled, false);
    assert.ok(calls.some(entry => entry.join(" ").includes("ErreurDonnees")));
  } finally {
    restoreConsole();
  }
});

// DT4(donnees avec reference circulaire provoquant JSON.stringify en erreur) 
// CT4(DT4, throw TransmissionException("erreurSerialisation"))
it("DT4(donnees avec reference circulaire provoquant JSON.stringify en erreur) CT4(DT4, throw TransmissionException('erreurSerialisation'))", async () => {
  let fetchCalled = false;

  const { transmissionDAO, consoleCalls: calls, restoreConsole } = await loadTransmissionClientDAO(
    async () => {
      fetchCalled = true;
      return mockFetchResponse({ confirmation: true });
    }
  );

  try {
    const circularObj = createCircularObject();
    
    await assert.rejects(
      transmissionDAO.envoyerDonnees(circularObj),
      (err) => {
        assert.equal(err.name, "TransmissionException");
        assert.equal(err.message, "erreurSerialisation");
        return true;
      }
    );

    assert.equal(fetchCalled, false);
    assert.ok(calls.some(entry => entry.join(" ").includes("ErreurSerialisation")));
  } finally {
    restoreConsole();
  }
});

// DT5(donnees = {a: 1}, _envoyer provoque timeout reseau) 
// CT5(DT5, throw TransmissionException("erreurTransmission"))
it("DT5(donnees = {a: 1}, _envoyer provoque timeout reseau) CT5(DT5, throw TransmissionException('erreurTransmission'))", async () => {
  const { transmissionDAO, consoleCalls: calls, restoreConsole } = await loadTransmissionClientDAO(
    async () => {
      const error = new Error("The operation was aborted");
      error.name = "AbortError";
      throw error;
    }
  );

  try {
    await assert.rejects(
      transmissionDAO.envoyerDonnees({ a: 1 }),
      (err) => {
        assert.equal(err.name, "TransmissionException");
        assert.equal(err.message, "erreurTransmission");
        return true;
      }
    );

    assert.ok(calls.some(entry => entry.join(" ").includes("ErreurTransmission")));
  } finally {
    restoreConsole();
  }
});

// DT6(donnees = {a: 1}, _envoyer recoit HTTP 500) 
// CT6(DT6, throw TransmissionException("erreurTransmission"))
it("DT6(donnees = {a: 1}, _envoyer recoit HTTP 500) CT6(DT6, throw TransmissionException('erreurTransmission'))", async () => {
  const { transmissionDAO, consoleCalls: calls, restoreConsole } = await loadTransmissionClientDAO(
    async () => {
      return mockFetchResponse({ confirmation: true }, false, 500);
    }
  );

  try {
    await assert.rejects(
      transmissionDAO.envoyerDonnees({ a: 1 }),
      (err) => {
        assert.equal(err.name, "TransmissionException");
        assert.equal(err.message, "erreurTransmission");
        return true;
      }
    );

    // Note: L'erreur HTTP500 est transformée en erreurTransmission dans _envoyer
    // donc console.error affiche "ErreurTransmission" et non "ErreurHTTP"
    assert.ok(calls.some(entry => entry.join(" ").includes("ErreurTransmission")));
  } finally {
    restoreConsole();
  }
});

// DT7(donnees = {a: 1}, _attendreConfirmation provoque erreur JSON) 
// CT7(DT7, throw TransmissionException("erreurSerialisation"))
it("DT7(donnees = {a: 1}, _attendreConfirmation provoque erreur JSON) CT7(DT7, throw TransmissionException('erreurSerialisation'))", async () => {
  const { transmissionDAO, consoleCalls: calls, restoreConsole } = await loadTransmissionClientDAO(
    async () => {
      return mockFetchResponse(new Error("Invalid JSON"), true, 200);
    }
  );

  try {
    await assert.rejects(
      transmissionDAO.envoyerDonnees({ a: 1 }),
      (err) => {
        assert.equal(err.name, "TransmissionException");
        assert.equal(err.message, "erreurSerialisation");
        return true;
      }
    );

    assert.ok(calls.some(entry => entry.join(" ").includes("ErreurSerialisation")));
  } finally {
    restoreConsole();
  }
});

// DT8(donnees = {a: 1}, _attendreConfirmation retourne false) 
// CT8(DT8, throw TransmissionException("timeout"))
it("DT8(donnees = {a: 1}, _attendreConfirmation retourne false) CT8(DT8, throw TransmissionException('timeout'))", async () => {
  const { transmissionDAO, consoleCalls: calls, restoreConsole } = await loadTransmissionClientDAO(
    async () => {
      return mockFetchResponse({ confirmation: false }, true, 200);
    }
  );

  try {
    await assert.rejects(
      transmissionDAO.envoyerDonnees({ a: 1 }),
      (err) => {
        assert.equal(err.name, "TransmissionException");
        assert.equal(err.message, "timeout");
        return true;
      }
    );

    assert.ok(calls.some(entry => entry.join(" ").includes("ErreurTimeout")));
  } finally {
    restoreConsole();
  }
});
