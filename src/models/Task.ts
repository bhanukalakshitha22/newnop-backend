import { Schema, model, Document, Types } from 'mongoose';

export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Open' | 'In Progress' | 'Testing' | 'Done';

export const TASK_PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High'];
export const TASK_STATUSES: TaskStatus[] = ['Open', 'In Progress', 'Testing', 'Done'];

export interface ITask extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  createdBy: Types.ObjectId;
  assignedTo?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true, index: 'text' },
    description: { type: String, default: '' },
    priority: { type: String, enum: TASK_PRIORITIES, default: 'Medium' },
    status: { type: String, enum: TASK_STATUSES, default: 'Open' },
    dueDate: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'task-user', required: true, index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'task-user', index: true },
  },
  { timestamps: true }
);

export const Task = model<ITask>('Task', taskSchema);
