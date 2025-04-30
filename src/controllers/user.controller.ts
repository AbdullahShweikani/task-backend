import { Request, Response } from "express";
import {
  serverErrorResponse,
  SOMETHING_WRONG,
  successResponse,
} from "../utils/responses";
import { userShape } from "../utils/utils";
import { getUsersService } from "../service/user.service";
import { config } from "dotenv";

config();

export async function getUsersController(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const user = req.user;  
    const { data, pagesNumber, totalCount } = await getUsersService(
      user.id,
      req
    );

    const allUser = data.map(userShape);

    return successResponse(res, { allUser, pagesNumber, totalCount });
  } catch (err) {
    console.error("Error in logIn:", err);
    return serverErrorResponse(res, {
      SOMETHING_WRONG,
    });
  }
}

