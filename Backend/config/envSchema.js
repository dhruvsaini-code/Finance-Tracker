const { z } = require('zod');

const envSchema = z.object({
  PORT: z.string().default('5000'),
  MONGO_URI: z.string().default('mongodb://localhost:27017/finance_tracker'),
  JWT_SECRET: z.string().default('super_secret_finance_tracker_key_123456'),
  JWT_REFRESH_SECRET: z.string().default('super_secret_refresh_key_987654'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  OPENAI_API_KEY: z.string().optional()
});

const validateEnv = () => {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('Invalid environment configuration:', parsed.error.format());
    process.exit(1);
  }
  return parsed.data;
};

module.exports = validateEnv;
