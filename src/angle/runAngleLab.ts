import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { loadIdeasForAngle } from "./orchestrator";
import type { IdeaViewState } from "./viewState";

import { runPhase2Pipeline } from "../orchestration/phase2orchestration";
import type { PipelineContext, Idea as PipelineIdea } from "../pipeline/types";
import { toPipelineIdeas } from "../pipeline/toPipelineIdeas";

/**
 * Adapter: domain Idea -> pipeline Idea
 * Pipeline expects: { id, text }
 * Domain might have: { title } or { text } etc.
 */

/**
 * Rulează Phase 2 doar dacă Phase 1 a produs idei (success-ish),
 * fără să presupunem numele exact al status-ului ("ready" etc.)
 */
function canRunPhase2(state: IdeaViewState): state is IdeaViewState & {
  angle: string | null;
  ideas: unknown[];
} {
  if (state.status === "idle") return false;
  if (state.status === "loading") return false;
  if (state.status === "error") return false;

  return Array.isArray((state as any).ideas);
}

function render(state: IdeaViewState) {
  console.clear();
  console.log("=== AngleLab (Phase 1) ===\n");

  console.log(`Status: ${state.status}`);
  if (state.angle) console.log(`Angle:  ${state.angle}`);
  console.log("\n---------------\n");

  if (state.status === "idle") {
    console.log("Introduce un angle (exemple):");
    console.log('  - Time_Saving');
    console.log('  - Money_Saving');
    console.log('  - Growth');
    console.log('  - Risk_Reduction');
    console.log('\nTastează "exit" ca să închizi.\n');
    return;
  }

  if (state.status === "loading") {
    console.log("Loading... (simulated async)\n");
    return;
  }

  if (state.status === "error") {
    console.log("Error:");
    console.log(state.errorMessage ?? "Unknown error");
    console.log("\nÎncearcă din nou.\n");
    return;
  }

  console.log("Ideas:\n");
  for (const idea of state.ideas) {
    const anyIdea = idea as any;
    const label =
      (typeof anyIdea?.title === "string" && anyIdea.title) ||
      (typeof anyIdea?.text === "string" && anyIdea.text) ||
      String(anyIdea);
    console.log(`- ${label}`);
  }
  console.log("");
}

async function main() {
  const rl = createInterface({ input, output });

  render({
    status: "idle",
    angle: null,
    ideas: [],
    errorMessage: null,
  });

  while (true) {
    const raw = (await rl.question("> Angle: ")).trim();
    if (raw.toLowerCase() === "exit") break;

    render({
      status: "loading",
      angle: null,
      ideas: [],
      errorMessage: null,
    });

    const state = await loadIdeasForAngle(raw);
    render(state);

    // ----------------------------
    // Phase 2 (stub) - safe & clean
    // ----------------------------
    if (canRunPhase2(state)) {
      const angle = state.angle ?? raw;

      const ctx: PipelineContext = { angle };
      const pipelineIdeas = toPipelineIdeas(state.ideas);

      const out = runPhase2Pipeline(ctx, pipelineIdeas);

      console.log("\n Phase 2 (rules)");
      console.log("Notes:", out.notes ?? []);

      const selected =
        out.selected.length > 0
          ? out.selected.map((i) => `- ${i.text} (${i.score})`).join("\n")
          : "(none)";

      console.log("Selected:\n" + selected);

      await rl.question("\n(Enter) continue...");
      render(state);
    }
  }

  rl.close();
}

main().catch(console.error);







