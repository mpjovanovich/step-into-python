import { allCorrect } from "@/domain/answerChecker";
import { exerciseService } from "@/services/exerciseService";
import { userService } from "@/services/userService";
import {
  createFileRoute,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import ExerciseDescription from "./components/-ExerciseDescription";
import ExerciseInstructions from "./components/-ExerciseInstructions";
import NavigationButtons from "./components/-NavigationButtons";
import ProgramOutput from "./components/-ProgramOutput";
import { useExercise } from "./hooks/-useExercise";
import styles from "./route.module.css";

export const Route = createFileRoute("/_authenticated/exercises/$exerciseId/")({
  loader: async ({ context, params }) => {
    const user = await userService.getUser(context.auth.authUser!.uid);
    if (user.error) {
      // Let the error boundary handle the error.
      throw new Error(user.error);
    }

    const { exerciseId } = params;
    const exercise = await exerciseService.fetchById(exerciseId);
    if (exercise.error) {
      // Let the error boundary handle the error.
      throw new Error(exercise.error);
    }

    return { exercise: exercise.data, user: user.data };
  },
  component: ExercisePage,
});

function ExercisePage() {
  const { exercise, user } = useLoaderData({
    from: "/_authenticated/exercises/$exerciseId/",
  });
  const navigate = useNavigate();

  // Page state
  const [step, setStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  // Fetch exercise data
  const { checkAnswerResults, currentStep } = useExercise(
    exercise,
    step,
    userAnswers,
    setUserAnswers
  );

  /* ************************
   * UI
   ************************ */
  // Main content
  return (
    <div className={styles.exercise}>
      <h1 className={"title"}>
        {exercise ? `${exercise.title}` : "Loading Program..."}
      </h1>
      <div className={styles.container}>
        <div className={styles.instructions}>
          <ExerciseDescription
            stepType={currentStep.stepType}
            description={currentStep.descriptions}
          />
          <ExerciseInstructions
            stepType={currentStep.stepType}
            instructions={currentStep.instructions}
          />
          <NavigationButtons
            stepType={currentStep.stepType}
            allCorrect={allCorrect(checkAnswerResults)}
            canFocus={currentStep.answers.length === 0}
            onPrevious={() => {
              setStep(step - 1);
              setUserAnswers([]);
            }}
            onNext={() => {
              setStep(step + 1);
              setUserAnswers([]);
            }}
            onSubmit={() => {
              const completeExercise = async () => {
                try {
                  await userService.completeExercise(user.id, exercise.id);
                  toast.success("Exercise complete!");
                  navigate({ to: "/exercises" });
                } catch (error) {
                  console.error(error);
                  // TODO: Handle error. Toast? Global error component?
                }
              };
              completeExercise();
            }}
          />
        </div>
        <ProgramOutput
          code={currentStep.code}
          copyCode={currentStep.copyCode}
          answers={currentStep.answers}
          userAnswers={userAnswers}
          setUserAnswers={setUserAnswers}
          checkAnswerResults={checkAnswerResults}
        />
      </div>
    </div>
  );
}
