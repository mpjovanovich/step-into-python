import { Precondition } from "@/utils/Preconditions";

/**
 * The result of checking a single answer.
 * true = correct
 * false = incorrect
 * null = unanswered
 */

/**
 * Checks submitted answers against correct answers.
 */
export function checkAnswers(
  userAnswers: string[],
  correctAnswers: string[]
): (boolean | null)[] {
  Precondition.notEmptyArray<string>(correctAnswers);
  Precondition.isTrue(userAnswers.length === correctAnswers.length);

  return correctAnswers.map((correct, i) => {
    const userAnswer = userAnswers[i];

    // Unanswered
    if (!userAnswer.trim()) {
      return null;
    }

    // User answered, return boolean result.
    const normalizedCorrect = normalizeForComparison(correct);
    const normalizedUserAnswer = normalizeForComparison(userAnswer);
    return normalizedCorrect === normalizedUserAnswer;
  });
}

// TODO: Don't know which of the two below I'm going to use; get rid of one when we're sure.
export function allCorrect(results: (boolean | null)[]): boolean {
  return results.every((r) => r === true);
}

/**
 * Removes all whitespace from a string.
 * E.g.: This allows "x = 5" or "x= 5" to match "x=5".
 */
function normalizeForComparison(str: string): string {
  return str.replace(/\s+/g, "");
}
