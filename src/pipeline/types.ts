export type IdeaId = string;
export type Idea = {
    id: IdeaId;
    text: string;
};

export type PipelineContext = {
    angle: string;
    seed?: number;
};

export type RefineResult = {
    ideas: Idea[];
    notes?: string[];
};

export type RankResult = {
    ideas: (Idea & { score: number })[];
    notes?: string[];
};

export type SelectResult = {
    selected: (Idea & { score: number })[];
    notes?: string[];
};