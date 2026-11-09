# Scansione automatica di accessibilità

Data: 2026-11-09 · Regole: wcag2a, wcag2aa, wcag21a, wcag21aa · Motore: axe-core

> Una scansione automatica trova solo una parte dei problemi. Questo report non è una valutazione di conformità: per quella servono i test manuali (`/a11y-test-manuale`).

## Comune

`esempi/pagina-con-errori.html`

### 1.1.1 Non-text Content (A)
_Ogni contenuto non testuale ha un'alternativa testuale che ne svolge la funzione. Le immagini decorative si nascondono alle tecnologie assistive._

- **critico** · `image-alt` · 1 elemento · Le immagini devono avere un testo alternativo
    - `img`
      L'elemento non ha un attributo alt · L'attributo aria-label non esiste o è vuoto · L'attributo aria-labelledby non esiste, fa riferimento ad elementi che non esistono o fa riferimento ad elementi che sono vuoti · L'elemento non ha un attributo title · La semantica predefinita dell'elemento non è stata sostituita da role="none" o role="presentation"

### 1.4.3 Contrast (Minimum) (AA)
_Contrasto del testo almeno 4.5:1, o 3:1 per testo grande._

- **grave** · `color-contrast` · 1 elemento · Gli elementi devono soddisfare le soglie minime del rapporto di contrasto di colore
    - `.nota`
      L'elemento ha un contrasto di colore insufficiente di 2.81 (colore in primo piano: #9a9a9a, colore di sfondo: #ffffff, dimensione del font: 12.0pt (16px), peso del font: normal). Contrasto atteso di 4.5:1

### 1.4.4 Resize text (AA)
_Il testo si ingrandisce fino al 200% senza perdere contenuto o funzioni._

- **moderato** · `meta-viewport` · 1 elemento · Lo zoom e il ridimensionamento non devono essere disabilitati
    - `meta[name="viewport"]`
      maximum-scale sul tag <meta> disabilita lo zoom sui dispositivi mobili

### 4.1.2 Name, Role, Value (A)
_Ogni componente dell'interfaccia ha nome, ruolo e stato leggibili dalle tecnologie assistive._

- **critico** · `button-name` · 1 elemento · I pulsanti devono avere un testo distinguibile
    - `button`
      L'elemento non ha del testo interno che è visibile agli screen reader · L'attributo aria-label non esiste o è vuoto · L'attributo aria-labelledby non esiste, fa riferimento ad elementi che non esistono o fa riferimento ad elementi che sono vuoti · L'elemento non ha un attributo title · L'elemento del modulo non ha un'etichetta implicita (racchiusa) <label> · L'elemento del modulo non ha un'etichetta esplicita <label> · La semantica predefinita dell'elemento non è stata sostituita da role="none" o role="presentation"
- **critico** · `select-name` · 1 elemento · L'elemento select deve avere un nome accessibile
    - `select`
      L'elemento del modulo non ha un'etichetta implicita (racchiusa) <label> · L'elemento del modulo non ha un'etichetta esplicita <label> · L'attributo aria-label non esiste o è vuoto · L'attributo aria-labelledby non esiste, fa riferimento ad elementi che non esistono o fa riferimento ad elementi che sono vuoti · L'elemento non ha un attributo title · La semantica predefinita dell'elemento non è stata sostituita da role="none" o role="presentation"

### 1.4.10 Reflow a 320 px
**Probabile violazione**: la pagina è larga 900 px su 320 px disponibili, quindi scorre in orizzontale.
Elementi che escono dal riquadro (i primi):
- `table.tabella` arriva a 900 px
Tabelle di dati, mappe e codice possono scorrere, ma dentro un loro contenitore, non con tutta la pagina.

## Cosa questa scansione non può dire

Questi 32 criteri si verificano solo a mano: 1.2.1, 1.2.2, 1.2.3, 1.2.4, 1.2.5, 1.3.2, 1.3.3, 1.3.4, 1.4.2, 1.4.5, 1.4.12, 1.4.13, 2.1.2, 2.1.4, 2.2.1, 2.2.2, 2.3.1, 2.4.3, 2.4.5, 2.4.6, 2.5.1, 2.5.2, 2.5.4, 3.1.2, 3.2.1, 3.2.2, 3.2.3, 3.2.4, 3.3.1, 3.3.3, 3.3.4, 4.1.3.

Anche per gli altri, l'assenza di errori automatici non prova la conformità.