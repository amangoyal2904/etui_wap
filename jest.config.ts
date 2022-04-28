import type { InitialOptionsTsJest } from "ts-jest/dist/types";

const config: InitialOptionsTsJest = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
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
  },
  collectCoverage: true,
  collectCoverageFrom: ["./src/**/*.ts"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 30,
      lines: 50,
      statements: 50
    },
    "./src/components/": {
      branches: 40,
      functions: 30,
      lines: 50,
      statements: 50
    },
    "./src/containers/": {
      branches: 20,
      functions: 30,
      lines: 50,
      statements: 50
    },
    "./src/Slices/": {
      branches: 40,
      functions: 30,
      lines: 50,
      statements: 50
    }
  },
  coverageReporters: ["lcov", "text-summary", "text", "html"]
};

export default config;
