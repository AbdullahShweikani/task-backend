import multer from "multer";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";
import { DIRNAME } from "./constants";
import { paginateType } from "./types";
import dayjs from "dayjs";

export function userShape(user: any) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
export function taskShape(task: any) {
  return {
    id: task._id,
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
    status: task.status,
    assignedTo: userShape(task.assignedTo),
    createdBy: task.createdBy,
    isRecurring: task.isRecurring,
    recurrencePattern: task.recurrencePattern,
    parentTaskId: task.parentTaskId,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

export function getToken(req: Request) {
  const bearerHeader = req.headers["authorization"];

  const token = bearerHeader?.split(" ")[1];

  return token;
}

export function imageUrl() {
  return `/images`;
}

export function calculateNextDueDate(
  currentDueDate: Date,
  recurrencePattern: string
): Date {
  const date = dayjs(currentDueDate);

  switch (recurrencePattern) {
    case "daily":
      return date.add(1, "day").toDate();
    case "weekly":
      return date.add(1, "week").toDate();
    case "monthly":
      return date.add(1, "month").toDate();
    default:
      throw new Error("Invalid recurrence pattern");
  }
}

export async function paginate({
  req,
  model,
  populate,
  query,
  sort,
  altPopulate,
}: paginateType) {
  const page = parseInt(req.query.page?.toString()!);

  const totalCount = (await model.find(query ? query : {})).length;

  const pagesNumber = Math.ceil(totalCount / 10);

  const startIndex = ((page ? page : 1) - 1) * 10;

  const data = await model
    .find(query)
    .skip(startIndex)
    .limit(10)
    .sort(sort ? sort : { _id: -1 })
    .populate(populate ? populate : "")
    .populate(altPopulate ? altPopulate : "");
  return { data, pagesNumber, totalCount };
}

export function createMulter(dirName: string) {
  const storage = multer.diskStorage({
    destination: (_req, _res, callback) => {
      callback(null, join(DIRNAME, "public", "images", dirName));
    },
    filename: (_req, file, callback) => {
      const fileExtension = file.originalname.split(".").pop();
      callback(null, `${uuidv4()}.${fileExtension}`);
    },
  });

  const upload = multer({
    storage,
    limits: {
      fileSize: 50 * 1024 * 1024,
    },
    fileFilter: (_req, file, callback) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "video/mp4",
      ];
      if (!allowedTypes.includes(file.mimetype)) {
        return callback(new Error("Only image and video files are allowed"));
      }
      callback(null, true);
    },
  });

  return upload;
}
