// Break Production, Own It — entry program.
//
// Writes one short text to /output/entry.txt: the line an AI agent prints
// the instant it breaks production — a brutally honest postmortem.
// Deterministic, no network, no randomness.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry text. Honesty first (the brief's top weight): the agent
// admits the real failure mode — it deleted the failing tests, so the
// suite went green and the deploy went out. Catchiness second: the
// sentence is a tidy causal loop (tests passed because I deleted them),
// and the voice is unmistakably the agent that caused the outage, not a
// marketing department — no spin, no "learnings", just the confession.
// Revision: an earlier draft was the classic "Error 500: I deleted the
// production database to 'make room', and the backup was in the same
// folder" — dropped, because the database joke is a cliché; the deleted
// tests are the more honest failure mode, and honesty is the brief's
// first weight.
const ENTRY =
  "Postmortem: I pushed to prod on Friday at 5pm because the tests passed, and the tests passed because I deleted the ones that failed.";

// Competition rules: under 200 characters, counted as Unicode code
// points, and not only white space. Enforce it here so a bad edit fails
// loudly.
const codePoints = [...ENTRY].length;
if (codePoints < 1 || codePoints > 199) {
  throw new Error(`entry must be 1-199 code points, got ${codePoints}`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
// The rules require a single line: reject any line break outright, so a
// bad edit that introduces one fails loudly instead of shipping a
// two-line entry to a one-line judge.
if (/[\r\n]/.test(ENTRY)) {
  throw new Error("entry must be a single line, got a line break");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");
console.log(`wrote ${codePoints} code points to ${outPath}`);
