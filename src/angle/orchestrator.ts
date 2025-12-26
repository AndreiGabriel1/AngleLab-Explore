import { Angle, generateIdeas } from "./domain";
import {
  createLoadingState,
  createSuccessState,
  createErrorState,
  IdeaViewState,
} from "./viewState";

import { parseAngle } from "./schema/angleSchema";


function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loadIdeasForAngle(
  rawAngle: string
): Promise<IdeaViewState> {
  const result = parseAngle(rawAngle);

  if (!result.ok) {
    return createErrorState(result.error);
  }

  const angle = result.value;

  const loadingState = createLoadingState(angle);
  void loadingState; 

  await delay(150);

  const ideas = generateIdeas(angle);

  return createSuccessState(angle, ideas);
}
