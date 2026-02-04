import { auth, sendPasswordResetEmail } from "@/firebase";
import { toError } from "@/utils/errorUtils";
import { FirebaseError } from "firebase/app";
import { useForm } from "react-hook-form";

export type ResetPasswordFormData = {
  email: string;
};

const handleSendPasswordResetEmail = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    // Don't tell the user if the error is because the user doesn't exist.
    const isUserNotFoundError =
      error instanceof FirebaseError && error.code === "auth/user-not-found";
    if (!isUserNotFoundError) {
      throw new Error(
        "An error occurred while sending the password reset email"
      );
    }
    // We can't call errorService because we are not authenticated at this
    // point, and firestore rules won't allow us to write to the errors
    // collection. We could handle this with cloud functions, but for now
    // just leave it as a tolerated fail case.
  }
};

export function useResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<ResetPasswordFormData>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await handleSendPasswordResetEmail(data.email);
      reset();
      setError("root", {
        type: "manual",
        message:
          "Password reset email sent. Please allow a few minutes for it to arrive.",
      });
    } catch (err: unknown) {
      setError("root", { type: "manual", message: toError(err).message });
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
  };
}
