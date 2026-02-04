import { UserRole } from "@/types/UserRole";

export function canCreateUserOfRole(
  userRole: UserRole,
  targetRole: UserRole
): boolean {
  switch (userRole) {
    case UserRole.ADMIN:
      return true;
    case UserRole.INSTRUCTOR:
      return targetRole === UserRole.STUDENT;
    default:
      return false;
  }
}
