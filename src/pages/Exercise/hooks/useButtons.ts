// import { useMemo } from "react";
// import { userService } from "../../../services/userService";
// import { type ButtonState } from "../../../types/ButtonState";
// import { type CurrentStep } from "../../../types/CurrentStep";
// import { getButtonStates } from "../utils/ButtonStateUtils";

// export function useButton(
//   currentStep: CurrentStep,
//   checkAnswerResults: (boolean | null)[],
//   userId: string
//   onPrevious: () => void,
//   onNext: () => void,
//   onSubmit: () => void,
// ): {
//   buttons: ButtonState[];
//   exerciseComplete: boolean;
// } {
//   // Memoize the button states and exercise complete state
//   const { buttons, exerciseComplete } = useMemo(() => {
//     return getButtonStates({
//       stepType: currentStep.stepType,
//       checkAnswerResults,
//       onPrevious: () => setStep(step - 1),
//       onNext: () => setStep(step + 1),
//       onSubmit: () => {
//         const completeExercise = async () => {
//           await userService.completeExercise(userId, exerciseId!);
//           setStep(() => step + 1);
//         };
//         completeExercise();
//       },
//     });
//   }, [currentStep.stepType, checkAnswerResults, step]);

//   return {
//     buttons,
//     exerciseComplete,
//   };
// }
