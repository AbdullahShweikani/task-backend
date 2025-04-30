import { Router } from "express";
import { createMulter } from "../utils/utils";
import {
  logInController,
  signUpController,
} from "../controllers/auth.controller";

const authRoutes = Router();
const upload = createMulter("avatars");

authRoutes.post("/login", upload.none(), logInController);
authRoutes.post("/signup", upload.none(), signUpController);

export default authRoutes;
