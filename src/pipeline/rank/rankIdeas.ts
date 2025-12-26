import { Idea, PipelineContext, RankResult } from "../types";

function tokenizeAngle(angle: string): string[] {
    return angle
        .split(/[_\s]+/g)
        .map((t) => t.trim().toLocaleLowerCase())
        .filter(Boolean);
}


function scoreIdea(ctx: PipelineContext, idea:Idea): number {
    const text = (idea.text ?? "").toLocaleLowerCase();
    const tokens = tokenizeAngle(ctx.angle);

    let score = 0;

    for(const tok of tokens) {
        if(tok.length >= 3 && text.includes(tok)) score +=2;
    }
    if(/\d/.test(text)) score += 1;

    return score;
}

export function rankIdeas(ctx: PipelineContext, ideas:Idea[]): RankResult {
    const notes: string[] = [];

    const scored = ideas.map((i) => ({...i, score: scoreIdea(ctx, i) }));

    const scores = scored.map((s) => s.score);
    const allEqual = scores.length > 0 && scores.every((v) => v === scores[0]);

    const maxScore = scores.length > 0 ? Math.max(...scores) : 0;

    if(allEqual && scores.length > 1) notes.push("rank:tie");
    if(maxScore === 0 && scored.length > 0) notes.push ("rank:low_signal");

    scored.sort((a, b) => {
        if(b.score !== a.score) return b.score - a.score;
        return a.id.localeCompare(b.id);
    });

    return { ideas: scored, notes };
}
