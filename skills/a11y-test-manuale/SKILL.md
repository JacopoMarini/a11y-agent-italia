---
name: a11y-test-manuale
description: >-
  Guida passo passo i test manuali di accessibilità che nessuno strumento
  automatico può fare: tastiera, screen reader (NVDA, VoiceOver, TalkBack),
  zoom al 200%, reflow a 320 px, spaziatura del testo, contenuti dinamici.
  Registra gli esiti come evidenze per la scheda di controllo AgID. Usala
  quando l'utente chiede "come testo con lo screen reader", "test manuale di
  accessibilità", "checklist per la verifica", "devo compilare la scheda di
  controllo", o quando /a11y-audit lascia criteri da verificare a mano.
---

# a11y-test-manuale

La scansione automatica trova la parte dei problemi che si può misurare. Il
resto (ordine del focus, cosa legge davvero uno screen reader, un modale che
intrappola, un errore che nessuno annuncia) lo trova solo una persona che usa la
pagina come la userebbe chi ha una disabilità. Questa skill fa da copilota: dice
cosa provare, in che ordine, cosa aspettarsi, e scrive l'esito.

Non fingere di aver fatto test che non puoi fare. Tu non premi Tab e non senti
NVDA: lo fa l'utente. Il tuo lavoro è preparare il test sulla pagina giusta,
interpretare quello che l'utente ti riferisce, e decidere quale criterio è
violato.

## 1. Prepara il campione

Non si testa tutto il sito, si testa un campione rappresentativo. Chiedi o
ricava:

- **Le pagine tipo**: home, una pagina di contenuto, un elenco (notizie, bandi),
  la ricerca, una pagina con una tabella di dati, un documento PDF collegato.
- **I servizi**: ogni percorso completo che produce un risultato per il
  cittadino o il cliente (presentare un'istanza, prenotare, pagare, accedere con
  SPID o CIE). Si testa **dall'inizio alla fine**, perché un passaggio bloccato
  blocca tutto.
- **Gli stati**: modale aperta, menu aperto, errori mostrati, nessun risultato,
  sessione in scadenza.

Scrivi il campione come tabella prima di iniziare e fattelo confermare.

## 2. Gli strumenti

| combinazione | per chi |
| --- | --- |
| **NVDA + Firefox o Chrome** su Windows | gratis e tra gli screen reader più diffusi su desktop |
| **VoiceOver + Safari** su macOS e iOS | già installato, Cmd+F5 per attivarlo su Mac |
| **TalkBack + Chrome** su Android | per le app e il mobile |
| Zoom del browser, DevTools in modalità dispositivo | reflow e ridimensionamento |
| Bookmarklet di spaziatura del testo (1.4.12) | inietta le spaziature del criterio |

Se l'utente non ha mai usato uno screen reader, dagli i cinque comandi che
servono e basta. NVDA: `Tab` per i controlli, `H` per i titoli, `D` per i
landmark, `F` per i campi, `Ins+F7` per l'elenco di link e titoli, `Ctrl` per
zittirlo. VoiceOver su Mac: `VO` è `Ctrl+Opt`, `VO+U` apre il rotore.

## 3. I test, in quest'ordine

Fai un passaggio alla volta, con l'utente che riferisce. Per ciascuno: cosa
fare, cosa deve succedere, quale criterio decide.

**Tastiera, senza mouse (2.1.1, 2.1.2, 2.4.1, 2.4.3, 2.4.7, 3.2.1)**
1. Ricarica la pagina, premi Tab. Il primo elemento è il link "Vai al
   contenuto"? Premendo Invio, il focus arriva al contenuto?
2. Continua con Tab fino in fondo. Il focus si vede sempre? L'ordine segue la
   lettura? Ci sono punti dove il focus sparisce o resta bloccato?
3. Ogni cosa cliccabile col mouse si attiva con Invio (link e bottoni) o Spazio
   (bottoni, checkbox)? Menu e tendine si aprono e si chiudono, anche con Esc?
4. Nei servizi: completa il percorso solo con la tastiera, fino alla ricevuta.

**Screen reader (1.1.1, 1.3.1, 2.4.2, 2.4.4, 2.4.6, 3.3.1, 4.1.2, 4.1.3)**
1. Elenco dei titoli (`H` o `Ins+F7`): la struttura racconta la pagina?
2. Landmark: c'è un `main`, la navigazione è riconoscibile?
3. Ogni controllo dice **cosa è, come si chiama, in che stato è**: "Menu,
   pulsante, compresso".
4. Immagini e icone: lette con un nome sensato, o saltate se decorative.
5. Moduli: ogni campo legge l'etichetta e le istruzioni. Invia vuoto: gli
   errori vengono annunciati e si capisce come correggerli?
6. Contenuti che cambiano senza ricaricare (risultati, salvataggi, carrello):
   vengono annunciati senza che il focus si sposti?

**Ingrandimento e adattamento (1.4.4, 1.4.10, 1.4.12, 1.3.4)**
1. Zoom del browser al 200%: si legge tutto, niente testo tagliato o
   sovrapposto, tutte le funzioni ci sono ancora.
2. Finestra a 1280 px e zoom al 400%, o DevTools a 320 px di larghezza:
   nessuno scorrimento orizzontale della pagina. Le tabelle di dati possono
   scorrere nel loro riquadro.
3. Spaziatura del testo con il bookmarklet: niente testo tagliato nei bottoni,
   nelle card, nei menu.
4. Su telefono: la pagina funziona sia in verticale sia in orizzontale.

**Il resto, a vista (1.3.3, 1.4.1, 1.4.13, 2.2.1, 2.2.2, 2.5.x, 3.2.3, 3.2.4)**
- Istruzioni che dipendono solo da colore, forma o posizione.
- Tooltip: si possono raggiungere col mouse senza che spariscano, si chiudono
  con Esc.
- Timeout di sessione: c'è un avviso con la possibilità di estendere?
- Animazioni e caroselli: si mettono in pausa?
- Navigazione e nomi coerenti tra le pagine.
- Gesti: tutto quello che richiede trascinamento o due dita ha un'alternativa.

## 4. Registra le evidenze

Le Linee guida AgID del 2026 sui servizi EAA prevedono schede di controllo
(siti web, documenti non web, app mobili) da usare nelle verifiche, e chiedono
evidenze documentate. Anche per la PA, la dichiarazione di accessibilità va
fatta su una valutazione, non a sensazione. Registra ogni esito così:

```
| criterio | pagina o servizio | esito | evidenza | note |
| 2.1.1 | Istanza residenza, passo 2 | non soddisfatto | Il selettore "tipo di istanza" non si apre con Invio né Spazio (NVDA 2025.x + Firefox, 9/11/2026) | bloccante |
| 1.4.10 | Elenco bandi | soddisfatto | A 320 px la tabella scorre nel riquadro, la pagina no | |
| 1.2.2 | Home | non applicabile | Nessun video registrato | |
```

Usa solo tre esiti: **soddisfatto**, **non soddisfatto**, **non applicabile**.
"Parzialmente" non esiste per un singolo criterio su una singola pagina: se in
un punto non passa, non passa. La parzialità si dichiara a livello di sito.

Annota sempre **strumento, versione e data**: un esito senza contesto non è
un'evidenza.

## 5. Chiudi

Alla fine produci:

1. La tabella completa degli esiti (va bene un file Markdown o CSV, o un foglio
   se l'utente lo preferisce).
2. Il riepilogo: criteri soddisfatti, non soddisfatti, non applicabili, su 50.
3. L'elenco dei problemi in formato `/a11y-audit`, pronti per
   `/a11y-correggi`.
4. Se tutto è stato verificato, lo stato che ne segue per la dichiarazione
   (conforme, parzialmente conforme, non conforme), da passare a
   `/a11y-dichiarazione`.

Le schede di controllo ufficiali sono negli allegati delle Linee guida AgID. Se
l'utente deve consegnare quelle, usa la loro struttura e non la tua: chiedigli
il file o cercalo sul sito di AgID.
