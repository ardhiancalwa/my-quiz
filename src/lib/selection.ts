import type { Question } from "./contracts";
export function selectPractice(
  questions: Question[],
  count: number,
): Question[] {
  const groups = new Map<string, Question[]>();
  for (const q of questions) {
    const key = q.audio?.id ?? q.passage?.id ?? q.id;
    const group = groups.get(key) ?? [];
    group.push(q);
    groups.set(key, group);
  }
  const shuffled = [...groups.values()];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.flat().slice(0, count);
}
