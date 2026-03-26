// config/env.ts
import { getEnvNumber, getEnv } from "./utils";

export const env = {
  SALT_ROUNDS: getEnvNumber("SALT_ROUNDS"),
  DATABASE_URL: getEnv("DATABASE_URL"),
  JWT_SECRET: getEnv("JWT_SECRET"),
};
