# Come contribuire

Grazie! Questo pacchetto migliora soprattutto grazie a chi lavora davvero con
l'accessibilità nella PA e nelle aziende italiane. Non serve saper scrivere
codice: la maggior parte dei contributi utili sono testo.

## Cosa serve di più

1. **Aggiornamenti normativi, con la fonte.** Una determinazione AgID, una
   scadenza cambiata, la citazione della EN 301 549 v4.1.1 nella Gazzetta
   ufficiale UE. Aggiorna `skills/a11y-dichiarazione/riferimenti.md` e la data
   in cima al file. Senza un link a una fonte ufficiale o autorevole la modifica
   non entra.
2. **Errori tipici visti sul campo.** Un componente di Bootstrap Italia che si
   rompe, un modulo di un Comune che blocca chi usa la tastiera, un PDF
   dell'albo pretorio. Vanno nella skill più vicina, con il criterio WCAG e la
   correzione.
3. **Casi reali in `esempi/`.** Una pagina pubblica provata con le skill: cosa
   ha trovato la scansione, cosa solo i test manuali. Niente dati personali, e
   descrivi i problemi con rispetto: chi ha fatto il sito di solito ha fatto
   del suo meglio.
4. **Correzioni alle skill.** Se una skill ha dato una risposta sbagliata, apri
   una issue con il prompt, la risposta e cosa ti aspettavi.
5. **Codice.** Lo script di scansione (`skills/a11y-audit/scansiona.mjs`) e la
   CLI (`bin/cli.mjs`). Nuovi controlli automatici sono benvenuti, purché
   non dichiarino conforme ciò che non hanno verificato.

## Come si fa

1. Fai un fork e crea un branch.
2. Fai la modifica. Scrivi in italiano semplice, frasi brevi, niente gergo
   inutile: è lo stile di tutte le skill.
3. Se tocchi la CLI o lo script: `npm install && npm test`, e prova la
   scansione su `esempi/pagina-con-errori.html`.
4. Apri una pull request che dice cosa cambia e perché, con la fonte se è una
   novità normativa.

Le prime issue adatte a chi inizia sono etichettate
`good first issue`.

## Regole che non cambiano

- Nessuna skill dichiara conforme una pagina per una scansione pulita.
- Nessun overlay di accessibilità consigliato.
- I criteri non ancora obbligatori restano separati da quelli obbligatori.
- Non è consulenza legale, e il testo non deve farlo sembrare.

## Codice di condotta

Rispetto per tutti, in particolare per le persone con disabilità che usano i
servizi di cui parliamo. Commenti offensivi o discriminatori vengono rimossi.
