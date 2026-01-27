import { errorService } from "@/services/errorService";
import { ErrorSeverity } from "@/types/ErrorSeverity";
import { type FallbackProps } from "react-error-boundary";

const ErrorFallback = ({ 
  error
}: FallbackProps) => {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  errorService.logError(errorObj, ErrorSeverity.ERROR);
  return <div style={{ 
    color: "white", 
    textAlign: "center", 
    margin: "20px" 
  }}>Something went wrong. Please try refreshing the page.</div>;
};

export default ErrorFallback;