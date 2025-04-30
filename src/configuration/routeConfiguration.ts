import { Express } from "express";
import authRoutes from "../routes/auth.routes";
import { serverErrorResponse } from "../utils/responses";
import taskRoutes from "../routes/task.routes";
import { authMiddleware } from "../middleware/auth.middleware";
import userRoutes from "../routes/user.routes";

export function routerConfiguration(server: Express) {
  server.use("/api/auth", authRoutes);
  server.use("/api/task", authMiddleware, taskRoutes);
  server.use("/api/user", authMiddleware, userRoutes);

  server.use((req, res) => {
    return serverErrorResponse(res, "Rout Not Found");
  });
}
