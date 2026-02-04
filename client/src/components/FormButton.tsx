import { type ButtonHTMLAttributes, forwardRef } from "react";

type FormButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isDisabled: boolean;
};

// TODO: when we migrate to tailwind we need pseudoclass classes We should then
// modify the exercise buttons to use this component so that they are
// consistent.

const FormButton = forwardRef<HTMLButtonElement, FormButtonProps>(
  ({ style, children, isDisabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        style={{
          padding: "0.75rem",
          fontSize: "1rem",
          backgroundColor: isDisabled ? "#b69bff" : "#7f52ff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: isDisabled ? "not-allowed" : "pointer",
          ...style,
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

FormButton.displayName = "FormButton";

export default FormButton;
