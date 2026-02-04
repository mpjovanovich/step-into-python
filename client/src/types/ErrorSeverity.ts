export const ErrorSeverity = {
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
} as const;

export type ErrorSeverity = (typeof ErrorSeverity)[keyof typeof ErrorSeverity];
