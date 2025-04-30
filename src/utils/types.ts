import { Types } from "mongoose";
import { Request } from "express";
import { Model } from "mongoose";

export interface TaskType {
  title: string;
  description?: string | null;
  dueDate: Date;
  priority?: "Low" | "Medium" | "High";
  status?: "To Do" | "In Progress" | "Done";
  assignedTo: Types.ObjectId | string | undefined |null;
  createdBy: Types.ObjectId | string;
  isRecurring?: boolean;
  recurrencePattern?: "daily" | "weekly" | "monthly" | null;
  parentTaskId?: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface paginateType {
  req: any | Request;
  model: Model<any>;
  query?: any;
  populate?: string;
  sort?: any;
  altPopulate?: any;
}
