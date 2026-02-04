import { forwardRef, type HTMLAttributes } from "react";

const FormError = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          color: "#eb3434",
          fontSize: "1rem",
          marginTop: "0.25rem",
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FormError.displayName = "FormError";

export default FormError;
