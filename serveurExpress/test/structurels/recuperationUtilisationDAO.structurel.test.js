import assert from "node:assert";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { it, afterEach } from "node:test";

const daoFilePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../api/dao/recuperationUtilisationDAO.js"
);

const originalStringify = JSON.stringify;

async function loadRecuperationUtilisationDAO({ findAll, envoyerDonnees }) {
  const source = await readFile(daoFilePath, "utf8");
  const patchedSource =
    source
      .replace(
        "import transmissionClientDAO from './transmissionClientDAO.js';",
        "const transmissionClientDAO = globalThis.__TEST_TRANSMISSION_CLIENT_DAO__;"
      )
      .replace(
        "import recuperationTraitementDAO from './recuperationTraitementDAO.js';",
        "const recuperationTraitementDAO = globalThis.__TEST_RECUP_TRAITEMENT_DAO__;"
      ) + `\n// cache-buster: ${Date.now()}-${Math.random()}`;

  globalThis.__TEST_TRANSMISSION_CLIENT_DAO__ = {
    envoyerDonnees,
  };

  globalThis.__TEST_RECUP_TRAITEMENT_DAO__ = {
    findAll,
  };

  try {
    const moduleUrl = `data:text/javascript;base64,${Buffer.from(patchedSource).toString("base64")}`;
    const module = await import(moduleUrl);
    return module.default;
  } finally {
    delete globalThis.__TEST_TRANSMISSION_CLIENT_DAO__;
    delete globalThis.__TEST_RECUP_TRAITEMENT_DAO__;
  }
}

afterEach(() => {
  JSON.stringify = originalStringify;
});

// DT1(findAll_ok = true, stringify_ok = true, envoyer_ok = true, confirmation_ok = true) CT1(DT1, return donnees)
it("DT1(findAll_ok = true, stringify_ok = true, envoyer_ok = true, confirmation_ok = true) CT1(DT1, return donnees)", async () => {
  const donnees = [{ id: 1 }, { id: 2 }];
  const payloads = [];

  const recuperationUtilisationDAO = await loadRecuperationUtilisationDAO({
    findAll: async () => donnees,
    envoyerDonnees: async (payload) => {
      payloads.push(payload);
      return { ok: true };
    },
  });

  const result = await recuperationUtilisationDAO.envoyerRequete();

  assert.deepEqual(result, donnees);
  assert.equal(payloads.length, 1);
  assert.equal(payloads[0].source, "recuperationUtilisation");
  assert.equal(typeof payloads[0].timestamp, "number");
  assert.equal(payloads[0].data, JSON.stringify(donnees));
});

// DT2(findAll_ok = false) CT2(DT2, Erreur de reseau lors de la recuperation des donnees)
it("DT2(findAll_ok = false) CT2(DT2, Erreur de reseau lors de la recuperation des donnees)", async () => {
  let envoyerCalled = false;

  const recuperationUtilisationDAO = await loadRecuperationUtilisationDAO({
    findAll: async () => {
      throw new Error("fetch fail");
    },
    envoyerDonnees: async () => {
      envoyerCalled = true;
      return { ok: true };
    },
  });

  await assert.rejects(
    recuperationUtilisationDAO.envoyerRequete(),
    /Erreur de réseau lors de la récupération des données/
  );

  assert.equal(envoyerCalled, false);
});

// DT3(findAll_ok = true, stringify_ok = false) CT3(DT3, Le format des donnees recues est invalide)
it("DT3(findAll_ok = true, stringify_ok = false) CT3(DT3, Le format des donnees recues est invalide)", async () => {
  const donnees = [{ id: 1 }];
  let envoyerCalled = false;
  JSON.stringify = () => {
    throw new Error("stringify fail");
  };

  const recuperationUtilisationDAO = await loadRecuperationUtilisationDAO({
    findAll: async () => donnees,
    envoyerDonnees: async () => {
      envoyerCalled = true;
      return { ok: true };
    },
  });

  await assert.rejects(
    recuperationUtilisationDAO.envoyerRequete(),
    /Le format des données reçues est invalide/
  );

  assert.equal(envoyerCalled, false);
});

// DT4(findAll_ok = true, stringify_ok = true, envoyer_ok = false) CT4(DT4, Les donnees recues sont invalides ou incompletes)
it("DT4(findAll_ok = true, stringify_ok = true, envoyer_ok = false) CT4(DT4, Les donnees recues sont invalides ou incompletes)", async () => {
  const donnees = [{ id: 1 }];

  const recuperationUtilisationDAO = await loadRecuperationUtilisationDAO({
    findAll: async () => donnees,
    envoyerDonnees: async () => {
      throw new Error("transmission fail");
    },
  });

  await assert.rejects(
    recuperationUtilisationDAO.envoyerRequete(),
    /Les données reçues sont invalides ou incomplètes/
  );
});

// DT5(findAll_ok = true, stringify_ok = true, envoyer_ok = true, confirmation_ok = false) CT5(DT5, Les donnees recues sont invalides ou incompletes)
it("DT5(findAll_ok = true, stringify_ok = true, envoyer_ok = true, confirmation_ok = false) CT5(DT5, Les donnees recues sont invalides ou incompletes)", async () => {
  const donnees = [{ id: 1 }];

  const recuperationUtilisationDAO = await loadRecuperationUtilisationDAO({
    findAll: async () => donnees,
    envoyerDonnees: async () => ({ ok: false }),
  });

  await assert.rejects(
    recuperationUtilisationDAO.envoyerRequete(),
    /Les données reçues sont invalides ou incomplètes/
  );
});

