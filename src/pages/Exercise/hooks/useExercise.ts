import { getExerciseCache } from "@/cache/exerciseCache";
import { checkAnswers } from "@/domain/answerChecker";
import {
  getCodeForStep,
  getStepCount,
  type CodeForStep,
} from "@/domain/templateParser";
import { getCurrentStepProperties } from "@/pages/Exercise/utils/ExerciseUtils";
import { type CurrentStep } from "@/types/CurrentStep";
import { type Exercise } from "@/types/Exercise";
import { useEffect, useMemo, useState } from "react";

export function useExercise(
  exerciseId: string,
  step: number,
  userAnswers: string[],
  setUserAnswers: (userAnswers: string[]) => void
): {
  exercise: Exercise | null;
  currentStep: CurrentStep;
  checkAnswerResults: (boolean | null)[];
} {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const exerciseCache = getExerciseCache();

  // TODO: This can probably be removed now that we're fetching it in the loader
  useEffect(() => {
    const fetchExercise = async () => {
      const exercise = await exerciseCache.fetchById(exerciseId);
      if (exercise) {
        setExercise(exercise);
      } else {
        throw new Error("Exercise not found.");
      }
    };
    fetchExercise();
  }, [exerciseId, exerciseCache]);

  const finalStep = useMemo(() => {
    if (!exercise) return 0;
    return getStepCount(exercise.template);
  }, [exercise]);

  const codeForStep = useMemo((): CodeForStep | null => {
    if (!exercise) return null;
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
