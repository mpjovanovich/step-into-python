import { getExerciseCache } from "@/cache/exerciseCache";
import { allCorrect } from "@/domain/answerChecker";
import { userService } from "@/services/userService";
import {
  createFileRoute,
  notFound,
  redirect,
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
    console.log("loader");
    // Get user
    const user = await userService.getUser(context.auth.authUser!.uid);
    if (!user) {
      // TODO: Handle error; this should never happen.
      throw redirect({ to: "/login" });
    }

    // Get exercise
    const { exerciseId } = params;
    const exerciseCache = getExerciseCache();
    const exercise = await exerciseCache.fetchById(exerciseId);
    if (!exercise) {
      throw notFound();
    }

    return { exercise, user };
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
            onPrevious={() => setStep(step - 1)}
            onNext={() => setStep(step + 1)}
            onSubmit={() => {
              const completeExercise = async () => {
                try {
                  setIsSubmitting(true);
                  await userService.completeExercise(user.id, exercise.id);
                  setIsSubmitting(false);
                  toast.success("Exercise complete!");
                  navigate({ to: "/exercises" });
                } catch (error) {
                  console.error(error);
                  // TODO: Handle error. Toast? Global error component?
                } finally {
                  setIsSubmitting(false);
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
