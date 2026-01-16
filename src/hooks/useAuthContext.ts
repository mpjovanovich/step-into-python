import { AuthContext } from "@/components/AuthContext";
import { type AuthContextType } from "@/types/AuthContextType";
import { useContext } from "react";

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Must be used within AuthProvider");
  return context;
}
