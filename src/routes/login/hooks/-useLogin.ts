import { auth } from "@/firebase";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";

export type LoginFormData = {
  email: string;
  password: string;
};

function getFirebaseAuthErrorMessage(error: FirebaseError): string {
  // TODO: Log errors to error reporting service.
  switch (error.code) {
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-email":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    default:
      return "Unknown error occurred. Please contact support.";
  }
}

export function useLogin({
  onSuccess,
}: {
  onSuccess: () => void; //
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      onSuccess();
    } catch (err: unknown) {
      if (!(err instanceof FirebaseError)) {
        throw err;
      }

      const errorMessage = getFirebaseAuthErrorMessage(err);
      setError("root", { type: "manual", message: errorMessage });
    }
  };
  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
  };
}
