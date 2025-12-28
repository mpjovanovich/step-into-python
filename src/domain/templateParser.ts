// Matches @@anything@@
export const BLANK_REGEX = /@@.*?@@/g;

/*
 * code:
 *  All previous steps display as plain text.
 *  The current step displays as code with @@ markers intact for input placement.
 *  All subsequent steps are hidden.
 * copyCode:
 *  All previous and current steps display as plain text.
 *  No @@ markers.
 *  Used for copying to clipboard.
 * answers:
 *  Correct answers for the current step, extracted from @@answer@@ markers
 *  May be empty if the current step doesn't have any answers.
 */
export interface ParsedTemplate {
  code: string;
  copyCode: string;
  answers: string[];
}

export interface ParseOptions {
  title: string;
  questionTemplate: string[];
  currentStep: number;
}

/**
 * Parses the exercise template and returns the code for the current step.
 */
export function parseTemplate({
  title,
  questionTemplate,
  currentStep,
}: ParseOptions): ParsedTemplate {
  let code = `## EXERCISE: ${title}\n`;
  const answers: string[] = [];

  for (const line of questionTemplate) {
    const { startStep, endStep } = getStepRangeFromLine(line);
    const lineCode = getCodeFromLine(line);

    if (startStep < currentStep && endStep >= currentStep) {
      // If the parsed line's range is valid for the current step:
      //  - strip @@ markers
      //  - append to code
      code += lineCode.replaceAll("@@", "") + "\n";
    } else if (startStep === currentStep) {
      // If this is the current step, append the code as is (with @@ markers)
      code += lineCode + "\n";

      // Extract answers from the code.
      const matches = lineCode.match(BLANK_REGEX);
      if (matches) {
        answers.push(...matches.map((m) => m.slice(2, -2)));
      }
    }
  }

  const copyCode = code.replace(BLANK_REGEX, "");

  return {
    code,
    copyCode,
    answers,
  };
}

/**
 * Extracts the number of steps in a template.
 */
export function getStepCount(questionTemplate: string[]): number {
  return getStepRangeFromLine(questionTemplate[questionTemplate.length - 1])
    .startStep;
}

function getStepRangeFromLine(line: string): {
  startStep: number;
  endStep: number;
} {
  // First question mark is syntax for step range.
  const [stepRange] = line.split("?");

  // Parse step range (e.g., "1" or "1:3")
  const [startStr, endStr] = stepRange.split(":");
  const startStep = parseInt(startStr, 10);
  const endStep = endStr ? parseInt(endStr, 10) : Infinity;

  // If template was malformed, let the caller know.
  if (isNaN(startStep)) {
    throw new Error(`Invalid step range for line: ${line}`);
  }

  return { startStep, endStep };
}

function getCodeFromLine(line: string): string {
  // First question mark is syntax for step range.
  const [_, ...codeParts] = line.split("?");
  // Any additional question marks are part of the code.
  const lineCode = codeParts.join("?");

  return lineCode;
}
