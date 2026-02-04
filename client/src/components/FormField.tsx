import { forwardRef, type HTMLAttributes } from "react";

const FormField = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          marginBottom: "1rem",
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;
