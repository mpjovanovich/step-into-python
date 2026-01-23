import { forwardRef, type HTMLAttributes } from "react";

const FormError = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ style, children, ...props }) => {
    return (
      <div
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
