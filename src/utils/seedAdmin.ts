import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/userRepository';
import { env } from '../config/env';

export async function seedAdminIfEmpty(): Promise<void> {
  const count = await userRepository.count();
  if (count > 0) return;
  const passwordHash = await bcrypt.hash(env.seedAdmin.password, 10);
  await userRepository.create({
    name: env.seedAdmin.name,
    email: env.seedAdmin.email.toLowerCase(),
    passwordHash,
    role: 'admin',
  });
  console.log(`[seed] created admin user: ${env.seedAdmin.email}`);
}
