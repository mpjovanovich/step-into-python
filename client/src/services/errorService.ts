import { db } from "@/firebase";
import { type ErrorSeverity } from "@/types/ErrorSeverity";
import {
    Firestore,
    addDoc,
    collection,
    serverTimestamp
} from "firebase/firestore";

export interface ErrorService {
    logError(error: Error, severity: ErrorSeverity, context?: Record<string, unknown>): Promise<void>;
}

function createErrorService(db: Firestore): ErrorService {
    const errorService = {
        async logError(error: Error, severity: ErrorSeverity, context?: Record<string, unknown>): Promise<void> {
            try {
                await addDoc(collection(db, 'errors'), {
                    severity,
                    message: error.message,
                    stack: error.stack,
                    timestamp: serverTimestamp(),
                    url: window.location.href,
                    userAgent: navigator.userAgent,
                    ...context,
                });
            } catch (error) {
                // If logging fails, just console it as fallback
                console.error('Failed to log error:', error);
            }
        }
    };

    return errorService;
}

export const errorService = createErrorService(db);