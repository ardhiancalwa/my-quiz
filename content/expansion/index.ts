import { grammarExpansion } from "./grammar";
import { listeningExpansion } from "./listening";
import { readingExpansion } from "./reading";
export const expandedBank = [
  ...grammarExpansion,
  ...listeningExpansion,
  ...readingExpansion,
];
