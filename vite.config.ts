import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    // Docs say to make sure that '@tanstack/router-plugin' is passed before
    // '@vitejs/plugin-react'
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
  ],
  test: {
    exclude: ["**/node_modules/**", "**/dist/**", "firestore.rules.test.js"],
  },
});
