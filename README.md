# A11y Agent Italia

Sette skill per Claude che portano un sito o un'app **alla conformità di
accessibilità richiesta in Italia**: Legge 4/2004 per la PA e le grandi
imprese, European Accessibility Act per e-commerce, banche, trasporti e gli
altri servizi del D.Lgs. 82/2022.

Gratis, licenza MIT, niente da collegare. Funziona su React, TypeScript, HTML,
Vue, con o senza Bootstrap Italia.

Una fa l'audit del codice e delle pagine contro i 50 criteri WCAG 2.1 AA, con
uno script che lancia axe-core e scrive il report in italiano, criterio per
criterio. Una corregge, partendo dai problemi bloccanti. Una ti guida nei test
con tastiera e screen reader che nessuno strumento può fare. Una mette i test in
pipeline, così le correzioni restano. Una prepara la dichiarazione di
accessibilità per il form AgID, o le informazioni richieste dall'EAA.

**Nessuna skill dichiara "conforme" una pagina perché la scansione è pulita.**
Una scansione automatica trova solo una parte dei problemi: in
[`esempi/`](esempi/cosa-sfugge-alla-scansione.md) c'è una pagina di un Comune
immaginario dove axe ne trova 5 e l'analisi del codice altri 12, tre dei quali
bloccano chi usa la tastiera.

## Perché una versione italiana

Gli strumenti di accessibilità parlano di WCAG, che valgono ovunque. Ma chi
lavora per la PA o per un'azienda italiana deve sapere anche:

- quale regime si applica (PA, grandi imprese sopra i 500 milioni, servizi EAA,
  o più di uno insieme);
- che cosa chiedono le Linee guida AgID e le schede di controllo del 2026;
- come si compila la dichiarazione sul form AgID entro il 23 settembre e gli
  obiettivi entro il 31 marzo;
- come si usano bene Bootstrap Italia e design-react-kit, e dove si rompono;
- che il codice fiscale non ha un token `autocomplete`, che "login" non vuole
  `lang="en"`, che un PDF dell'albo pretorio è un documento da rendere
  accessibile anche lui.

Queste skill lo sanno, con le fonti e la data dell'ultimo aggiornamento.

## Le skill

| comando | cosa fa |
| --- | --- |
| `/a11y-audit` | Audit di codice e pagine contro WCAG 2.1 AA. Script di scansione con report in italiano e controllo del reflow a 320 px, più analisi statica dei componenti. Gravità misurata su chi resta bloccato. |
| `/a11y-correggi` | Correzioni concrete per React e HTML: elementi cliccabili, moduli, errori, modali, SPA, focus, contrasto, tabelle, messaggi di stato. Prima l'HTML nativo, poi ARIA. |
| `/a11y-test-manuale` | Test guidati con tastiera, NVDA, VoiceOver, TalkBack, zoom e reflow. Registra gli esiti come evidenze per le schede di controllo. |
| `/a11y-ci` | jest-axe, vitest-axe, Playwright o Cypress con axe, e i job per GitHub Actions e Azure DevOps. Con una strategia per il debito che non spegne le regole. |
| `/a11y-dichiarazione` | Capisce il regime, prepara la dichiarazione di accessibilità, gli obiettivi annuali, le informazioni EAA, il meccanismo di feedback e l'eventuale onere sproporzionato. |
| `/a11y-design-italia` | Bootstrap Italia e design-react-kit: contrasto dei temi personalizzati, icone dello sprite, migrazione dalla versione 1 alla 2, componenti rifatti in casa. |
| `/a11y-wcag22` | Gap analysis verso le WCAG 2.2 adottate dalla EN 301 549 v4.1.1: i sei criteri nuovi, dove cercarli, quanto costa sistemarli. |

## Installazione

Incolla questo in Claude:

```
https://github.com/JacopoMarini/a11y-agent-italia

Installa queste skill, poi lancia /a11y-audit sul file esempi/pagina-con-errori.html.
```

Oppure da solo, in Claude Code:

```bash
git clone https://github.com/JacopoMarini/a11y-agent-italia.git
cp -r a11y-agent-italia/skills/a11y-* ~/.claude/skills/
```

Oppure come plugin:

```
/plugin marketplace add JacopoMarini/a11y-agent-italia
/plugin install a11y-agent-italia
```

Copia sempre tutte le cartelle insieme: alcune skill leggono i file delle altre.

### Lo script di scansione

Serve Node 18 o successivo:

```bash
npm i -D playwright axe-core && npx playwright install chromium
node ~/.claude/skills/a11y-audit/scansiona.mjs http://localhost:3000 --out report-a11y
```

Opzioni: `--wcag22` aggiunge le regole delle WCAG 2.2, `--no-reflow` salta il
controllo a 320 px. Se Chromium di Playwright non si scarica, lo script prova il
Chrome installato nel sistema, oppure il percorso in `CHROME_PATH`. Esce con
codice 1 se trova violazioni.

## Il quadro normativo, in breve

Aggiornato al 9 novembre 2026. Il dettaglio, con le fonti, è in
[`skills/a11y-dichiarazione/riferimenti.md`](skills/a11y-dichiarazione/riferimenti.md).

- **Riferimento tecnico oggi**: WCAG 2.1 livelli A e AA, tramite la EN 301 549
  v3.2.1. Vale sia per la PA sia per i servizi EAA.
- **PA**: dichiarazione di accessibilità su form.agid.gov.it entro il 23
  settembre, per ogni sito e app; obiettivi di accessibilità entro il 31 marzo.
- **Grandi imprese** (fatturato medio sopra 500 milioni): dichiarazione
  annuale entro il 23 settembre.
- **Servizi EAA**, dal 28 giugno 2025: Linee guida AgID della Determinazione n.
  38/2026, con quattro schede di controllo; microimprese escluse; sanzioni da
  5.000 a 40.000 euro, fino al 5% del fatturato sopra i 500 milioni.
- **In arrivo**: la EN 301 549 v4.1.1, pubblicata da ETSI il 2 settembre 2026,
  adotta le WCAG 2.2 AA. Diventa il riferimento dopo la citazione nella
  Gazzetta ufficiale UE e il recepimento di AgID.

Le skill controllano la data di questo quadro e, se è vecchia, cercano le fonti
ufficiali prima di rispondere.

## Cosa non fa

- **Non è consulenza legale.** Prepara documenti e verifiche; chi è obbligato,
  le sanzioni e le responsabilità le decidono l'ente o l'azienda con i loro
  consulenti.
- **Non sostituisce i test con persone.** Le skill guidano i test manuali, ma
  li fai tu, e un test con utenti che usano davvero le tecnologie assistive
  resta la verifica migliore.
- **Non firma niente.** La dichiarazione la presenta l'ente.
- **Non usa overlay.** I widget che promettono la conformità con una riga di
  script non rendono accessibile un sito, e le Linee guida AgID del 2026 li
  citano tra le tecniche di tracciamento da evitare.

## Licenza

MIT. Contributi benvenuti, soprattutto da chi lavora con l'accessibilità nella
PA: errori tipici, casi reali, aggiornamenti normativi con la fonte.
