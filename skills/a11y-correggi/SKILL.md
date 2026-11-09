---
name: a11y-correggi
description: >-
  Corregge i problemi di accessibilità nel codice frontend (React, TypeScript,
  HTML, CSS, Vue) con la soluzione più semplice che rispetta le WCAG 2.1 AA.
  Usala quando l'utente chiede "correggi l'accessibilità", "sistema questi
  errori axe", "rendi accessibile questo componente", incolla un report di
  /a11y-audit, di axe, Lighthouse, WAVE o MAUVE++, o chiede come rendere
  accessibile un modale, un menu, un modulo, una tabella o un carosello.
---

# a11y-correggi

La regola che risolve metà dei problemi: **prima l'HTML nativo, poi ARIA**. Un
`<button>` porta con sé focus, Invio, Spazio, ruolo e nome. Un `<div
role="button">` deve rifare tutto a mano, e di solito ne dimentica un pezzo. La
prima regola d'uso di ARIA del W3C dice la stessa cosa.

## Come lavori

1. Parti dal report (di `/a11y-audit` o incollato). Se non c'è, fai prima un
   audit rapido del file che ti danno.
2. Ordina: **bloccanti, poi gravi**, poi il resto. Correggi i componenti
   condivisi prima delle pagine: un `IconButton` sistemato chiude venti
   segnalazioni.
3. Per ogni correzione: modifica il codice, scrivi sotto in una riga **quale
   criterio chiude e come si verifica** (tasto da premere, cosa deve leggere lo
   screen reader).
4. Se il progetto ha già un test di accessibilità o Testing Library, aggiungi un
   test che fallirebbe senza la correzione. Altrimenti proponi `/a11y-ci`.
5. Non toccare la grafica oltre quello che serve. Se un colore va cambiato per il
   contrasto, proponi il valore più vicino all'originale che passa, con il
   rapporto calcolato.

Non aggiungere ARIA "per sicurezza". `aria-label` su un elemento che ha già un
testo visibile lo sovrascrive, `role` sbagliati rompono la semantica nativa, e
`aria-hidden="true"` su un elemento che riceve il focus crea un fantasma.

## Le correzioni ricorrenti

### Elemento cliccabile non nativo (2.1.1, 4.1.2)

```tsx
// prima
<div className="card" onClick={() => apri(id)}>...</div>

// dopo: se apre un dettaglio in un'altra pagina
<a className="card" href={`/pratiche/${id}`}>...</a>

// dopo: se fa un'azione sul posto
<button type="button" className="card" onClick={() => apri(id)}>...</button>
```

Se la card intera è cliccabile e contiene altri link, non annidarli: rendi
cliccabile il titolo e allarga l'area con uno pseudo-elemento `::after` in
posizione assoluta.

### Bottone solo icona (1.1.1, 4.1.2)

```tsx
<button type="button" onClick={chiudi} aria-label="Chiudi">
  <Icon icon="it-close" aria-hidden="true" />
</button>
```

Se l'etichetta deve cambiare con lo stato, cambia il testo, non solo l'icona.

### Toggle e fisarmonica (4.1.2)

```tsx
<button type="button" aria-expanded={aperto} aria-controls="faq-3" onClick={() => setAperto(!aperto)}>
  Come si richiede il certificato?
</button>
<div id="faq-3" hidden={!aperto}>...</div>
```

### Campo di modulo con errore (1.3.1, 3.3.1, 3.3.2, 1.4.1)

```tsx
<label htmlFor="cf">Codice fiscale</label>
<p id="cf-aiuto" className="form-text">16 caratteri, lettere e numeri</p>
<input
  id="cf"
  name="codiceFiscale"
  aria-describedby={errore ? "cf-aiuto cf-errore" : "cf-aiuto"}
  aria-invalid={errore ? true : undefined}
  required
/>
{errore && <p id="cf-errore" className="text-danger">Il codice fiscale deve avere 16 caratteri: ne hai inseriti {lunghezza}.</p>}
```

Dopo un invio fallito: sposta il focus sul primo campo in errore, oppure su un
riepilogo degli errori in cima al modulo (con link a ciascun campo). Non tutti e
due.

### Messaggi di stato (4.1.3)

```tsx
// la regione esiste sempre, vuota; cambia solo il testo
<div role="status" className="visually-hidden">{messaggio}</div>
```

In un'app, metti una sola regione di stato nel layout e scrivici da un contesto
o da uno store, invece di montarne una per componente.

### Modale (2.1.2, 2.4.3)

Prima scelta: `<dialog>` nativo aperto con `showModal()`. Il focus entra, il
resto della pagina diventa inerte, Esc chiude. Resta da fare:

```tsx
const ref = useRef<HTMLDialogElement>(null);
const opener = useRef<HTMLElement | null>(null);

function apri() {
  opener.current = document.activeElement as HTMLElement;
  ref.current?.showModal();
}
function chiudi() {
  ref.current?.close(); // fa scattare onClose, come Esc
}

// onClose copre sia il bottone sia Esc: il focus torna da dove era partito
<dialog ref={ref} aria-labelledby="titolo-modale" onClose={() => opener.current?.focus()}>
  <h2 id="titolo-modale">Conferma invio</h2>
  ...
</dialog>
```

Se usano già il Modal di design-react-kit o di un'altra libreria, non
riscriverlo: verifica che faccia queste quattro cose e sistema quella che manca.

### Cambio di pagina in una SPA (2.4.2, 2.4.3, 4.1.3)

```tsx
// nel layout, a ogni cambio di rotta
useEffect(() => {
  document.title = `${titoloPagina} - ${nomeEnte}`;
  h1Ref.current?.focus(); // h1 con tabIndex={-1}
}, [pathname]);
```

Con Next.js App Router il titolo arriva dai `metadata`; l'annuncio della rotta
c'è già, il focus no.

### Focus visibile (2.4.7, 1.4.11)

```css
:focus-visible {
  outline: 3px solid #0066cc; /* almeno 3:1 contro lo sfondo adiacente */
  outline-offset: 2px;
}
```

Togli gli `outline: none` globali. Se il design non vuole il focus al click del
mouse, `:focus-visible` risolve senza toglierlo alla tastiera.

### Contrasto (1.4.3, 1.4.11)

Calcola sempre il rapporto e mostralo. Proponi il colore più vicino che passa,
mantenendo la tinta:

```
#8a8a8a su #ffffff = 3,45:1  ✗ (serve 4,5:1)
#767676 su #ffffff = 4,54:1  ✓  (stesso grigio, più scuro)
```

### Tabelle di dati (1.3.1, 1.4.10)

```html
<div class="table-responsive" tabindex="0" role="region" aria-labelledby="cap-bandi">
  <table>
    <caption id="cap-bandi">Bandi aperti al 9 novembre 2026</caption>
    <thead><tr><th scope="col">Bando</th><th scope="col">Scadenza</th></tr></thead>
    ...
  </table>
</div>
```

Il contenitore scorre da solo a 320 px e, con `tabindex="0"`, si può far
scorrere anche da tastiera.

### Link (2.4.4)

```tsx
<a href={url}>Delibera n. 45/2026 (PDF, 1,2 MB)</a>
// "Leggi di più" ripetuto: dai un nome completo
<a href={url}>Leggi di più<span className="visually-hidden"> su {titolo}</span></a>
```

Il testo nascosto va **dopo** quello visibile, così 2.5.3 resta rispettato.

### Carosello (2.2.2)

Pulsante pausa visibile e raggiungibile per primo, niente autoplay al cambio di
focus, e rispetto di `prefers-reduced-motion`. Spesso la correzione migliore è
togliere l'autoplay.

## Con Bootstrap Italia o design-react-kit

Se il progetto li usa, la correzione giusta spesso è **usare il componente del
kit invece di quello fatto in casa**, o usarlo come previsto (classi, ARIA già
incluse). Vedi `/a11y-design-italia` per gli errori tipici d'uso.

## Output

Per ogni file modificato:

```
src/components/TipoIstanza.tsx
  ✓ 2.1.1 · 4.1.2  <div onClick> → <select> nativo con <label>
    Verifica: Tab arriva sul campo, frecce cambiano opzione, NVDA legge
    "Tipo di istanza, casella combinata, Residenza".
  ✓ 1.3.5  autocomplete="given-name" / "family-name" sui campi nome
```

In fondo: cosa resta aperto dal report e perché (serve una decisione di
design, serve il contenuto dall'ente, serve un test manuale).
