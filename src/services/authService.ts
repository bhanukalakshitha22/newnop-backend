import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { userRepository } from '../repositories/userRepository';
import { HttpError } from '../utils/httpError';
import { IUser } from '../models/User';

function signToken(user: IUser): string {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn } as SignOptions
  );
}

export const authService = {
  async register(input: { name: string; email: string; password: string }) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) throw new HttpError(409, 'Email already registered');

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await userRepository.create({
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
      role: 'user',
    });

    return { token: signToken(user), user: user.toJSON() };
  },

  async login(input: { email: string; password: string }) {
    const user = await userRepository.findByEmail(input.email);
    if (!user) throw new HttpError(401, 'Invalid credentials');

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) throw new HttpError(401, 'Invalid credentials');

    return { token: signToken(user), user: user.toJSON() };
  },

  async me(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new HttpError(404, 'User not found');
    return user.toJSON();
  },
};
