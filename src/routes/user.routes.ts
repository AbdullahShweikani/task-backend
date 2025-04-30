import { Router } from "express";
import { createMulter } from "../utils/utils";
import { getUsersController } from "../controllers/user.controller";

const userRoutes = Router();
const upload = createMulter("avatars");

userRoutes.get("/", upload.none(), getUsersController);

export default userRoutes;
