import { type LabelHTMLAttributes, forwardRef } from "react";

const FormLabel = forwardRef<
  HTMLLabelElement,
  LabelHTMLAttributes<HTMLLabelElement>
>(({ style, children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      style={{
        display: "block",
        color: "white",
        marginBottom: "0.5rem",
        ...style,
      }}
      {...props}
    >
      {children}
    </label>
  );
});

FormLabel.displayName = "FormLabel";

export default FormLabel;
