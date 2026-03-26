import "dotenv/config";

export function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

export function getEnvNumber(name: string): number {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    throw new Error(`${name} must be a valid number`);
  }

  return parsed;
}
