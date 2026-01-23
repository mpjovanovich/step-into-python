import { type InputHTMLAttributes, forwardRef } from "react";

const FormText = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ style, ...props }, ref) => {
  return (
    <input
      ref={ref}
      style={{
        width: "100%",
        padding: "0.75rem",
        marginTop: "0.5rem",
        fontSize: "1rem",
        border: "1px solid #ccc",
        borderRadius: "4px",
        boxSizing: "border-box",
        ...style,
      }}
      {...props}
    />
  );
});

FormText.displayName = "FormText";

export default FormText;
