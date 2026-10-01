// Objectif : montrer qu’une décision incertaine est explicitement envoyée en revue humaine.
import assert from "node:assert/strict";
import { compareCompanyRecord } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const dossier = {
  "id": "revue-1",
  "text": "Une modification est signalée dans le registre, mais les versions avant et après ne permettent pas d’en mesurer la portée.",
  "source": {
    "url": "https://example.test/dossier-ambigu",
    "date": "2026-09-20"
  },
  "details": {
    "origine": "donnée synthétique",
    "signal": "informations incomplètes"
  }
};
const provider = createFakeProvider(() => ({
  model: "jev-1.13.0",
  answers: { decision: {
    type: "choice",
    choice: "insufficient_data",
    probabilities: {
  "material_change": 0.15,
  "administrative_change": 0.15,
  "no_semantic_change": 0.15,
  "insufficient_data": 0.55
},
    confidence: 0.62,
  } },
  usage: { input_tokens: 140, output_tokens: 0 },
}));
const résultat = await compareCompanyRecord(dossier, provider);
assert.equal(résultat.decision, "insufficient_data");
assert.equal(résultat.review, true);
assert.equal(provider.calls, 1);
console.log(`Décision : ${résultat.label} · revue humaine : ${résultat.review} · confiance : ${résultat.confidence}`);
