import "@testing-library/jest-dom";
import { loadEnvConfig } from "@next/env";
import { setConfig } from "next/config";
import { publicRuntimeConfig } from "./next.config";

// Make sure you can use "publicRuntimeConfig" within tests.
setConfig({ publicRuntimeConfig });

loadEnvConfig(__dirname, true, { info: () => null, error: console.error });
