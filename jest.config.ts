import type { InitialOptionsTsJest } from "ts-jest/dist/types";

const config: InitialOptionsTsJest = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  transform: {
    ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform"
  },
  moduleDirectories: ["node_modules", "src"],
  roots: ["src"],
  testEnvironment: "jsdom",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json"
    }
  }
};

export default config;
