import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { asyncHandler } from '../utils/asyncHandler';

export const userController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const users = await userService.listAll();
    res.json(users);
  }),
};
