import assert from "node:assert";
import { it } from "node:test";

import {
    checkAttributeType,
    checkRequiredAttributes,
    validateAndAssignOptional,
    validateAndAssignRequired
} from "../../api/model/index.js";

class testException extends Error {
    constructor(message) {
        super(message);
        this.name = "testException";
    }
}

let err =  testException

const cmlToSnk = (str) => {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

it("test passe", async () => {
    let reqAttr = new Map([
        ["cyc_nb_place", "number"],
    ]);
    let obj = {cyc_nb_place : 0};
    try {
        checkRequiredAttributes(obj, reqAttr, err, cmlToSnk)
    }
    catch (e){
        assert.ok(false, e)
        return
    }
    assert.ok(true)
});

it("test erreur", async () => {
    let reqAttr = new Map([
        ["cyc_nb_place", "number"],
    ]);
    let obj = {};
    try {
        checkRequiredAttributes(obj, reqAttr, err, cmlToSnk)
    }
    catch (e){
        if (e instanceof testException){
            assert.ok(true)
            return
        }
    }
    assert.ok(false,"la fonction ne renvoie pas d'erreur")
});


it("test passe 2", async () => {
    let optAttr = new Map([
        ["cyc_nb_place", "number"],
    ]);
    let obj = {cyc_nb_place : 0};
    try {
        validateAndAssignOptional(obj, optAttr, obj, err, cmlToSnk)
    }
    catch (e){
        assert.ok(false, e)
        return
    }
    assert.ok(true)
});

it("test erreur 2", async () => {
    let optAttr = new Map([
        ["cyc_nb_place", "number"],
    ]);
    let obj = {cyc_nb_place : "not a number"};
    let targetInstance = {}

    try {
        validateAndAssignOptional(obj, optAttr, targetInstance, err, cmlToSnk)
    }
    catch (e){
        if (e instanceof testException){
            assert.ok(true)
            return
        }
    }
    assert.ok(false,"la fonction ne renvoie pas d'erreur")
});






it("required - passe avec type primitif", async () => {
    let reqAttr = new Map([
        ["cycNbPlace", "number"],
    ]);
    let obj = { cyc_nb_place: 4 };
    let targetInstance = {};

    try {
        validateAndAssignRequired(obj, reqAttr, targetInstance, testException, cmlToSnk);
    } catch (e) {
        assert.ok(false, e);
        return;
    }

    assert.strictEqual(targetInstance.cycNbPlace, 4);
});


it("required - erreur type primitif", async () => {
    let reqAttr = new Map([
        ["cycNbPlace", "number"],
    ]);
    let obj = { cyc_nb_place: "pas un nombre" };
    let targetInstance = {};

    try {
        validateAndAssignRequired(obj, reqAttr, targetInstance, testException, cmlToSnk);
    } catch (e) {
        if (e instanceof testException) {
            assert.ok(true);
            return;
        }
    }

    assert.ok(false, "la fonction ne renvoie pas d'erreur");
});


it("required - passe avec classe", async () => {
    class Dummy {
        constructor(value) {
            this.value = value;
        }
    }

    let reqAttr = new Map([
        ["position", Dummy],
    ]);

    let obj = { position: { x: 1 } };
    let targetInstance = {};

    try {
        validateAndAssignRequired(obj, reqAttr, targetInstance, testException, cmlToSnk);
    } catch (e) {
        assert.ok(false, e);
        return;
    }

    assert.ok(targetInstance.position instanceof Dummy);
});


it("required - erreur classe", async () => {
    class Dummy {
        constructor(value) {
            throw new Error("fail constructeur");
        }
    }

    let reqAttr = new Map([
        ["position", Dummy],
    ]);

    let obj = { position: { x: 1 } };
    let targetInstance = {};

    try {
        validateAndAssignRequired(obj, reqAttr, targetInstance, testException, cmlToSnk);
    } catch (e) {
        if (e instanceof testException) {
            assert.ok(true);
            return;
        }
    }

    assert.ok(false, "la fonction ne renvoie pas d'erreur");
});


it("required - erreur si valeur absente", async () => {
    let reqAttr = new Map([
        ["cycNbPlace", "number"],
    ]);

    let obj = {}; // champ absent
    let targetInstance = {};

    try {
        validateAndAssignRequired(obj, reqAttr, targetInstance, testException, cmlToSnk);
    } catch (e) {
        if (e instanceof testException) {
            assert.ok(true);
            return;
        }
    }

    assert.ok(false, "la fonction ne renvoie pas d'erreur");
});

class Dummy {}


it("checkAttributeType - passe avec string", () => {
    assert.doesNotThrow(() => {
        checkAttributeType("hello", "string", "field", testException);
    });
});

it("checkAttributeType - erreur string", () => {
    assert.throws(() => {
        checkAttributeType(123, "string", "field", testException);
    }, testException);
});

it("checkAttributeType - passe avec number", () => {
    assert.doesNotThrow(() => {
        checkAttributeType(42, "number", "field", testException);
    });
});

it("checkAttributeType - erreur number", () => {
    assert.throws(() => {
        checkAttributeType("42", "number", "field", testException);
    }, testException);
});

it("checkAttributeType - passe avec boolean", () => {
    assert.doesNotThrow(() => {
        checkAttributeType(true, "boolean", "field", testException);
    });
});

it("checkAttributeType - erreur boolean", () => {
    assert.throws(() => {
        checkAttributeType("true", "boolean", "field", testException);
    }, testException);
});

it("checkAttributeType - passe avec array", () => {
    assert.doesNotThrow(() => {
        checkAttributeType([1,2,3], "array", "field", testException);
    });
});

it("checkAttributeType - erreur array", () => {
    assert.throws(() => {
        checkAttributeType("not array", "array", "field", testException);
    }, testException);
});

it("checkAttributeType - passe avec object", () => {
    assert.doesNotThrow(() => {
        checkAttributeType({a:1}, "object", "field", testException);
    });
});

it("checkAttributeType - erreur object null", () => {
    assert.throws(() => {
        checkAttributeType(null, "object", "field", testException);
    }, testException);
});

it("checkAttributeType - erreur object array", () => {
    assert.throws(() => {
        checkAttributeType([1,2], "object", "field", testException);
    }, testException);
});

it("checkAttributeType - erreur object primitive", () => {
    assert.throws(() => {
        checkAttributeType(42, "object", "field", testException);
    }, testException);
});

it("checkAttributeType - passe avec classe instance", () => {
    assert.doesNotThrow(() => {
        checkAttributeType(new Dummy(), Dummy, "field", testException);
    });
});

it("checkAttributeType - erreur classe mauvaise instance", () => {
    assert.throws(() => {
        checkAttributeType({}, Dummy, "field", testException);
    }, testException);
});