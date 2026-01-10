import { type ExerciseButtonState } from "../../../types/ExerciseButtonState";
import { ExerciseButtonType } from "../../../types/ExerciseButtonType";
import { ExerciseStepType } from "../../../types/ExerciseStepType";

export function getButtonStates(
  stepType: ExerciseStepType,
  allCorrect: boolean
): Map<ExerciseButtonType, ExerciseButtonState> {
  const buttons = new Map<ExerciseButtonType, ExerciseButtonState>([
    [
      ExerciseButtonType.PREVIOUS,
      {
        enabled:
          stepType === ExerciseStepType.EXERCISE ||
          stepType === ExerciseStepType.SUBMIT,
        visible: true,
        hasFocus: false,
      },
    ],
    [
      ExerciseButtonType.NEXT,
      {
        enabled:
          (stepType === ExerciseStepType.START ||
            stepType === ExerciseStepType.EXERCISE) &&
          allCorrect,
        visible:
          stepType === ExerciseStepType.START ||
          stepType === ExerciseStepType.EXERCISE,
        hasFocus: false,
      },
    ],
    [
      ExerciseButtonType.SUBMIT,
      {
        enabled: stepType === ExerciseStepType.SUBMIT,
        visible: stepType === ExerciseStepType.SUBMIT,
        hasFocus: false,
      },
    ],
  ]);

  const lastVisibleButton = Array.from(buttons.values()).findLast(
    (button) => button.visible
  );
  if (lastVisibleButton && lastVisibleButton.enabled) {
    lastVisibleButton.hasFocus = true;
  }

  return buttons;
}
