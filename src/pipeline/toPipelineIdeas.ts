import type { Idea as PipelineIdea } from "./types";

export function toPipelineIdeas(domainIdeas: any[]): PipelineIdea[] {
  return domainIdeas.map((idea, index) => {
    const anyIdea = idea as any;

    const text =
      (typeof anyIdea?.text === "string" && anyIdea.text) ||
      (typeof anyIdea?.title === "string" && anyIdea.title) ||
      (typeof anyIdea?.name === "string" && anyIdea.name) ||
      String(anyIdea);

    return {
      id: `p2-${index}`,
      text,
    };
  });
}
