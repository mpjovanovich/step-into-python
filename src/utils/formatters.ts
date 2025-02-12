export const formatExerciseNumber = (num: number): string => {
  return num.toFixed(2).padStart(5, "0");
};
