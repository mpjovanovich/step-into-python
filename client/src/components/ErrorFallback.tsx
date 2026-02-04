import { errorService } from "@/services/errorService";
import { ErrorSeverity } from "@/types/ErrorSeverity";
import { toError } from "@/utils/errorUtils";
import { type FallbackProps } from "react-error-boundary";

const ErrorFallback = ({ 
  error
}: FallbackProps) => {
  errorService.logError(toError(error), ErrorSeverity.ERROR);
  return <div style={{ 
    color: "white", 
    textAlign: "center", 
    margin: "20px" 
  }}>Something went wrong. Please try refreshing the page.</div>;
};

export default ErrorFallback;