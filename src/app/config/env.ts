import { z } from "zod";
import { Logger } from "@/utils/logger";

const logger = new Logger("Config.Env");

const envSchema = z.object({
  GOOGLE_API_KEY: z.string()
});

const validateEnv = () => {
  try {
    logger.info("Validating environment variables");

    const env = {
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY
    };

    const parsed = envSchema.parse(env);
    return parsed;

  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join("."));
      logger.error("Invalid environment variables: " + missingVars.join(", "));
    }
    throw error;
  }
};

export const env = validateEnv();
