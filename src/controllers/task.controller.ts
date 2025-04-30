import { Request, Response } from "express";
import {
  clientErrorResponse,
  serverErrorResponse,
  SOMETHING_WRONG,
  successResponse,
} from "../utils/responses";
import {
  createTaskService,
  getDashboardStatsService,
  getRecurringTasksService,
  getTaskByIdService,
  getTasksService,
  updateTaskService,
} from "../service/task.service";
import { calculateNextDueDate, taskShape } from "../utils/utils";
import { Task } from "../models/Task";

export async function createTaskController(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const {
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo,
      isRecurring,
      parentTaskId,
      recurrencePattern,
    } = req.body;

    const user = req.user;
    if (!user) {
      return clientErrorResponse(res, {
        en: "User not authenticated",
        ar: "المستخدم غير مصادق",
      });
    }

    let finalAssignedTo: string;

    if (req.role === "admin") {
      if (!assignedTo) {
        return clientErrorResponse(res, {
          en: "Assigned user is required for admin",
          ar: "يجب تحديد المستخدم المعين للمسؤول",
        });
      }
      finalAssignedTo = assignedTo;
    } else {
      finalAssignedTo = user.id;
    }

    const newTask = await createTaskService({
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo: finalAssignedTo,
      createdBy: user.id,
      isRecurring,
      parentTaskId,
      recurrencePattern,
    });

    if (!newTask) {
      return clientErrorResponse(res, {
        en: SOMETHING_WRONG.en,
        ar: SOMETHING_WRONG.ar,
      });
    }

    const task = taskShape(newTask);

    return successResponse(res, task);
  } catch (err) {
    console.error("Error in createTaskController:", err);
    return serverErrorResponse(res, {
      SOMETHING_WRONG,
    });
  }
}

export async function getTasksController(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const { user } = req;
    const role = req.role;
    const {
      data: getTasks,
      pagesNumber,
      totalCount,
    } = await getTasksService(req, user.id, role);

    if (!getTasks) {
      return clientErrorResponse(res, {
        en: SOMETHING_WRONG.en,
        ar: SOMETHING_WRONG.ar,
      });
    }

    const task = getTasks.map(taskShape);

    return successResponse(res, { task, pagesNumber, totalCount });
  } catch (err) {
    console.error("Error in logIn:", err);
    return serverErrorResponse(res, {
      SOMETHING_WRONG,
    });
  }
}
export async function updateTaskController(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const id = req.query.id;
    if (!id || typeof id !== "string") {
      return clientErrorResponse(res, {
        en: "Invalid task ID",
        ar: "معرّف المهمة غير صالح",
      });
    }
    const { ...updateData } = req.body;

    const task = await getTaskByIdService(id);
    console.log("🚀 ~ task:", task)

    if (!task) {
      return clientErrorResponse(res, {
        en: SOMETHING_WRONG.en,
        ar: SOMETHING_WRONG.ar,
      });
    }

    const user = req.user;

    const isAssignedToUser = task.assignedTo?._id.toString() === user.id;
    console.log("🚀 ~ isAssignedToUser:", isAssignedToUser)
    const isCreatedByUser = task.createdBy.toString() === user.id;
    console.log("🚀 ~ isCreatedByUser:", isCreatedByUser)
    
    if (!isAssignedToUser && !isCreatedByUser && req.role !== "admin") {
      return clientErrorResponse(res, {
        en: "You are not allowed to update this task",
        ar: "غير مسموح لك بتحديث هذه المهمة",
      });
    }
    const allowedFieldsForUser = [
      "title",
      "description",
      "dueDate",
      "priority",
      "status",
      "isRecurring",
      "recurrencePattern",
    ];
    const allowedFieldsForAdmin = [...allowedFieldsForUser, "assignedTo"];

    const finalAllowedFields =
      req.role === "admin" ? allowedFieldsForAdmin : allowedFieldsForUser;

    const updatePayload: any = {};

    for (const key of finalAllowedFields) {
      if (updateData.hasOwnProperty(key)) {
        updatePayload[key] = updateData[key];
      }
    }

    let updatedTask;

    if (Object.keys(updatePayload).length > 0) {
      updatedTask = await updateTaskService(id, updatePayload);
    }

    if (updatePayload.status === "Done") {
      await completeTaskAndRecur(id, user.id);
    }

    if (!updatedTask) {
      return clientErrorResponse(res, {
        en: SOMETHING_WRONG.en,
        ar: SOMETHING_WRONG.ar,
      });
    }

    return successResponse(res, { task: taskShape(updatedTask) });
  } catch (err) {
    console.error("Error in updateTaskController:", err);
    return serverErrorResponse(res, {
      SOMETHING_WRONG,
    });
  }
}

export async function getTaskByIdController(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const id = req.query.id;
    if (!id || typeof id !== "string") {
      return clientErrorResponse(res, {
        en: "Invalid task ID",
        ar: "معرّف المهمة غير صالح",
      });
    }
    const task = await getTaskByIdService(id);

    if (!task) {
      return clientErrorResponse(res, {
        en: SOMETHING_WRONG.en,
        ar: SOMETHING_WRONG.ar,
      });
    }

    return successResponse(res, { task: taskShape(task) });
  } catch (err) {
    console.error("Error in updateTaskController:", err);
    return serverErrorResponse(res, {
      SOMETHING_WRONG,
    });
  }
}

export async function getDashboardStatsController(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const data = await getDashboardStatsService();

    return successResponse(res, data);
  } catch (err) {
    console.error("Error in updateStatusTaskController:", err);
    return serverErrorResponse(res, {
      SOMETHING_WRONG,
    });
  }
}
export async function getRecurringTasksController(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const { user } = req;
    const role = req.role;

    const {
      data: getTasks,
      pagesNumber,
      totalCount,
    } = await getRecurringTasksService(req, user.id, role);

    if (!getTasks) {
      return clientErrorResponse(res, {
        en: SOMETHING_WRONG.en,
        ar: SOMETHING_WRONG.ar,
      });
    }

    const task = getTasks.map(taskShape); // Format response

    return successResponse(res, { task, pagesNumber, totalCount });
  } catch (err) {
    console.error("Error in getRecurringTasksController:", err);
    return serverErrorResponse(res, { SOMETHING_WRONG });
  }
}

async function completeTaskAndRecur(taskId: string, userId: string) {
  const task = await getTaskByIdService(taskId);

  if (!task) throw new Error("Task not found");

  task.status = "Done";
  await task.save();

  if (task.isRecurring && task.recurrencePattern) {
    const nextDueDate = calculateNextDueDate(
      task.dueDate,
      task.recurrencePattern
    );

    const newTask = await createTaskService({
      title: task.title,
      description: task.description,
      dueDate: nextDueDate,
      priority: task.priority,
      status: "To Do",
      assignedTo: task.assignedTo,
      createdBy: userId,
      isRecurring: task.isRecurring,
      recurrencePattern: task.recurrencePattern,
      parentTaskId: task._id,
    });

    return newTask;
  }
}
