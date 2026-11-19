---
name: a11y-wcag22
description: >-
  Gap analysis verso la EN 301 549 v4.1.1: i sei criteri nuovi delle WCAG 2.2 AA
  (focus non coperto, trascinamento, dimensione dei bersagli, aiuto coerente,
  inserimento ridondante, autenticazione accessibile) e le preferenze
  dell'utente della clausola 9.7 (zoom, dimensione del testo, colori forzati,
  tema scuro). Usala quando l'utente chiede "WCAG 2.2", "siamo pronti per la
  nuova EN 301 549?", "cosa cambia con la v4", "target size", "accessible
  authentication", "preferenze utente", o vuole andare oltre il minimo
  richiesto oggi.
---

# a11y-wcag22

Oggi in Italia il riferimento obbligatorio è WCAG 2.1 AA. La EN 301 549 v4.1.1,
pubblicata da ETSI il 2 settembre 2026, adotta le WCAG 2.2 AA e aggiunge
requisiti sulle preferenze dell'utente che non stanno nelle WCAG; diventerà il
nuovo riferimento quando sarà citata nella Gazzetta ufficiale dell'UE (attesa
fra fine novembre e metà dicembre 2026) e recepita da AgID. Prima di dire a
che punto è, **cerca**: la situazione può essere cambiata dopo il 19 novembre
2026, data di questa skill. Il quadro completo è in
`../a11y-dichiarazione/riferimenti.md`.

Il messaggio per l'utente è semplice: le novità sono poche, concrete e quasi
tutte economiche da sistemare adesso. Rifarle dopo, a norma cambiata, costa di
più.

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

## Oltre le WCAG: preferenze dell'utente (EN 301 549, 9.7)

La v4.1.1 riscrive il requisito sulle preferenze dell'utente e lo porta anche
sul web (9.7), sui documenti (10.7) e sul software (11.7). Il senso: la pagina
non deve scavalcare le impostazioni che l'utente ha scelto nel sistema o nel
browser. Una pagina può passare tutte le WCAG e fallire qui, per esempio
ignorando il contrasto elevato di Windows. Il testo esatto va letto nella norma
ETSI: se l'utente deve dichiarare la conformità, cita la clausola e invitalo a
verificarla sul testo ufficiale.

Cosa controllare nel codice:
- **Dimensione del testo**: `font-size` in `px` sull'`html` o sul `body`
  scavalca la dimensione scelta nel browser. Usa `rem` o percentuali, e lascia
  `html { font-size: 100% }`.
- **Zoom**: `user-scalable=no` o `maximum-scale=1` nel meta viewport bloccano
  lo zoom su mobile. Vanno tolti.
- **Colori forzati** (contrasto elevato di Windows): cerca
  `forced-color-adjust: none` e icone fatte con `background-image`, che in
  modalità forzata spariscono. Le icone SVG devono usare `currentColor`; i
  bordi e il focus personalizzati devono restare visibili, per esempio con
  `outline: 2px solid transparent`, che diventa visibile in colori forzati.
- **Tema scuro**: se il sito ha un tema scuro, segue `prefers-color-scheme` di
  default e il contrasto va verificato anche lì. Se non ce l'ha, non è un
  errore, ma la pagina non deve rompersi quando il browser forza il tema.
- **Movimento ridotto**: rispettare `prefers-reduced-motion` è buona pratica e
  aiuta per 2.2.2 e 2.3.3; con le preferenze della 9.7 diventa ancora più
  difendibile.

Test manuali, cinque minuti in tutto:
1. Chrome → Impostazioni → Aspetto → Dimensione carattere "Molto grande":
   il testo deve crescere e la pagina non deve rompersi.
2. DevTools → Rendering → "Emulate CSS media feature forced-colors: active":
   icone, bordi dei campi e focus devono restare visibili.
3. Stesso pannello, `prefers-color-scheme: dark` e
   `prefers-reduced-motion: reduce`.
4. Su telefono, pizzica per ingrandire.

Nel report mettile in una sezione a parte, "EN 301 549 v4.1.1, oltre le WCAG",
come raccomandazioni finché la norma non è citata.

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

EN 301 549 v4.1.1, OLTRE LE WCAG
9.7     ✗  html { font-size: 16px } ignora la dimensione del testo scelta nel browser.
            Correzione: font-size: 100% e misure in rem. Costo: basso.
9.7     ✗  In colori forzati spariscono le icone del menu (background-image).

PRIORITÀ: 3.3.8 e 2.5.7 bloccano persone vere oggi. Gli altri sono veloci.
```

Indica sempre il costo stimato della correzione: è quello che convince un
responsabile a farle prima che diventino obbligatorie.
