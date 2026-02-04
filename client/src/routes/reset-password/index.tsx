import FormButton from '@/components/FormButton';
import FormError from '@/components/FormError';
import FormField from '@/components/FormField';
import FormLabel from '@/components/FormLabel';
import FormText from '@/components/FormText';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useResetPassword } from './hooks/-useResetPassword';

export const Route = createFileRoute('/reset-password/')({
    beforeLoad: async ({ context }) => {
    if (context.auth.authUser?.uid) {
      throw redirect({ to: "/exercises" });
    }
  },
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
    const { register, handleSubmit, errors, isSubmitting } = useResetPassword();

    return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1.5rem", color: "white" }}>Send Password Reset Email</h1>

      <form onSubmit={handleSubmit}>
        <FormField>
          <FormLabel htmlFor="email">
            Email
            <FormText
              id="email"
              type="email"
              autoComplete="email"
              {...register("email", {
                required: "Email is required",
              })}
              disabled={isSubmitting}
            />
          </FormLabel>
          {errors.email && <FormError>{errors.email.message}</FormError>}
        </FormField>

        <FormButton
          isDisabled={isSubmitting}
          type="submit"
          style={{ width: "100%" }}
        >
          {isSubmitting ? "Sending..." : "Send"}
        </FormButton>

        {errors.root && (
          <FormError style={{ marginTop: "1rem" }}>
            {errors.root.message}
          </FormError>
        )}
      </form>
    </div>
  );
}
