import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cwd } from "node:process";
import test from "node:test";

async function readBuiltStyles() {
  const html = await readFile(join(cwd(), "dist", "index.html"), "utf8");
  const cssAsset = html.match(/href="([^"]+\.css)"/)?.[1];
  assert.ok(cssAsset, "The main HTML entry must reference its own CSS asset");
  return readFile(join(cwd(), "dist", cssAsset.replace(/^\//, "")), "utf8");
}

test("built CSS keeps Tailwind, React Flow, global, and feature styles in the protected order", async () => {
  const css = await readBuiltStyles();
  const tailwindTheme = css.indexOf("--color-app-background:");
  const reactFlow = css.indexOf(".react-flow{");
  const globalSizing = css.indexOf("html,body,#root{");
  const workflowCanvas = css.indexOf(".workflow-canvas{");

  assert.ok(tailwindTheme >= 0, "Tailwind v4 theme variables must be present in the built CSS");
  assert.ok(reactFlow > tailwindTheme, "React Flow official styles must load after Tailwind");
  assert.ok(globalSizing > reactFlow, "project global styles must load after React Flow");
  assert.ok(workflowCanvas > globalSizing, "workflow feature styles must load after project globals");
});

test("built CSS exposes application and workflow semantic tokens", async () => {
  const css = await readBuiltStyles();

  for (const token of [
    "--color-app-background:",
    "--color-panel:",
    "--color-primary:",
    "--color-focus-ring:",
    "--color-workflow-trigger:",
    "--color-workflow-condition:",
    "--color-workflow-action:",
    "--color-workflow-end:",
  ]) {
    assert.ok(css.includes(token), `missing built CSS token ${token}`);
  }
});
