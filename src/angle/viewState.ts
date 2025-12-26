import { Angle, Idea } from "./domain";

export type IdeasStatus = "idle" | "loading" | "success" | "error";

export interface IdeaViewState {
    status: IdeasStatus;
    angle: Angle | null;
    ideas: Idea[];
    errorMessage: string | null;
}

export function createIdleState(): IdeaViewState {
    return {
        status: "idle",
        angle: null,
        ideas: [],
        errorMessage: null,
    };
}

export function createLoadingState(angle: Angle): IdeaViewState {
    return {
        status: "loading",
        angle,
        ideas: [],
        errorMessage: null,
    };

}

export function createSuccessState(
    angle: Angle,
    ideas: Idea[]   
): IdeaViewState {
    return {
        status: "success",
        angle,
        ideas,
        errorMessage: null,
    };
}

export function createErrorState(
    message: string,
    angle: Angle | null = null
): IdeaViewState {
    return {
        status: "error",
        angle,
        ideas:[],
        errorMessage: message,
    };
}