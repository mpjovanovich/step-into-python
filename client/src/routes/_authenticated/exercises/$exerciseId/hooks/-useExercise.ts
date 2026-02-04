import { checkAnswers } from "@/domain/answerChecker";
import {
  getCodeForStep,
  getStepCount,
  type CodeForStep,
} from "@/domain/templateParser";
import { type CurrentStep } from "@/types/CurrentStep";
import { type Exercise } from "@/types/Exercise";
import { useEffect, useMemo } from "react";
import { getCurrentStepProperties } from "../utils/-exerciseUtils";

export function useExercise(
  exercise: Exercise,
  step: number,
  userAnswers: string[],
  setUserAnswers: (userAnswers: string[]) => void
): {
  exercise: Exercise;
  currentStep: CurrentStep;
  checkAnswerResults: (boolean | null)[];
} {
  const finalStep = useMemo(() => {
    if (!exercise) return 0;
    return getStepCount(exercise.template);
  }, [exercise]);

  const codeForStep = useMemo((): CodeForStep => {
    return getCodeForStep({
      title: exercise.title,
      questionTemplate: exercise.template,
      currentStep: step,
    });
  }, [exercise, step]);

  const currentStep: CurrentStep = getCurrentStepProperties(
    codeForStep,
    exercise,
    step,
    finalStep
  );

  // Reset user answers when step changes
  useEffect(() => {
    setUserAnswers(Array(currentStep.answers.length).fill(""));
  }, [step, currentStep.answers.length, setUserAnswers]);

  // Check the user's answers against the correct answers; compute as derived state
  const checkAnswerResults = useMemo(() => {
    if (userAnswers.length === 0 || currentStep.answers.length === 0) {
      return Array(currentStep.answers.length).fill(null);
    }
    return checkAnswers(userAnswers, currentStep.answers);
  }, [userAnswers, currentStep.answers]);

  return {
    checkAnswerResults,
    currentStep,
    exercise,
  };
}
