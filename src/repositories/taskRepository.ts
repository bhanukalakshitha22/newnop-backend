import { Task, ITask } from '../models/Task';
import { FilterQuery, UpdateQuery } from 'mongoose';

export const taskRepository = {
  findById(id: string) {
    return Task.findById(id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role');
  },
  list(filter: FilterQuery<ITask>) {
    return Task.find(filter)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 });
  },
  create(data: Partial<ITask>) {
    return Task.create(data);
  },
  update(id: string, update: UpdateQuery<ITask>) {
    return Task.findByIdAndUpdate(id, update, { new: true, runValidators: true })
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role');
  },
  delete(id: string) {
    return Task.findByIdAndDelete(id);
  },
};
