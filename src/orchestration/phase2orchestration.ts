import { PipelineContext, Idea } from "../pipeline/types";
import { RefineResult } from "../pipeline/types";
import { rankIdeas } from "../pipeline/rank/rankIdeas";
import { selectIdeas } from "../pipeline/select/selectIdeas";
import { refineIdeas } from "../pipeline/refine/refineIdeas";

export type Phase2PipelineOutput = {
    refined: Idea[];
    ranked: (Idea & { score: number })[];
    selected: (Idea & { score: number})[];
    notes: string[];
};

export function runPhase2Pipeline(ctx: PipelineContext, ideas: Idea[]): Phase2PipelineOutput{
    const notes: string[] = [];

    const refined: RefineResult = refineIdeas(ctx, ideas);
    notes.push(...(refined.notes ?? []));

    if (refined.ideas.length === 0) {
        notes.push("degrade:phase1_only");
            return {
                refined: [],
                ranked: [],
                selected: [],
                notes,
            };
        
    }

    const ranked = rankIdeas(ctx, refined.ideas);
    notes.push(...(ranked.notes ?? []));

    const selected= selectIdeas(ctx, ranked.ideas);
     notes.push(...(selected.notes ?? []));

    return {
        refined: refined.ideas,
        ranked: ranked.ideas,
        selected: selected.selected,
        notes,
    };
}
