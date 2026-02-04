import { canCreateUserOfRole } from "@/domain/userPermissions";
import { UserRole } from "@/types/UserRole";

describe("user permissions", () => {
  describe("ADMIN user", () => {
    it("can create ADMIN user", () => {
      expect(canCreateUserOfRole(UserRole.ADMIN, UserRole.ADMIN)).toBe(true);
    });
    it("can create INSTRUCTOR user", () => {
      expect(canCreateUserOfRole(UserRole.ADMIN, UserRole.INSTRUCTOR)).toBe(
        true
      );
    });
    it("can create STUDENT user", () => {
      expect(canCreateUserOfRole(UserRole.ADMIN, UserRole.STUDENT)).toBe(true);
    });
  });
  describe("INSTRUCTOR user", () => {
    it("can create ADMIN user", () => {
      expect(canCreateUserOfRole(UserRole.INSTRUCTOR, UserRole.ADMIN)).toBe(
        false
      );
    });
    it("can create INSTRUCTOR user", () => {
      expect(
        canCreateUserOfRole(UserRole.INSTRUCTOR, UserRole.INSTRUCTOR)
      ).toBe(false);
    });
    it("can create STUDENT user", () => {
      expect(canCreateUserOfRole(UserRole.INSTRUCTOR, UserRole.STUDENT)).toBe(
        true
      );
    });
  });
  describe("STUDENT user", () => {
    it("can create ADMIN user", () => {
      expect(canCreateUserOfRole(UserRole.STUDENT, UserRole.ADMIN)).toBe(false);
    });
    it("can create INSTRUCTOR user", () => {
      expect(canCreateUserOfRole(UserRole.STUDENT, UserRole.INSTRUCTOR)).toBe(
        false
      );
    });
    it("can create STUDENT user", () => {
      expect(canCreateUserOfRole(UserRole.STUDENT, UserRole.STUDENT)).toBe(
        false
      );
    });
  });
});
