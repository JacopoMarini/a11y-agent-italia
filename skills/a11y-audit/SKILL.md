---
name: a11y-audit
description: >-
  Audit di accessibilità di codice frontend o di pagine web contro le WCAG 2.1
  livello AA richieste in Italia da AgID (Legge 4/2004 e European Accessibility
  Act). Usala quando l'utente chiede "controlla l'accessibilità", "è conforme
  AgID?", "audit WCAG", "questo componente è accessibile?", incolla un
  componente React, Vue o HTML, indica un URL o una cartella da verificare, o
  prepara un sito per la dichiarazione di accessibilità.
---

# a11y-audit

Un audit serve a una cosa: dire con precisione **quale criterio è violato,
dove, quanto pesa e come si corregge**. Un elenco di "buone pratiche" generiche
non serve a nessuno, e un "sembra accessibile" è peggio di niente, perché finisce
dritto in una dichiarazione di conformità firmata.

## Prima: cosa stai guardando

Capisci quale di questi casi hai davanti e dillo in una riga:

1. **Codice** (un componente, una cartella, un repo). Fai l'analisi statica qui
   sotto. Se il progetto si avvia in locale, aggiungi la scansione.
2. **Una pagina o un sito pubblicati**. Scansione automatica, poi analisi del
   markup che ottieni.
3. **Tutte e due**. Prima la scansione per avere i numeri, poi il codice per
   trovare la causa nel componente e non nell'HTML generato.

Il riferimento è sempre **WCAG 2.1 livelli A e AA**, i 50 criteri di
`criteri-wcag21.json`. È quello che chiedono oggi sia le Linee guida AgID per la
PA sia quelle sui servizi EAA, tramite la EN 301 549 v3.2.1. I criteri nuovi
delle WCAG 2.2 non sono ancora obbligatori: se l'utente li vuole, usa
`/a11y-wcag22` e tienili separati nel report.

## La scansione automatica

`scansiona.mjs` lancia axe-core in Chromium, raggruppa i risultati per criterio
WCAG con la descrizione in italiano e prova il reflow a 320 px (criterio 1.4.10),
che axe da solo non controlla.

```bash
# una volta, nella cartella del progetto o in una cartella di lavoro
npm i -D playwright axe-core && npx playwright install chromium

node <cartella-della-skill>/scansiona.mjs http://localhost:3000 http://localhost:3000/servizi
node <cartella-della-skill>/scansiona.mjs build/index.html --out report-a11y
```

Opzioni: `--wcag22` aggiunge le regole 2.2, `--no-reflow` salta il controllo a
320 px, `--out` sceglie la cartella del report. Esce con codice 1 se trova
violazioni, quindi va bene anche in CI.

Se la rete o Chromium non sono disponibili, non fingere di aver scansionato:
dillo e fai solo l'analisi statica.

**Sito pubblicato non raggiungibile dalla shell?** Se c'è un browser
collegato (il browser integrato o Chrome dell'utente), apri lì la pagina,
inietta axe-core da `cdn.jsdelivr.net/npm/axe-core@<versione>/axe.min.js` con
la traduzione `locales/it.json`, e lancia `axe.run` con gli stessi tag dello
script. Il reflow si prova ridimensionando la scheda a 320 px. Il risultato è
lo stesso, e il browser vede il sito come un visitatore vero.

**Focus visibile: provalo con la tastiera vera.** Bootstrap Italia e molti
temi mostrano l'indicatore solo dopo un tasto premuto (`:focus-visible` o una
classe aggiunta al keydown). Un `element.focus()` da script non lo fa
comparire, e ogni elemento sembra senza focus. Premi Tab nel browser e guarda,
oppure lascia il criterio 2.4.7 a `/a11y-test-manuale`.

Per una SPA, scansiona **gli stati**, non solo gli URL: modale aperta, menu
aperto, modulo con errori mostrati, risultati di ricerca vuoti. Se l'utente ha
Playwright nel progetto, proponi di scrivere un test che porta la pagina in
quello stato e poi lancia axe (vedi `/a11y-ci`).

## L'analisi statica del codice

Leggi i componenti cercando questi schemi. Sono quelli che la scansione non vede
o vede male, e sono la maggior parte dei problemi reali nelle app React.

**Interazione e tastiera (2.1.1, 2.1.2, 4.1.2)**
- `onClick` su `div`, `span`, `li`, `img`, `tr`. Se fa un'azione è un `<button>`,
  se porta altrove è un `<a href>`. `role="button" tabIndex={0}` è la toppa, non
  la cura: serve anche la gestione di Invio e Spazio.
- `<a>` senza `href` o con `href="#"` usati come bottoni.
- Componenti custom (select, combobox, tab, fisarmonica, toggle) senza lo stato
  esposto: `aria-expanded`, `aria-selected`, `aria-pressed`, `aria-controls`.
- `tabIndex` positivi. Sempre un errore.

**Focus (2.4.3, 2.4.7)**
- `outline: none` o `outline: 0` nei CSS o nei styled-components senza uno stile
  `:focus-visible` alternativo.
- Modali e drawer: all'apertura il focus entra, resta dentro, Esc chiude, alla
  chiusura torna all'elemento che l'ha aperta. Se usano `<dialog>` nativo con
  `showModal()`, buona parte è gratis.
- Cambio di rotta in una SPA: il focus va spostato (sul titolo h1 o su un
  contenitore con `tabIndex={-1}`) e il `<title>` aggiornato (2.4.2).

**Nomi accessibili (1.1.1, 2.5.3, 4.1.2)**
- Bottoni solo icona senza `aria-label` o testo visivamente nascosto.
- `alt` mancanti, o `alt` che ripetono il testo accanto, o `alt="immagine"`.
  Decorative: `alt=""`. Logo dell'ente: il nome dell'ente, non "logo".
- `aria-label` che non contiene il testo visibile (2.5.3): chi usa il controllo
  vocale dice quello che vede.

**Moduli (1.3.1, 1.3.5, 3.3.1, 3.3.2)**
- Ogni campo ha una `<label htmlFor>` collegata. Il placeholder non è
  un'etichetta.
- Gruppi di radio o checkbox in `<fieldset>` con `<legend>`.
- Errori collegati al campo con `aria-describedby` e `aria-invalid`, scritti a
  testo, non solo un bordo rosso (1.4.1).
- `autocomplete` corretto sui dati personali: `given-name`, `family-name`,
  `email`, `tel`, `street-address`, `postal-code`, `address-level2` (comune),
  `bday`. Il codice fiscale non ha un token: niente `autocomplete`, ma
  un'istruzione sul formato (16 caratteri).
- Date: se il campo è testuale, il formato `gg/mm/aaaa` va scritto
  nell'etichetta o nella descrizione, non solo nel placeholder.
- Invii con effetti legali o economici (istanze, pagamenti PagoPA): riepilogo da
  confermare prima dell'invio (3.3.4).

**Messaggi dinamici (4.1.3)**
- Toast, "Salvato", "Nessun risultato", contatori di ricerca, caricamenti: serve
  una regione `role="status"` o `aria-live="polite"` **già presente nel DOM**
  prima che il messaggio arrivi. Una regione live montata insieme al testo
  spesso non viene letta.
- Errori bloccanti: `role="alert"`, con parsimonia.

**Struttura (1.3.1, 2.4.1, 2.4.6, 3.1.1)**
- Un solo `<h1>`, gerarchia senza salti usati per lo stile.
- Landmark: `<header>`, `<nav>`, `<main>`, `<footer>`. Link "Vai al contenuto"
  che punta davvero a `<main>`.
- `<html lang="it">`. Parti in altra lingua con `lang` (3.1.2). Le parole
  inglesi entrate nell'uso comune italiano (login, cookie, email) non lo
  richiedono.
- Tabelle di dati con `<th scope>` e `<caption>`. Tabelle usate per
  impaginare: non devono esserci.

**Visivo (1.4.3, 1.4.10, 1.4.11, 1.4.12)**
- Colori nei token o nel tema: calcola il contrasto delle coppie testo/sfondo
  che trovi (4.5:1 per testo normale, 3:1 per testo grande e per bordi, icone,
  indicatori di focus). Mostra il conto.
- Altezze fisse con `overflow: hidden` su elementi con testo.
- `maximum-scale=1` o `user-scalable=no` nel meta viewport.

**Documenti e media**
- Link a PDF: il testo del link dice che è un PDF e quanto pesa. Se il PDF è
  pubblicato dall'ente (albo, bandi, delibere), anche il documento deve essere
  accessibile: segnalalo come area da verificare a parte, con la scheda AgID
  per i documenti non web.
- Video: sottotitoli e trascrizione. Caroselli e animazioni: pulsante pausa.

## Gravità

Usa quattro livelli e motivali sempre con chi resta bloccato:

| gravità | quando |
| --- | --- |
| **bloccante** | un utente non riesce a completare il compito (inviare il modulo, accedere, pagare) |
| **grave** | ci riesce con molta fatica o perde informazioni importanti |
| **moderata** | fastidio o confusione, ma il compito si completa |
| **lieve** | difetto senza conseguenze pratiche, o miglioria |

Un criterio di livello A non è automaticamente più grave di uno AA. Un contrasto
basso sul bottone "Invia" è più grave di un `alt` mancante su una foto
decorativa.

## Output

```
AUDIT ACCESSIBILITÀ  ·  WCAG 2.1 AA  ·  9 nov 2026
Oggetto: src/features/istanze/ (14 componenti) + scansione di 3 pagine in locale

ESITO: non conforme  ·  3 bloccanti · 5 gravi · 7 moderate · 2 lievi

BLOCCANTI
1. [2.1.1 · 4.1.2] Il selettore del tipo di istanza non si usa da tastiera
   src/features/istanze/TipoIstanza.tsx:42
   È un <div onClick> con un menu custom. Con la tastiera non si apre, e lo
   screen reader non sa che è un elenco di opzioni.
   Correzione: <select> nativo con <label>, oppure il componente Select di
   design-react-kit. Se deve restare custom: pattern combobox ARIA completo.
   Chi resta bloccato: chiunque usi solo la tastiera o uno screen reader. Non
   può presentare l'istanza.

2. ...

DA VERIFICARE A MANO
- 1.2.2 · il video tutorial in /aiuto: ci sono sottotitoli rivisti?
- 1.4.13 · tooltip sull'IBAN: si chiude con Esc?
- Documenti PDF collegati (12): fuori da questo audit, servono controlli a parte.

NON VERIFICATO
Questi criteri richiedono test manuali che non ho fatto: 1.3.2, 2.4.3, 3.2.1...
→ /a11y-test-manuale per la checklist.
```

Regole del report:

- Ogni problema ha **criterio, posizione (file:riga o selettore), cosa succede,
  correzione, chi resta bloccato**. Se manca uno di questi, non è pronto.
- Separa sempre **trovato**, **da verificare a mano** e **non verificato**. Non
  promuovere mai un criterio a "conforme" solo perché la scansione è pulita.
- L'esito è "conforme" solo se tutti i 50 criteri sono stati verificati,
  anche a mano, e passano. Altrimenti è "non conforme" o "parzialmente
  conforme", che sono le stesse voci della dichiarazione di accessibilità.
- Non nominare clienti, enti o progetti nel report se l'utente non lo ha fatto.

Poi proponi `/a11y-correggi` per le correzioni, partendo dai bloccanti.
