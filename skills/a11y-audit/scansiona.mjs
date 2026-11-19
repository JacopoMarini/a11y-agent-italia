#!/usr/bin/env node
// scansiona.mjs — scansione automatica di accessibilità con axe-core e Playwright,
// con report in italiano raggruppato per criterio WCAG.
//
// Uso:
//   node scansiona.mjs <url-o-file.html> [altri...] [--wcag22] [--out cartella] [--no-reflow]
//
// Dipendenze (nel progetto o in una cartella di lavoro):
//   npm i -D playwright axe-core && npx playwright install chromium

import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const QUI = dirname(fileURLToPath(import.meta.url));

function carica(nome) {
  for (const base of [join(process.cwd(), "/"), join(QUI, "/")]) {
    try {
      const req = createRequire(base);
      return { mod: req(nome), percorso: req.resolve(nome) };
    } catch {}
  }
  console.error(
    `Manca il pacchetto "${nome}".\n` +
      "Installa nella cartella da cui lanci lo script:\n" +
      "  npm i -D playwright axe-core && npx playwright install chromium"
  );
  process.exit(2);
}

const args = process.argv.slice(2);
const opz = { wcag22: false, out: "a11y-report", reflow: true };
const obiettivi = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--wcag22") opz.wcag22 = true;
  else if (a === "--no-reflow") opz.reflow = false;
  else if (a === "--out") opz.out = args[++i];
  else if (a === "-h" || a === "--help") {
    console.log("node scansiona.mjs <url-o-file.html> [...] [--wcag22] [--out cartella] [--no-reflow]");
    process.exit(0);
  } else obiettivi.push(a);
}
if (!obiettivi.length) {
  console.error("Indica almeno un URL o un file HTML.");
  process.exit(1);
}

const { mod: playwright } = carica("playwright");
const { percorso: axePath } = carica("axe-core");
const axeSorgente = readFileSync(axePath.replace(/axe(\.min)?\.js$/, "axe.min.js"), "utf8");
// messaggi di axe in italiano, se la versione installata ha la traduzione
let localeIt = null;
try {
  localeIt = JSON.parse(readFileSync(join(dirname(axePath), "locales", "it.json"), "utf8"));
} catch {}

const criteri = Object.fromEntries(
  JSON.parse(readFileSync(join(QUI, "criteri-wcag21.json"), "utf8")).criteri.map((c) => [c.id, c])
);
let criteri22 = {};
const file22 = join(QUI, "..", "a11y-wcag22", "criteri-wcag22-nuovi.json");
if (existsSync(file22)) {
  criteri22 = Object.fromEntries(JSON.parse(readFileSync(file22, "utf8")).criteri.map((c) => [c.id, c]));
}

const TAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];
if (opz.wcag22) TAG.push("wcag22aa");

const IMPATTO = { critical: "critico", serious: "grave", moderate: "moderato", minor: "lieve" };
const ORDINE_IMPATTO = { critical: 0, serious: 1, moderate: 2, minor: 3 };

const quanti = (n) => `${n} ${n === 1 ? "elemento" : "elementi"}`;

// "wcag1410" -> "1.4.10"
function sc(tag) {
  const m = /^wcag(\d)(\d)(\d+)$/.exec(tag);
  return m ? `${m[1]}.${m[2]}.${m[3]}` : null;
}

function verso(obiettivo) {
  if (/^https?:\/\//i.test(obiettivo) || obiettivo.startsWith("file:")) return obiettivo;
  const p = resolve(obiettivo);
  if (!existsSync(p)) {
    console.error(`File non trovato: ${obiettivo}`);
    process.exit(1);
  }
  return pathToFileURL(p).href;
}

async function controllaReflow(browser, url) {
  const pagina = await browser.newPage({ viewport: { width: 320, height: 256 } });
  await pagina.goto(url, { waitUntil: "load" });
  const r = await pagina.evaluate(() => {
    const doc = document.documentElement;
    const larghezza = doc.clientWidth;
    const troppoLarghi = [];
    const giaSegnalati = [];
    for (const el of document.body.querySelectorAll("*")) {
      const box = el.getBoundingClientRect();
      if (box.width === 0 || box.right <= larghezza + 1) continue;
      // tieni solo gli elementi più esterni: i figli di uno già segnalato sono la stessa causa
      if (giaSegnalati.some((g) => g.contains(el))) continue;
      // un contenitore che scorre da solo è accettabile (tabelle di dati, codice)
      let p = el.parentElement, scorreDaSolo = false;
      while (p && p !== document.body) {
        const s = getComputedStyle(p);
        if (/(auto|scroll)/.test(s.overflowX) && p.getBoundingClientRect().right <= larghezza + 1) { scorreDaSolo = true; break; }
        p = p.parentElement;
      }
      if (scorreDaSolo) continue;
      const id = el.id ? `#${el.id}` : "";
      const cls = typeof el.className === "string" && el.className.trim() ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
      giaSegnalati.push(el);
      troppoLarghi.push({ selettore: `${el.tagName.toLowerCase()}${id}${cls}`, destra: Math.round(box.right) });
    }
    return { larghezza, scrollWidth: doc.scrollWidth, elementi: troppoLarghi.slice(0, 10) };
  });
  await pagina.close();
  return r;
}

function riga(v) {
  return v.nodes.slice(0, 5).map((n) => `    - \`${n.target.join(" ")}\`${n.failureSummary ? `\n      ${n.failureSummary.split("\n").slice(1).map((x) => x.trim()).filter(Boolean).join(" · ")}` : ""}`).join("\n");
}

// Chromium di Playwright; se manca, CHROME_PATH o il Chrome installato nel sistema.
async function avvia() {
  const tentativi = [];
  if (process.env.CHROME_PATH) tentativi.push({ executablePath: process.env.CHROME_PATH });
  tentativi.push({}, { channel: "chrome" });
  let ultimo;
  for (const t of tentativi) {
    try { return await playwright.chromium.launch(t); } catch (e) { ultimo = e; }
  }
  console.error("Non riesco ad avviare Chromium. Esegui `npx playwright install chromium` o imposta CHROME_PATH.\n" + ultimo.message.split("\n")[0]);
  process.exit(2);
}
const browser = await avvia();
const risultati = [];
for (const obiettivo of obiettivi) {
  const url = verso(obiettivo);
  const pagina = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await pagina.goto(url, { waitUntil: "load" });
  await pagina.addScriptTag({ content: axeSorgente });
  const axe = await pagina.evaluate(async ({ tag, locale }) => {
    /* global axe */
    if (locale) axe.configure({ locale });
    return await axe.run(document, { runOnly: { type: "tag", values: tag }, resultTypes: ["violations", "incomplete"] });
  }, { tag: TAG, locale: localeIt });
  const titolo = await pagina.title();
  await pagina.close();
  const reflow = opz.reflow ? await controllaReflow(browser, url) : null;
  risultati.push({ obiettivo, url, titolo, axe, reflow });
}
await browser.close();

// ---- report ----
mkdirSync(opz.out, { recursive: true });
const oggi = new Date().toISOString().slice(0, 10);
const md = [];
md.push(`# Scansione automatica di accessibilità`);
md.push("");
md.push(`Data: ${oggi} · Regole: ${TAG.join(", ")} · Motore: axe-core`);
md.push("");
md.push("> Una scansione automatica trova solo una parte dei problemi. Questo report non è una valutazione di conformità: per quella servono i test manuali (`/a11y-test-manuale`).");
md.push("");

let totale = 0;
const criteriColpiti = new Set();
for (const r of risultati) {
  md.push(`## ${r.titolo || "(pagina senza titolo)"}`);
  md.push("");
  md.push(`\`${r.obiettivo}\``);
  md.push("");
  const perCriterio = new Map();
  for (const v of r.axe.violations) {
    const ids = v.tags.map(sc).filter(Boolean);
    const chiave = ids.length ? ids.join(", ") : "best practice";
    if (!perCriterio.has(chiave)) perCriterio.set(chiave, []);
    perCriterio.get(chiave).push(v);
    ids.forEach((i) => criteriColpiti.add(i));
    totale += v.nodes.length;
  }
  if (!perCriterio.size) {
    md.push("Nessuna violazione rilevata automaticamente.");
    md.push("");
  }
  const chiavi = [...perCriterio.keys()].sort((a, b) => a.localeCompare(b, "it", { numeric: true }));
  for (const chiave of chiavi) {
    const primo = chiave.split(", ")[0];
    const c = criteri[primo] || criteri22[primo];
    const nuovo22 = !criteri[primo] && criteri22[primo];
    md.push(`### ${chiave} ${c ? `${c.nome} (${c.livello})` : ""}${nuovo22 ? " · solo WCAG 2.2" : ""}`);
    if (c) md.push(`_${c.cosa}_`);
    md.push("");
    for (const v of perCriterio.get(chiave).sort((a, b) => ORDINE_IMPATTO[a.impact] - ORDINE_IMPATTO[b.impact])) {
      md.push(`- **${IMPATTO[v.impact] || v.impact}** · \`${v.id}\` · ${quanti(v.nodes.length)} · ${v.help}`);
      md.push(riga(v));
    }
    md.push("");
  }
  if (r.axe.incomplete.length) {
    md.push(`### Da verificare a mano (${r.axe.incomplete.length})`);
    md.push("axe non è riuscito a decidere. Di solito: contrasto su immagini o gradienti, testo nascosto, iframe.");
    md.push("");
    for (const v of r.axe.incomplete) {
      const ids = v.tags.map(sc).filter(Boolean).join(", ");
      md.push(`- \`${v.id}\` (${ids || "best practice"}) · ${quanti(v.nodes.length)} · ${v.help}`);
    }
    md.push("");
  }
  if (r.reflow) {
    md.push("### 1.4.10 Reflow a 320 px");
    if (r.reflow.scrollWidth > r.reflow.larghezza + 1) {
      criteriColpiti.add("1.4.10");
      md.push(`**Probabile violazione**: la pagina è larga ${r.reflow.scrollWidth} px su ${r.reflow.larghezza} px disponibili, quindi scorre in orizzontale.`);
      if (r.reflow.elementi.length) {
        md.push("Elementi che escono dal riquadro (i primi):");
        r.reflow.elementi.forEach((e) => md.push(`- \`${e.selettore}\` arriva a ${e.destra} px`));
      }
      md.push("Tabelle di dati, mappe e codice possono scorrere, ma dentro un loro contenitore, non con tutta la pagina.");
    } else {
      md.push("Nessuno scorrimento orizzontale della pagina a 320 px.");
    }
    md.push("");
  }
}

const manuali = Object.values(criteri).filter((c) => c.verifica === "manuale").map((c) => c.id);
md.push("## Cosa questa scansione non può dire");
md.push("");
md.push(`Questi ${manuali.length} criteri si verificano solo a mano: ${manuali.join(", ")}.`);
md.push("");
md.push("Anche per gli altri, l'assenza di errori automatici non prova la conformità.");

const nomeBase = join(opz.out, `scansione-${oggi}`);
writeFileSync(`${nomeBase}.md`, md.join("\n"));
writeFileSync(`${nomeBase}.json`, JSON.stringify(risultati.map((r) => ({ obiettivo: r.obiettivo, titolo: r.titolo, violations: r.axe.violations, incomplete: r.axe.incomplete, reflow: r.reflow })), null, 2));

console.log(`Pagine: ${risultati.length} · elementi in violazione: ${totale} · criteri coinvolti: ${[...criteriColpiti].sort((a, b) => a.localeCompare(b, "it", { numeric: true })).join(", ") || "nessuno"}`);
console.log(`Report: ${nomeBase}.md`);
process.exit(totale > 0 ? 1 : 0);
