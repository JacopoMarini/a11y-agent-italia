#!/usr/bin/env node
// a11y-agent-italia — installa le skill per Claude o lancia la scansione.
//
//   npx a11y-agent-italia installa              copia le skill in ~/.claude/skills
//   npx a11y-agent-italia installa --progetto   copia le skill in ./.claude/skills
//   npx a11y-agent-italia installa --dest <dir> copia le skill in <dir>
//   npx a11y-agent-italia scansiona <url> ...   come skills/a11y-audit/scansiona.mjs

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const RADICE = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS = join(RADICE, "skills");
const { version } = JSON.parse(readFileSync(join(RADICE, "package.json"), "utf8"));

const AIUTO = `a11y-agent-italia ${version}

Uso:
  npx a11y-agent-italia installa              skill in ~/.claude/skills (tutti i progetti)
  npx a11y-agent-italia installa --progetto   skill in .claude/skills del progetto corrente
  npx a11y-agent-italia installa --dest <dir> skill in una cartella a scelta
  npx a11y-agent-italia scansiona <url-o-file> [--wcag22] [--out cartella] [--no-reflow]

Per la scansione serve Chromium: npx playwright install chromium
Documentazione: https://github.com/JacopoMarini/a11y-agent-italia`;

const [comando, ...resto] = process.argv.slice(2);

function installa(args) {
  let dest = join(homedir(), ".claude", "skills");
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--progetto") dest = resolve(".claude", "skills");
    else if (args[i] === "--dest") dest = resolve(args[++i] ?? "");
    else {
      console.error(`Opzione sconosciuta: ${args[i]}\n\n${AIUTO}`);
      process.exit(1);
    }
  }
  mkdirSync(dest, { recursive: true });
  const nomi = readdirSync(SKILLS).filter((n) => n.startsWith("a11y-"));
  const aggiornate = [];
  for (const nome of nomi) {
    const verso = join(dest, nome);
    if (existsSync(verso)) aggiornate.push(nome);
    // le skill si leggono i file a vicenda: vanno copiate sempre tutte insieme
    cpSync(join(SKILLS, nome), verso, { recursive: true, force: true });
  }
  console.log(`Installate ${nomi.length} skill in ${dest}`);
  if (aggiornate.length) console.log(`Aggiornate (sovrascritte): ${aggiornate.join(", ")}`);
  console.log("\nIn Claude Code, prova: /a11y-audit");
}

function scansiona(args) {
  const script = join(SKILLS, "a11y-audit", "scansiona.mjs");
  const r = spawnSync(process.execPath, [script, ...args], { stdio: "inherit" });
  process.exit(r.status ?? 1);
}

switch (comando) {
  case "installa":
  case "install":
    installa(resto);
    break;
  case "scansiona":
  case "scan":
    scansiona(resto);
    break;
  case "-v":
  case "--version":
    console.log(version);
    break;
  case undefined:
  case "-h":
  case "--help":
  case "aiuto":
    console.log(AIUTO);
    break;
  default:
    console.error(`Comando sconosciuto: ${comando}\n\n${AIUTO}`);
    process.exit(1);
}
