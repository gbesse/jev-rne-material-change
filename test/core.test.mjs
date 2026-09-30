// Objectif : vérifier la normalisation, la règle déterministe et la décision sémantique.
import test from "node:test";
import assert from "node:assert/strict";
import { companySnapshot, compareCompanyRecord } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const edge = {
  "id": "limite-1",
  "text": "Cas synthétique traité par une règle déterministe avant toute analyse sémantique.",
  "source": {
    "url": "https://example.test/cas-limite",
    "date": "2026-09-16"
  },
  "beforeText": "Adresse inchangée",
  "afterText": "Adresse inchangée"
};
test("exige une source", () => assert.throws(() => companySnapshot({ id: "x", text: "y" }), /source/));
test("applique le cas limite sans appel Jev", async () => { const provider = createFakeProvider(() => { throw new Error("appel interdit"); }); assert.equal((await compareCompanyRecord(edge, provider)).decision, "no_semantic_change"); assert.equal(provider.calls, 0); });
test("classe un dossier sourcé", async () => { const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "material_change", probabilities: {
  "material_change": 0.85,
  "administrative_change": 0.05,
  "no_semantic_change": 0.05,
  "insufficient_data": 0.05
}, confidence: 0.85 } }, usage: { input_tokens: 10, output_tokens: 0 } })); const result = await compareCompanyRecord({
  "id": "exemple-1",
  "text": "L’objet social passe du conseil informatique à la vente de matériel médical ; le siège reste inchangé.",
  "source": {
    "url": "https://example.test/donnee-source",
    "date": "2026-09-15"
  },
  "details": {
    "territoire": "Commune Exemple",
    "origine": "donnée synthétique"
  }
}, provider); assert.equal(result.decision, "material_change"); assert.equal(result.review, false); });
