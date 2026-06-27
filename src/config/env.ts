import dotenv from 'dotenv';

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 5000),
  mongoUri: required('MONGO_URI', 'mongodb://localhost:27017/taskflow'),
  jwtSecret: required('JWT_SECRET', 'dev_only_change_me'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  seedAdmin: {
    email: process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com',
    password: process.env.SEED_ADMIN_PASSWORD ?? 'Admin@123',
    name: process.env.SEED_ADMIN_NAME ?? 'Administrator',
  },
};
