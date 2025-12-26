"use client";

import { useState } from "react";

import { loadIdeasForAngle } from "anglelab-core/src/angle/orchestrator";
import type { IdeaViewState } from "anglelab-core/src/angle/viewState";

import { runPhase2Pipeline } from "anglelab-core/src/orchestration/phase2orchestration";
import { toPipelineIdeas } from "anglelab-core/src/pipeline/toPipelineIdeas";
import type { PipelineContext } from "anglelab-core/src/pipeline/types";

const ANGLES = ["Time_Saving", "Money_Saving", "Growth", "Risk_Reduction"] as const;
type Angle = (typeof ANGLES)[number];

function isSuccess(state: IdeaViewState): state is IdeaViewState & { status: "success" } {
  return state.status === "success";
}

export default function AngleLabClient() {
  const [angle, setAngle] = useState<Angle>("Time_Saving");

  const [state, setState] = useState<IdeaViewState>({
    status: "idle",
    angle: null,
    ideas: [],
    errorMessage: null,
  });

  const [phase2, setPhase2] = useState<ReturnType<typeof runPhase2Pipeline> | null>(null);

  async function run() {
    setPhase2(null);

    // UI is dumb: render + wiring only
    setState({
      status: "loading",
      angle: null,
      ideas: [],
      errorMessage: null,
    });

    const nextState = await loadIdeasForAngle(angle);
    setState(nextState);

    if (isSuccess(nextState)) {
      const ctx: PipelineContext = { angle: nextState.angle ?? angle };
      const pipelineIdeas = toPipelineIdeas(nextState.ideas);
      const out = runPhase2Pipeline(ctx, pipelineIdeas);
      setPhase2(out);
    }
  }

  return (
    <main style={{ padding: 16, fontFamily: "system-ui, sans-serif", maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>AngleLab — Phase 3 (Next Consumer)</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        UI-min: consumă Phase 1 (ViewState) + Phase 2 (rules pipeline). Fără logică în UI.
      </p>

      <section style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 10 }}>
          Angle:
          <select
            value={angle}
            onChange={(e) => setAngle(e.target.value as Angle)}
            style={{ marginLeft: 8, padding: 6 }}
          >
            {ANGLES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>

        <button onClick={run} style={{ padding: "8px 12px" }}>
          Run
        </button>
      </section>

      <section style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>Phase 1 — ViewState</h2>
        <div>
          <b>Status:</b> {state.status}
        </div>
        <div>
          <b>Angle:</b> {state.angle ?? "(none)"}
        </div>

        {state.status === "error" && (
          <div style={{ marginTop: 10 }}>
            <b>Error:</b> {state.errorMessage ?? "Unknown error"}
          </div>
        )}

        {state.status === "success" && (
          <div style={{ marginTop: 10 }}>
            <b>Ideas:</b>
            <ul>
              {state.ideas.map((i) => (
                <li key={i.id}>{i.title}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
        <h2 style={{ marginTop: 0 }}>Phase 2 — Rules Pipeline Output</h2>

        {!phase2 && <div style={{ opacity: 0.7 }}>(Run ca să vezi refined/ranked/selected + notes)</div>}

        {phase2 && (
          <>
            <div style={{ marginBottom: 10 }}>
              <b>Notes:</b>
              {phase2.notes.length === 0 ? (
                <span> (none)</span>
              ) : (
                <ul>
                  {phase2.notes.map((n, idx) => (
                    <li key={idx}>{n}</li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <b>Refined</b>
                <ul>
                  {phase2.refined.map((i) => (
                    <li key={i.id}>{i.text}</li>
                  ))}
                </ul>
              </div>

              <div>
                <b>Selected</b>
                {phase2.selected.length === 0 ? (
                  <div style={{ opacity: 0.7 }}>(none)</div>
                ) : (
                  <ul>
                    {phase2.selected.map((i) => (
                      <li key={i.id}>
                        {i.text} ({i.score})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <b>Ranked (top)</b>
              <ul>
                {phase2.ranked.slice(0, 8).map((i) => (
                  <li key={i.id}>
                    {i.text} ({i.score})
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
