import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  clientErrorResponse,
  DATA_ERROR,
  EMAIL_EXIST,
  INVALID_CREDENTIALS,
  serverErrorResponse,
  SOMETHING_WRONG,
  successResponse,
} from "../utils/responses";
import { logInSchema, singUpSchema } from "../validator/auth.validator";
import { userShape } from "../utils/utils";
import { createUserService, getUserByEmailService } from "../service/user.service";
import { config } from "dotenv";

config();

export async function logInController(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const { email, password } = req.body;
    const { error } = logInSchema.validate(req.body);

    if (error) {
      return clientErrorResponse(
        res,
        DATA_ERROR,
        400,
        error.details[0].message
      );
    }

    const existedUser = await getUserByEmailService(email);

    if (!existedUser) {
      return clientErrorResponse(res, {
        en: INVALID_CREDENTIALS.en,
        ar: INVALID_CREDENTIALS.ar,
      });
    }

    const isMatch = await verifyPassword(password, existedUser.password);

    if (!isMatch) {
      return clientErrorResponse(res, {
        en: INVALID_CREDENTIALS.en,
        ar: INVALID_CREDENTIALS.ar,
      });
    }

    const token = generateToken(existedUser.id);
    const user = userShape(existedUser);

    return successResponse(res, {
      token,
      user,
    });
  } catch (err) {
    console.error("Error in logIn:", err);
    return serverErrorResponse(res, {
      SOMETHING_WRONG,
    });
  }
}
export async function signUpController(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const { name, email, password } = req.body;

    const { error } = singUpSchema.validate(req.body);

    if (error) {
      return clientErrorResponse(
        res,
        DATA_ERROR,
        400,
        error.details[0].message
      );
    }

    const existingUser = await getUserByEmailService(email);
    if (existingUser) {
      return clientErrorResponse(res, {
        en: EMAIL_EXIST.en,
        ar: EMAIL_EXIST.ar,
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await createUserService({
      name,
      email,
      password: hashedPassword,
    });
    const user = userShape(newUser);
    const token = generateToken(user.id);

    return successResponse(res, {
      token,
      user,
    });
  } catch (err) {
    console.error("Error in signUp:", err);
    return serverErrorResponse(res, {
      SOMETHING_WRONG,
    });
  }
}

const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

const generateToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string);
};

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};
