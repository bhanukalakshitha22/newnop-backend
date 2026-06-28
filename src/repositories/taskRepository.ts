import { Task, ITask } from '../models/Task';
import { FilterQuery, UpdateQuery, SortOrder } from 'mongoose';

export type SortField = 'createdAt' | 'dueDate' | 'priority' | 'title';
export type SortDir = 'asc' | 'desc';

const PRIORITY_ORDER = { Low: 1, Medium: 2, High: 3 };

export const taskRepository = {
  findById(id: string) {
    return Task.findById(id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role');
  },
  async list(filter: FilterQuery<ITask>, sortField: SortField = 'createdAt', sortDir: SortDir = 'desc') {
    if (sortField === 'priority') {
      const tasks = await Task.find(filter)
        .populate('createdBy', 'name email role')
        .populate('assignedTo', 'name email role');
      return tasks.sort((a, b) => {
        const diff = (PRIORITY_ORDER[a.priority] ?? 0) - (PRIORITY_ORDER[b.priority] ?? 0);
        return sortDir === 'asc' ? diff : -diff;
      });
    }
    const mongoSort: Record<string, SortOrder> = { [sortField]: sortDir === 'asc' ? 1 : -1 };
    return Task.find(filter)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .sort(mongoSort);
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
