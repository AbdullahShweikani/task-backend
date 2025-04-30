import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import {
  clientErrorResponse,
  serverErrorResponse,
  SOMETHING_WRONG,
  TOKEN_REQUIRED,
} from "../utils/responses";
import { getToken } from "../utils/utils";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const token = getToken(req);

  if (!token)
    return clientErrorResponse(
      res,
      { en: TOKEN_REQUIRED.en, ar: TOKEN_REQUIRED.ar },
      401
    );
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    return serverErrorResponse(res, SOMETHING_WRONG);
  }
}
