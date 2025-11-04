import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "src/**/*.{test,spec,bench}.{ts,tsx,js,jsx}",
      "bench/**/*.bench.{ts,tsx,js,jsx}"
    ]
  }
});