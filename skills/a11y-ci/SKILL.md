---
name: a11y-ci
description: >-
  Aggiunge test di accessibilità automatici a un progetto frontend e li mette
  in pipeline, così le regressioni si fermano prima del rilascio: jest-axe o
  vitest-axe per i componenti, Playwright o Cypress con axe per le pagine e gli
  stati, e i job per GitHub Actions o Azure DevOps. Usala quando l'utente
  chiede "test di accessibilità automatici", "axe in CI", "jest-axe",
  "cypress-axe", "bloccare le PR non accessibili", o dopo /a11y-correggi per
  non perdere le correzioni.
---

# a11y-ci

Un sito si rompe di nuovo il mese dopo l'audit, quando qualcuno aggiunge un
bottone icona senza nome. I test in pipeline non rendono accessibile niente, ma
**impediscono di tornare indietro** su quello che si può controllare in
automatico. Dillo all'utente con queste parole: un test verde non è una
dichiarazione di conformità.

## Prima guarda il progetto

Leggi `package.json`, la configurazione dei test e la pipeline che c'è già.
Adatta, non imporre: se usano Vitest non aggiungere Jest, se hanno Cypress non
aggiungere Playwright. Chiedi solo se manca del tutto un framework E2E.

## Livello 1: componenti

Con Jest:

```bash
npm i -D jest-axe @types/jest-axe
```

```tsx
// src/components/__tests__/a11y.test.tsx
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { CampoCodiceFiscale } from "../CampoCodiceFiscale";

expect.extend(toHaveNoViolations);

const WCAG21AA = { runOnly: { type: "tag" as const, values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] } };

it("CampoCodiceFiscale con errore non ha violazioni WCAG 2.1 AA", async () => {
  const { container } = render(<CampoCodiceFiscale errore="Servono 16 caratteri" />);
  expect(await axe(container, WCAG21AA)).toHaveNoViolations();
});
```

Con Vitest: `vitest-axe`, stessa forma. In jsdom il contrasto dei colori non si
può calcolare: axe lo salta. Il contrasto si controlla al livello 2.

Testa **ogni stato** che cambia il markup: chiuso e aperto, vuoto e con errore,
caricamento. È lì che stanno i problemi.

Affianca a axe qualche asserzione esplicita con Testing Library, che documenta
il comportamento atteso meglio di qualsiasi regola:

```tsx
await user.click(screen.getByRole("button", { name: "Invia" }));
expect(screen.getByRole("textbox", { name: "Codice fiscale" })).toHaveFocus();
expect(screen.getByRole("status")).toHaveTextContent("Controlla i campi evidenziati");
```

Se una query `getByRole` con il nome non trova l'elemento, spesso il problema
di accessibilità è già lì.

## Livello 2: pagine e stati, nel browser

Con Playwright:

```bash
npm i -D @axe-core/playwright
```

```ts
// e2e/a11y.spec.ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const TAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];
const PAGINE = ["/", "/servizi", "/notizie", "/cerca?q=tari"];

for (const percorso of PAGINE) {
  test(`${percorso} senza violazioni WCAG 2.1 AA`, async ({ page }) => {
    await page.goto(percorso);
    const r = await new AxeBuilder({ page }).withTags(TAG).analyze();
    expect(r.violations, JSON.stringify(r.violations.map((v) => [v.id, v.nodes.length]))).toEqual([]);
  });
}

test("il modale di conferma è accessibile e gestisce il focus", async ({ page }) => {
  await page.goto("/istanze/nuova");
  const apri = page.getByRole("button", { name: "Invia istanza" });
  await apri.click();
  const modale = page.getByRole("dialog", { name: "Conferma invio" });
  await expect(modale).toBeVisible();
  const r = await new AxeBuilder({ page }).include('[role="dialog"], dialog').withTags(TAG).analyze();
  expect(r.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(apri).toBeFocused();
});

test("reflow: nessuno scorrimento orizzontale a 320 px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  const scorre = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(scorre).toBe(false);
});
```

Con Cypress: `cypress-axe` e `cy.checkA11y(null, { runOnly: { type: "tag",
values: [...] } })`, stessa logica.

## Gestire il debito

Su un progetto esistente la prima esecuzione avrà errori. Non spegnere le
regole per farla passare. Due strade oneste:

1. **Baseline**: salva le violazioni attuali in un file, fai fallire il test
   solo per violazioni **nuove**. Il file si accorcia a ogni correzione e si
   versiona, così si vede il debito scendere.
2. **Eccezioni puntuali**: `exclude` su un selettore preciso con un commento
   che dice criterio, motivo e chi lo sistema. Mai `disableRules` globale senza
   una data di scadenza scritta accanto.

## In pipeline

GitHub Actions:

```yaml
# .github/workflows/accessibilita.yml
name: Accessibilità
on: [pull_request]
jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npx playwright test e2e/a11y.spec.ts
      - if: failure()
        uses: actions/upload-artifact@v4
        with: { name: report-a11y, path: playwright-report }
```

Azure DevOps:

```yaml
# azure-pipelines.yml (estratto)
- task: NodeTool@0
  inputs: { versionSpec: "22.x" }
- script: npm ci && npx playwright install --with-deps chromium
- script: npm run build && npx playwright test e2e/a11y.spec.ts --reporter=junit
  env: { PLAYWRIGHT_JUNIT_OUTPUT_NAME: results/a11y.xml }
- task: PublishTestResults@2
  condition: always()
  inputs: { testResultsFiles: results/a11y.xml, testRunTitle: Accessibilità }
```

Controlla le versioni delle action e dei task nel repo dell'utente prima di
copiarle: usa quelle che il progetto ha già.

## Output

1. I file creati o modificati, con il comando per lanciarli in locale.
2. Il risultato della prima esecuzione, se puoi lanciarla: quante violazioni,
   su quali criteri.
3. Una riga su cosa questi test **non** coprono, con il rimando a
   `/a11y-test-manuale`.
