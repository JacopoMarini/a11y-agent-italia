---
name: a11y-wcag22
description: >-
  Gap analysis fra WCAG 2.1 AA e WCAG 2.2 AA: verifica i sei criteri nuovi
  (focus non coperto, trascinamento, dimensione dei bersagli, aiuto coerente,
  inserimento ridondante, autenticazione accessibile) e prepara il progetto
  alla EN 301 549 v4.1.1. Usala quando l'utente chiede "WCAG 2.2", "siamo
  pronti per la nuova EN 301 549?", "cosa cambia con la 2.2", "target size",
  "accessible authentication", o vuole andare oltre il minimo richiesto oggi.
---

# a11y-wcag22

Oggi in Italia il riferimento obbligatorio è WCAG 2.1 AA. La EN 301 549 v4.1.1,
pubblicata da ETSI il 2 settembre 2026, adotta le WCAG 2.2 AA; diventerà il
nuovo riferimento quando sarà citata nella Gazzetta ufficiale dell'UE e recepita
da AgID. Prima di dire a che punto è, **cerca**: la situazione può essere
cambiata dopo il 9 novembre 2026, data di questa skill.

Il messaggio per l'utente è semplice: i sei criteri nuovi sono pochi, concreti
e quasi tutti economici da sistemare adesso. Rifarlo dopo, a norma cambiata,
costa di più.

Tieni sempre separati nel report i criteri 2.2 da quelli 2.1. Un problema 2.2
oggi è una **raccomandazione**, non una non conformità da dichiarare.

## I sei criteri, e dove cercare

I dettagli sono in `criteri-wcag22-nuovi.json`. In pratica:

**2.4.11 Focus non coperto (AA)**
- Cerca `position: sticky` e `position: fixed`: header, barre in basso, banner
  dei cookie, bottoni della chat.
- Test: con Tab, scorri tutta la pagina. Ogni elemento con il focus deve
  restare almeno in parte visibile.
- Correzione tipica: `scroll-padding-top` e `scroll-padding-bottom` sull'`html`
  pari all'altezza delle barre fisse; il banner dei cookie non deve coprire la
  pagina senza essere stato chiuso o gestito.

**2.5.7 Trascinamento (AA)**
- Cerca librerie e eventi di drag: `react-dnd`, `dnd-kit`, `react-beautiful-dnd`,
  `onDragStart`, `draggable`, slider, zone di upload.
- Ogni trascinamento ha un'alternativa a un click: bottoni "Sposta su/giù", un
  `<input type="file">` visibile accanto alla zona di rilascio, campi numerici
  accanto agli slider.

**2.5.8 Dimensione dei bersagli (AA)**
- La scansione con `--wcag22` (`/a11y-audit`) usa la regola `target-size` di
  axe e trova molti casi. Gli altri si vedono a occhio: icone di chiusura,
  paginazione, icone social, checkbox custom.
- Minimo 24 × 24 px CSS, oppure abbastanza spazio libero intorno. Spesso basta
  aumentare il padding senza cambiare l'icona.

**3.2.6 Aiuto coerente (A)**
- Elenca i meccanismi di aiuto del sito: contatti, numero verde, chat, FAQ,
  "Hai bisogno di aiuto?". Controlla che stiano nello stesso punto relativo in
  tutte le pagine, e soprattutto in tutti i passi di un servizio.

**3.3.7 Inserimento ridondante (A)**
- Nei moduli a più passi, cerca dati chiesti due volte: residenza e domicilio,
  richiedente e beneficiario, fatturazione e spedizione.
- Correzione: precompilare, o una casella "Uguale a ..." che copia i dati.

**3.3.8 Autenticazione accessibile (AA)**
- Cerca nei campi di login: `onPaste` con `preventDefault`,
  `autocomplete="off"` su password e codici, CAPTCHA, codici OTP divisi in
  caselle singole.
- Correzione: incolla sempre permesso, `autocomplete="current-password"` e
  `"new-password"`, `autocomplete="one-time-code"` sui codici, un solo campo
  per l'OTP o caselle che accettano l'incolla di tutto il codice.
- Con SPID e CIE l'autenticazione avviene sul sistema dell'identity provider:
  di quella parte non risponde il sito. Ma il bottone di accesso, la scelta
  del provider e le eventuali credenziali alternative (per esempio un accesso
  con username e password per gli operatori) sono del sito.

## 4.1.1 Parsing

Le WCAG 2.2 lo tolgono. Nel regime 2.1 si considera già sempre soddisfatto per
HTML dopo l'aggiornamento del W3C del 2023. Non serve fare niente di specifico,
ma gli ID duplicati vanno comunque eliminati perché rompono etichette e
descrizioni (1.3.1, 4.1.2).

## Output

```
GAP ANALYSIS WCAG 2.2  ·  rispetto alla base 2.1 AA
Stato della norma al [data della ricerca]: [esito della verifica]

2.4.11  ✗  Header sticky da 96 px copre i campi del modulo durante la navigazione con Tab.
            Correzione: scroll-padding-top: 104px su html. Costo: 1 riga.
2.5.7   ✗  Upload documenti solo con drag and drop (src/components/Upload.tsx).
            Correzione: <input type="file"> visibile con etichetta. Costo: basso.
2.5.8   ✗  12 elementi sotto 24 px (scansione), quasi tutti icone di chiusura.
3.2.6   ✓  Contatti sempre nel footer, stesso ordine.
3.3.7   ✗  Istanza residenza: l'indirizzo è chiesto al passo 2 e al passo 4.
3.3.8   ✗  Login operatori: incolla bloccato nel campo password.

PRIORITÀ: 3.3.8 e 2.5.7 bloccano persone vere oggi. Gli altri sono veloci.
```

Indica sempre il costo stimato della correzione: è quello che convince un
responsabile a farle prima che diventino obbligatorie.
