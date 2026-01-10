import { useEffect, useMemo, useState } from "react";
import {
  getCodeForStep,
  getStepCount,
  type CodeForStep,
} from "../../../domain/templateParser";
import { useExerciseCache } from "../../../hooks/useExerciseCache";
import { type Exercise } from "../../../types/Exercise";

export function useExercise(
  exerciseId: string,
  step: number
): {
  codeForStep: CodeForStep | null;
  exercise: Exercise | null;
  finalStep: number;
} {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const exerciseCache = useExerciseCache();

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
  }, [exerciseId]);

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

  return { codeForStep, exercise, finalStep };
}
