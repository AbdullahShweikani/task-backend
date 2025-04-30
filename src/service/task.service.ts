import { Request } from "express";
import { Task } from "../models/Task";
import { TaskType } from "../utils/types";
import { paginate } from "../utils/utils";

export const createTaskService = async ({
  title,
  description,
  dueDate,
  priority,
  assignedTo,
  createdBy,
  isRecurring,
  parentTaskId,
  status,
  recurrencePattern,
}: TaskType) => {
  const newTask = await Task.create({
    title,
    description,
    dueDate,
    priority,
    status,
    assignedTo,
    createdBy,
    isRecurring,
    parentTaskId,
    recurrencePattern,
  });
  return newTask;
};

export async function getTasksService(
  req: Request,
  userId: string,
  role: string
) {
  const { status } = req.body || {};
  const query =
    role === "admin"
      ? {}
      : {
          $or: [{ assignedTo: userId }, { createdBy: userId }],
        };

  const finalQuery = { ...query } as Record<string, any>;

  if (status && status.trim() !== "") {
    finalQuery["status"] = status;
  }

  return await paginate({
    req,
    model: Task,
    populate: "assignedTo",
    query: finalQuery,
    sort: { dueDate: 1 },
    altPopulate: "",
  });
}
export async function getRecurringTasksService(
  req: Request,
  userId: string,
  role: string
) {
  const query: any =
    role === "admin"
      ? { isRecurring: true }
      : {
          isRecurring: true,
          $or: [{ assignedTo: userId }, { createdBy: userId }],
        };

  if (req.query.upcoming === "true") {
    query.dueDate = { $gte: new Date() };
  }

  return await paginate({
    req,
    model: Task,
    populate: "assignedTo",
    query,
    sort: { dueDate: 1 },
    altPopulate: "",
  });
}

export async function getTaskByIdService(id: string) {
  return await Task.findById(id).populate("assignedTo");
}

export async function updateTaskService(id: string, updatePayload: any) {
  return await Task.findByIdAndUpdate(id, updatePayload, {
    new: true,
  });
}
export async function getDashboardStatsService() {
  const tasksByStatus = await Task.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const statusCounts: Record<string, number> = {};
  tasksByStatus.forEach((status) => {
    statusCounts[status._id] = status.count;
  });

  const completedTasksOverTime = await Task.aggregate([
    {
      $match: { status: "Done" },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  return {
    tasksByStatus: statusCounts,
    completedTasksOverTime: completedTasksOverTime.map((doc) => ({
      date: doc._id,
      count: doc.count,
    })),
  };
}
