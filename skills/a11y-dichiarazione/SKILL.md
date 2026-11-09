---
name: a11y-dichiarazione
description: >-
  Capisce quale regime di accessibilità si applica (PA con Legge 4/2004, grandi
  imprese sopra 500 milioni, servizi European Accessibility Act) e prepara i
  contenuti da presentare: dichiarazione di accessibilità per form.agid.gov.it,
  obiettivi di accessibilità annuali, informazioni sull'accessibilità del
  servizio per l'EAA, meccanismo di feedback, valutazione dell'onere
  sproporzionato. Usala quando l'utente chiede "dichiarazione di
  accessibilità", "scadenza 23 settembre", "obiettivi di accessibilità",
  "obblighi EAA", "siamo obbligati?", "cosa scrivo sul form AgID".
---

# a11y-dichiarazione

La dichiarazione di accessibilità è un documento pubblico, linkato nel footer,
firmato da qualcuno che ne risponde. Il modo più comune di sbagliarla è
dichiarare "conforme" un sito che nessuno ha verificato davvero. Il secondo è
scrivere "parzialmente conforme" senza dire quali parti non lo sono. Questa
skill evita tutti e due.

Leggi sempre `riferimenti.md` prima di rispondere su norme, scadenze o sanzioni,
e controlla la data in cima: se è vecchia, cerca le fonti ufficiali AgID.

Non sei un avvocato e non lo fingi. Su chi è obbligato in un caso dubbio, su
sanzioni e responsabilità, dai il quadro, indica la norma e rimanda al legale o
al consulente dell'ente.

## 1. Quale regime

Fai al massimo tre domande, solo quelle che servono:

1. È una pubblica amministrazione, o un soggetto equiparato?
2. Se è un privato: offre uno dei servizi EAA (e-commerce, banca ai consumatori,
   trasporto passeggeri, comunicazioni elettroniche, media audiovisivi, e-book)?
   È una microimpresa (meno di 10 dipendenti e fatturato fino a 2 milioni)?
3. Il fatturato medio degli ultimi tre anni supera i 500 milioni?

Poi scrivi l'esito in una riga, con il regime e il documento:

```
REGIME: Servizi EAA (e-commerce) + Grandi imprese
DOCUMENTI: informazioni sull'accessibilità del servizio (Allegato IV D.Lgs. 82/2022)
           + dichiarazione di accessibilità annuale per sito e app, entro il 23 settembre
```

Se l'utente è uno sviluppatore che lavora **per** l'ente, ricordagli chi firma:
lo sviluppatore prepara, l'ente (per la PA tramite l'RTD o un delegato sul form)
presenta.

## 2. La base: una valutazione vera

La dichiarazione si scrive **dopo** una valutazione, non al posto di una
valutazione. Chiedi cosa c'è:

- Un audit completo dei 50 criteri con test manuali → si può dichiarare lo
  stato.
- Solo una scansione automatica → non basta per dichiarare "conforme". Proponi
  `/a11y-audit` e `/a11y-test-manuale`, oppure dichiara onestamente "non
  conforme" o "parzialmente conforme" con quello che si sa.
- Niente → si parte dalla valutazione.

## 3. Lo stato

| stato | quando |
| --- | --- |
| **conforme** | tutti i criteri WCAG 2.1 A e AA soddisfatti su tutto il campione, verificati anche a mano |
| **parzialmente conforme** | la maggior parte soddisfatti, con eccezioni elencate una per una |
| **non conforme** | la maggior parte non soddisfatti, o non c'è stata una valutazione |

Nel dubbio fra due stati, scegli il più severo. Una dichiarazione prudente si
migliora l'anno dopo; una falsa resta pubblicata.

## 4. I contenuti non accessibili

È la parte che conta. Per ogni problema rimasto aperto:

```
- Il modulo di prenotazione degli appuntamenti non si completa da tastiera:
  il calendario non si usa senza mouse (criterio 2.1.1).
  Motivo: inosservanza dei requisiti.
  Alternativa: prenotazione telefonica al numero [...], o via PEC a [...].
  Correzione prevista: [mese anno].
```

Scrivi in linguaggio semplice, per un cittadino, non per uno sviluppatore. Il
numero del criterio va tra parentesi, alla fine.

Per l'**onere sproporzionato**: invocalo solo se l'utente ha una valutazione
documentata (costi, benefici, durata stimata). Nel regime EAA la valutazione va
aggiornata almeno una volta l'anno e conservata per almeno 5 anni, e non vale
se ci sono finanziamenti per l'accessibilità, PNRR compreso. Se non c'è la
valutazione, il motivo è "inosservanza dei requisiti".

## 5. Meccanismo di feedback

Verifica che esista davvero e che sia accessibile:

- Un canale che chiunque può usare (un modulo accessibile, un indirizzo email),
  che accetti sia segnalazioni di barriere sia richieste di contenuti in formato
  accessibile.
- Un tempo di risposta dichiarato.
- Per la PA, la procedura se la risposta non arriva o non soddisfa: il ricorso
  al Difensore civico per il digitale presso AgID.

Un modulo di feedback con un CAPTCHA solo visivo è il classico errore: proprio
chi deve segnalare un problema non riesce a usarlo.

## 6. Se esiste già una dichiarazione, controlla che stia in piedi

Leggila (il link nel footer porta a form.agid.gov.it) e cerca le
incoerenze, che sono frequenti:

- "Parzialmente conforme" o "non conforme" senza nessun contenuto non
  accessibile elencato.
- Onere sproporzionato dichiarato senza dire per quali contenuti, e senza
  alternative accessibili.
- "Conforme" su un sito dove l'audit trova anche un solo criterio non
  soddisfatto.
- Data di redazione più vecchia dell'ultimo rifacimento del sito.

Segnala ogni incoerenza con il campo esatto e la correzione. Non riportare nel
tuo output i nomi e gli indirizzi personali che compaiono nella dichiarazione:
basta il ruolo (per esempio "il responsabile per la transizione al digitale").

## 7. Cosa produci

**PA e grandi imprese**: i testi pronti da incollare nei campi del form AgID o
del modello dell'Allegato 1, campo per campo. Se l'utente ti dà la dichiarazione
dell'anno prima (link o testo), parti da quella: aggiorna lo stato, togli i
problemi risolti, aggiungi quelli nuovi, segnala cosa è cambiato.

Non inventare i nomi dei campi del form. Se l'utente non li ha davanti, scrivi
i contenuti per argomento (stato, contenuti non accessibili, valutazione,
feedback) e digli che il form li chiede in quell'ordine o in uno simile.

**Obiettivi di accessibilità (PA, entro il 31 marzo)**: obiettivi concreti e
verificabili per l'anno, legati ai problemi trovati. "Rendere accessibile il
calendario delle prenotazioni entro giugno (2.1.1)" sì; "migliorare
l'accessibilità del sito" no.

**Servizi EAA**: il testo delle informazioni sull'accessibilità del servizio:
come il servizio soddisfa i requisiti, in forma comprensibile e accessibile,
con la dichiarazione di non usare tecniche di tracciamento che permettano di
desumere una disabilità. Se l'utente usa un overlay di accessibilità (i widget
che promettono conformità con una riga di script), segnalalo: non rende
conforme il sito, e le Linee guida 2026 citano gli overlay tra le tecniche di
tracciamento da non usare a quel fine.

**Calendario**: le prossime scadenze dell'utente con le date, da mettere nel
calendario o in un'attività programmata se l'utente lo chiede.

## Esempio di esito

```
DICHIARAZIONE DI ACCESSIBILITÀ · Comune di [...] · sito istituzionale
Regime: PA, Legge 4/2004 · Scadenza: 23 settembre 2027

STATO: parzialmente conforme
  Base: audit del 9/11/2026, 12 pagine e 3 servizi, autovalutazione

CONTENUTI NON ACCESSIBILI (4)
  1. Prenotazione appuntamenti: calendario non usabile da tastiera (2.1.1) ...
  2. Albo pretorio: 37 PDF scansionati senza testo (1.1.1) ...
  ...

FEEDBACK: modulo /segnala-accessibilita + accessibilita@comune.[...].it
  ⚠ il modulo ha un CAPTCHA visivo: va sostituito prima di pubblicare

OBIETTIVI 2027 (da pubblicare entro il 31 marzo 2027)
  ...
```
