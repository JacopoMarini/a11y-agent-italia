---
name: a11y-design-italia
description: >-
  Controlla e corregge l'uso di Bootstrap Italia, design-react-kit e dei
  modelli di Designers Italia, dove l'accessibilità si rompe più spesso:
  temi personalizzati che abbassano il contrasto, icone dello sprite senza
  nome, classi vecchie dopo la migrazione a Bootstrap Italia 2, componenti
  rifatti in casa al posto di quelli del kit. Usala quando il progetto usa
  bootstrap-italia o design-react-kit, quando l'utente lavora a un sito di un
  Comune, una scuola o un ente pubblico, chiede "uso bene Bootstrap Italia?",
  o migra da Bootstrap Italia 1 a 2.
---

# a11y-design-italia

Bootstrap Italia e design-react-kit nascono con l'accessibilità dentro, ma solo
se si usano come previsto. I problemi arrivano quasi sempre da tre posti: il
tema personalizzato, il markup copiato a metà dagli esempi, e i componenti
rifatti a mano "perché quello del kit non faceva esattamente così".

## Prima: cosa c'è nel progetto

Leggi `package.json` e annota le versioni di `bootstrap-italia`,
`design-react-kit`, `react`. Non dare consigli per una versione diversa da
quella installata. Se ti serve sapere come funziona un componente in quella
versione, guarda il codice in `node_modules` o la documentazione ufficiale
(italia.github.io/bootstrap-italia, italia.github.io/design-react-kit) invece di
andare a memoria.

## I controlli

### 1. Il tema personalizzato

Gli enti cambiano il colore primario con le variabili SASS (`$primary` o la
tinta HSB del tema). Il blu di default `#0066cc` passa (5,57:1 su bianco), molti
colori istituzionali no.

- Trova dove viene ridefinito il primario e le altre variabili di colore.
- Calcola il contrasto del primario su bianco, sul grigio chiaro degli sfondi
  di sezione e del testo bianco sul primario (bottoni, header). Mostra i conti.
- Se un colore non passa, proponi la variante più scura della stessa tinta che
  arriva a 4,5:1, e controlla anche gli stati hover e focus.

### 2. Icone dallo sprite

```html
<!-- decorativa, accanto a un testo: nascosta -->
<svg class="icon icon-sm" aria-hidden="true"><use href="/bootstrap-italia/dist/svg/sprites.svg#it-calendar"></use></svg>

<!-- da sola dentro un bottone: il nome va al bottone -->
<button type="button" class="btn btn-primary btn-icon" aria-label="Cerca">
  <svg class="icon icon-white" aria-hidden="true"><use href=".../sprites.svg#it-search"></use></svg>
</button>

<!-- informativa da sola: ruolo e titolo -->
<svg class="icon" role="img" aria-labelledby="ico-ok"><title id="ico-ok">Pratica completata</title><use href="..."></use></svg>
```

Con design-react-kit: `<Icon icon="it-search" aria-hidden />` dentro un bottone
con `aria-label`, oppure `title` sull'Icon se è informativa. Controlla nella
versione installata quale prop accetta.

### 3. Migrazione da Bootstrap Italia 1 a 2

Bootstrap Italia 2 si basa su Bootstrap 5. Le classi rimaste dal vecchio
markup smettono di funzionare senza errori visibili:

- `sr-only` e `sr-only-focusable` → `visually-hidden` e
  `visually-hidden-focusable`. Se resta la classe vecchia, il testo per gli
  screen reader **diventa visibile** o il link "Vai al contenuto" resta sempre
  a schermo.
- Attributi `data-toggle`, `data-target` → `data-bs-toggle`, `data-bs-target`.
  Con quelli vecchi fisarmoniche, tendine e menu non si aprono, né col mouse né
  con la tastiera.
- Cerca nel codice le classi e gli attributi vecchi e proponi la sostituzione
  in blocco, con l'elenco dei file.

### 4. Skiplink, header e navigazione

- Il blocco `skiplinks` deve essere il primo elemento del `body` e puntare a id
  che esistono (`#main-container`, `#footer` o quelli del progetto).
- Il bottone hamburger del menu ha `aria-label`, `aria-expanded` e
  `aria-controls`. Se l'header è stato riscritto, è il primo posto dove manca.
- Megamenu e tendine: si aprono con Invio e Spazio, si chiudono con Esc, il
  focus non si perde alla chiusura.
- La voce di menu della pagina corrente ha `aria-current="page"`.

### 5. Componenti rifatti in casa

Cerca componenti del progetto che duplicano quelli del kit: select, fisarmonica,
modale, tab, carosello, datepicker, autocompletamento. Per ciascuno:

- Se il kit ha l'equivalente, proponi di usarlo e mostra la differenza di
  comportamento da tastiera e screen reader.
- Se c'è un motivo per tenerlo (una funzione che il kit non ha), verificalo
  con `/a11y-audit` come qualsiasi componente custom.

### 6. Modelli dei siti di Comuni e scuole

I modelli di Designers Italia per i siti dei Comuni e delle scuole hanno
criteri di conformità propri, verificati anche in automatico, che includono la
presenza e il collegamento della dichiarazione di accessibilità nel footer.
Questi criteri e gli strumenti di verifica cambiano: se l'utente lavora a uno
di questi siti, cerca la versione in vigore sul sito di Designers Italia prima
di dare indicazioni puntuali.

Ricorda all'utente che rispettare il modello non basta per l'accessibilità: il
modello dà la struttura, i contenuti caricati dall'ente (immagini senza alt, PDF
scansionati, tabelle incollate da Word) la possono rompere il giorno dopo.

## Output

```
BOOTSTRAP ITALIA · progetto con bootstrap-italia 2.x, design-react-kit 5.x

TEMA
  ✗ $primary #2e8bc9 su bianco = 3,72:1. Testo dei link e bottoni outline sotto 4,5:1.
    Proposta: #1f6fa5 = 5,42:1, stessa tinta.

MIGRAZIONE
  ✗ 14 occorrenze di sr-only in 9 file → visually-hidden
  ✗ data-toggle in 3 file: le fisarmoniche delle FAQ non si aprono

COMPONENTI
  ✗ src/components/MySelect.tsx rifà la Select del kit senza aria-expanded
    né gestione delle frecce. Proposta: Select di design-react-kit.
```

Per ogni proposta che tocca colori o componenti, chiedi conferma prima di
modificare: sono decisioni di design che di solito non spettano solo allo
sviluppatore.
