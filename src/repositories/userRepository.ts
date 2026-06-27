import { User, IUser } from '../models/User';
import { FilterQuery } from 'mongoose';

export const userRepository = {
  findById(id: string) {
    return User.findById(id);
  },
  findByEmail(email: string) {
    return User.findOne({ email: email.toLowerCase() });
  },
  create(data: Partial<IUser>) {
    return User.create(data);
  },
  list(filter: FilterQuery<IUser> = {}) {
    return User.find(filter).select('-passwordHash').sort({ createdAt: -1 });
  },
  count(filter: FilterQuery<IUser> = {}) {
    return User.countDocuments(filter);
  },
};
