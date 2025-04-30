import { Router } from "express";
import { createMulter } from "../utils/utils";
import {
  createTaskController,
  getDashboardStatsController,
  getRecurringTasksController,
  getTaskByIdController,
  getTasksController,
  updateTaskController,
} from "../controllers/task.controller";
import { checkRolesMiddleware } from "../middleware/checkRole.middleware";

const taskRoutes = Router();
const upload = createMulter("avatars");

taskRoutes
  .route("/")
  .post(
    upload.none(),
    checkRolesMiddleware(["admin", "user"]),
    createTaskController
  )
  .put(
    upload.none(),
    checkRolesMiddleware(["admin", "user"]),
    updateTaskController
  )
  .get(
    upload.none(),
    checkRolesMiddleware(["admin", "user"]),
    getTaskByIdController
  );
taskRoutes.get(
  "/recurring",
  upload.none(),
  checkRolesMiddleware(["admin", "user"]),
  getRecurringTasksController
);

taskRoutes.post(
  "/search",
  upload.none(),
  checkRolesMiddleware(["admin", "user"]),
  getTasksController
);

taskRoutes
  .route("/dashboard")
  .get(checkRolesMiddleware(["admin"]), getDashboardStatsController);

export default taskRoutes;
