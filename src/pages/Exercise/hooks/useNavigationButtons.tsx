import { allCorrect } from "../../../domain/answerChecker";
import { StepType } from "../../../types/StepType";

export interface UseNavigationButtonsParams {
  stepType: StepType;
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
  hasFocus: boolean;
};

export function useNavigationButtons({
  stepType,
  checkAnswerResults,
  onPrevious,
  onNext,
  onSubmit,
}: UseNavigationButtonsParams): {
  buttons: ButtonState[];
  exerciseComplete: boolean;
} {
  const buttons: ButtonState[] = [];

  // Visible and enabled during exercise and on submit step.
  buttons.push({
    text: "Previous",
    onClick: onPrevious,
    enabled: stepType === StepType.EXERCISE || stepType === StepType.SUBMIT,
    visible: true,
    hasFocus: false,
  });

  // Visible during start and exercise steps.
  // Enabled if all answers are correct (or if there are no answers required for the step).
  buttons.push({
    text: "Next",
    onClick: onNext,
    enabled:
      (stepType === StepType.START || stepType === StepType.EXERCISE) &&
      allCorrect(checkAnswerResults),
    visible: stepType === StepType.START || stepType === StepType.EXERCISE,
    hasFocus: false,
  });

  // Visible and enabled only on submit step.
  buttons.push({
    text: "Submit",
    onClick: onSubmit,
    enabled: stepType === StepType.SUBMIT,
    visible: stepType === StepType.SUBMIT,
    hasFocus: false,
  });

  // Used to display a link to the home page. We can't do this as a button
  // because of the navigation requirements.
  const exerciseComplete = stepType === StepType.COMPLETE;

  // Put focus on the last visible button if that button is enabled.
  const lastVisibleButtonIndex = buttons.findLastIndex(
    (button: ButtonState) => button.visible
  );
  if (
    lastVisibleButtonIndex !== -1 &&
    buttons[lastVisibleButtonIndex].enabled
  ) {
    buttons[lastVisibleButtonIndex].hasFocus = true;
  }

  return { buttons, exerciseComplete };
}
