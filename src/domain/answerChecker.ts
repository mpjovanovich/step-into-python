// export type AnswerResult = boolean | null;

// export interface CheckResult {
//   results: AnswerResult[];
//   allCorrect: boolean;
//   hasUnanswered: boolean;
// }

// /**
//  * Normalizes a string for comparison by removing all whitespace.
//  * This allows "x = 5" to match "x=5".
//  */
// function normalizeForComparison(str: string): string {
//   return str.replace(/\s+/g, "");
// }

// /**
//  * Checks user answers against correct answers.
//  *
//  * @returns Array of results: true = correct, false = incorrect, null = unanswered
//  */
// export function checkAnswers(
//   userAnswers: string[],
//   correctAnswers: string[]
// ): AnswerResult[] {
//   return correctAnswers.map((correct, i) => {
//     const userAnswer = userAnswers[i];
//     if (!userAnswer || userAnswer.trim() === "") {
//       return null; // Unanswered
//     }
//     return (
//       normalizeForComparison(correct) === normalizeForComparison(userAnswer)
//     );
//   });
// }

// /**
//  * Higher-level check that returns structured results.
//  */
// export function evaluateStep(
//   userAnswers: string[],
//   correctAnswers: string[]
// ): CheckResult {
//   const results = checkAnswers(userAnswers, correctAnswers);
//   return {
//     results,
//     allCorrect: results.length > 0 && results.every((r) => r === true),
//     hasUnanswered: results.some((r) => r === null || r === false),
//   };
// }
