import { forwardRef, type HTMLAttributes } from "react";

const FormField = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ style, children, ...props }) => {
    return (
      <div
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
