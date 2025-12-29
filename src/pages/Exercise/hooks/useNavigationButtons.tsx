import { allCorrect } from "../../../domain/answerChecker";

export interface UseNavigationButtonsParams {
  step: number;
  finalStep: number;
  checkAnswerResults: (boolean | null)[];
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export type ButtonState = {
  text: string;
  onClick: () => void;
  enabled: boolean;
  visible: boolean;
};

export function useNavigationButtons({
  step,
  finalStep,
  checkAnswerResults,
  onPrevious,
  onNext,
  onSubmit,
}: UseNavigationButtonsParams): {
  buttons: ButtonState[];
  exerciseComplete: boolean;
} {
  const buttons: ButtonState[] = [];

  // Previous button
  buttons.push({
    text: "Previous",
    onClick: onPrevious,
    enabled: step > 0 && step <= finalStep + 1,
    visible: true,
  });

  // Next button
  buttons.push({
    text: "Next",
    onClick: onNext,
    enabled: allCorrect(checkAnswerResults),
    visible: step < finalStep + 1,
  });

  // Submit button
  buttons.push({
    text: "Submit",
    onClick: onSubmit,
    enabled: true,
    visible: step === finalStep + 1,
  });

  // After submitting we increment the step to show the complete message.
  const exerciseComplete = step === finalStep + 2;

  return { buttons, exerciseComplete };
}
