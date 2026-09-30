// Objectif : vérifier que les types publics sont importables.
import { companySnapshot, compareCompanyRecord } from "../src/index.mjs";
const dossier = companySnapshot({
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
});
void compareCompanyRecord(dossier, { decide: async () => ({}) });
