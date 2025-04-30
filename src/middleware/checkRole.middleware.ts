import { Request, Response, NextFunction } from "express";
import {
  clientErrorResponse,
  NO_PERMISSIONS_MESSAGE,
  NOT_FOUND_DATA_MESSAGE,
} from "../utils/responses";
import { getUserById } from "../service/user.service";

export function checkRolesMiddleware(allowedRoles: Array<"admin" | "user">) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const userData = await getUserById(user.id);

    if (!userData) {
      clientErrorResponse(
        res,
        { en: NOT_FOUND_DATA_MESSAGE.en, ar: NOT_FOUND_DATA_MESSAGE.ar },
        401
      );
      return;
    }

    if (!allowedRoles.includes(userData.role)) {
      clientErrorResponse(
        res,
        { en: NO_PERMISSIONS_MESSAGE.en, ar: NO_PERMISSIONS_MESSAGE.ar },
        403
      );
      return;
    }

    req.role = userData.role;

    next();
  };
}
