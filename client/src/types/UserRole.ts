export const UserRole = {
    ADMIN: "ADMIN",
    INSTRUCTOR: "INSTRUCTOR",
    STUDENT: "STUDENT",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];