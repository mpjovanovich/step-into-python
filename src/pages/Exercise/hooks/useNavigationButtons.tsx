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
  });

  // Visible during start and exercise steps.
  // Enabled if all answers are correct (or if there are no answers required for the step).
  buttons.push({
    text: "Next",
    onClick: onNext,
    enabled: allCorrect(checkAnswerResults),
    visible: stepType === StepType.START || stepType === StepType.EXERCISE,
  });

  // Visible and enabled only on submit step.
  buttons.push({
    text: "Submit",
    onClick: onSubmit,
    enabled: true,
    visible: stepType === StepType.SUBMIT,
  });

  // Used to display a link to the home page. We can't do this as a button
  // because of the navigation requirements.
  const exerciseComplete = stepType === StepType.COMPLETE;

  return { buttons, exerciseComplete };
}
