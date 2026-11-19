# Novità

## 1.1.0 · 19 novembre 2026

- **Pacchetto npm.** `npx a11y-agent-italia installa` copia le skill in
  `~/.claude/skills` (o in `.claude/skills` del progetto con `--progetto`).
  `npx a11y-scansiona` lancia la scansione con axe-core e Playwright già
  inclusi.
- **EN 301 549 v4.1.1.** `/a11y-wcag22` controlla anche le preferenze
  dell'utente della clausola 9.7 (dimensione del testo, zoom, colori forzati,
  tema scuro, movimento ridotto), che non fanno parte delle WCAG e che axe non
  vede.
- **Quadro normativo aggiornato al 19 novembre 2026**: la v4.1.1 non è ancora
  citata nella Gazzetta ufficiale UE (attesa fra fine novembre e metà
  dicembre), le date di recepimento fissate da ETSI, le preferenze dell'utente
  estese a web, documenti e software, l'allegato ZB per l'EAA.
- `CONTRIBUTING.md` e modelli per segnalare errori, casi reali e
  aggiornamenti normativi.

## 1.0.0 · novembre 2026

Prima versione: sette skill (`/a11y-audit`, `/a11y-correggi`,
`/a11y-test-manuale`, `/a11y-ci`, `/a11y-dichiarazione`,
`/a11y-design-italia`, `/a11y-wcag22`) e lo script di scansione con report in
italiano.
