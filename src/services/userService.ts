import { userRepository } from '../repositories/userRepository';

export const userService = {
  listAll() {
    return userRepository.list({});
  },
};
