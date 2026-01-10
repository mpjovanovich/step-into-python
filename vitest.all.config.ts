import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    exclude: ["**/node_modules/**", "**/dist/**", "firestore.rules.test.js"],
    include: ["**/src/**/*.test.ts"],
    globals: true,
  },
});
