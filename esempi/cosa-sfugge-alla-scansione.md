# Cosa sfugge alla scansione

`pagina-con-errori.html` è una pagina di servizi di un Comune immaginario, con
gli errori che si trovano più spesso nei siti pubblici italiani.

La scansione automatica (`scansione-automatica.md`) trova **5 problemi su 5
criteri**: immagine senza alt, contrasto, zoom bloccato, bottone e select senza
nome, più lo scorrimento orizzontale a 320 px.

L'analisi del codice di `/a11y-audit` ne trova altri **12**, e tre sono
bloccanti. Nessuno di questi compare nel report automatico:

| | criterio | problema | perché la scansione non lo vede |
| --- | --- | --- | --- |
| **bloccante** | 2.1.1 · 4.1.2 | Le card "Cambio di residenza" e "Pagamento TARI" sono `<div onclick>`: con la tastiera non si raggiungono | axe non vede i gestori di eventi |
| **bloccante** | 2.1.1 · 4.1.2 | "Invia" è un `<div onclick>`: il modulo non si invia da tastiera | come sopra |
| **bloccante** | 2.4.7 | `outline: none` su link e bottoni: chi usa la tastiera non sa dove si trova | il focus visibile si giudica a occhio |
| grave | 3.1.1 | `<html lang="en">` su una pagina in italiano: lo screen reader legge con la pronuncia inglese | axe controlla che `lang` ci sia, non che sia giusto |
| grave | 1.3.1 · 3.3.2 | I campi hanno solo il placeholder: l'etichetta sparisce appena si scrive | axe accetta il placeholder come nome accessibile |
| grave | 1.4.1 · 3.3.1 | Il codice fiscale in errore è segnalato solo dal bordo rosso | non c'è un messaggio da controllare |
| grave | 1.3.5 | `autocomplete="off"` sull'email, e nessun `autocomplete` sul nome | dipende dallo scopo del campo |
| moderata | 1.3.1 | Il titolo della pagina è un `<div class="h1">`, la pagina non ha un h1 | la regola relativa di axe è una best practice, non un criterio WCAG |
| moderata | 1.3.1 | La tabella dei bandi usa `<td><b>` al posto di `<th>` | axe non sa che la prima riga è l'intestazione |
| moderata | 2.4.4 | "clicca qui" per le delibere, senza dire che è un PDF | lo scopo del link si valuta leggendo |
| moderata | 2.4.1 | Manca `<main>` e manca il link "Vai al contenuto" | la regola di axe per 2.4.1 si accontenta della presenza di titoli; quelle sui landmark sono best practice |
| lieve | 2.4.2 | Il `<title>` è solo "Comune": non dice né quale pagina né quale Comune | axe controlla che ci sia, non cosa dice |

È il motivo per cui il pacchetto ha sia lo script sia le istruzioni di analisi,
e perché nessuna skill dichiara "conforme" una pagina solo perché la scansione è
pulita.
