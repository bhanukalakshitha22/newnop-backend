import { Request, Response } from 'express';
import { taskService } from '../services/taskService';
import { asyncHandler } from '../utils/asyncHandler';

function actorFromReq(req: Request) {
  return { id: req.user!.sub, role: req.user!.role };
}

export const taskController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const tasks = await taskService.list(actorFromReq(req), req.query as any);
    res.json(tasks);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const task = await taskService.getById(actorFromReq(req), req.params.id);
    res.json(task);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const task = await taskService.create(actorFromReq(req), req.body);
    res.status(201).json(task);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const task = await taskService.update(actorFromReq(req), req.params.id, req.body);
    res.json(task);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await taskService.remove(actorFromReq(req), req.params.id);
    res.status(204).send();
  }),
};
