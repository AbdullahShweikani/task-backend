import { Response } from "express";

export function serverErrorResponse(res: Response, err: any) {
  console.log(err.message);

  res.status(500).json({ message: err.message ? err.message : err });
}

export function clientErrorResponse(
  res: Response,
  { en, ar }: { en?: string; ar?: string },
  status: number = 400,
  data?: any
) {
  return res.status(status).json({ enMessage: en, arMessage: ar, data });
}

export function successResponse(
  res: Response,
  data: any,
  status: number = 200,
  key: string = "data"
) {
  return res.status(status).json({ [key]: data, message: "success" });
}

export const NOT_FOUND_DATA_MESSAGE = {
  en: "data not found",
  ar: "البيانات غير موجود",
};
export const USER_NOT_AUTHENTICATED = {
  en: "User not authenticated",
  ar: " المستخدم غير مصدق",
};

export const NO_PERMISSIONS_MESSAGE = {
  en: "Permissions",
  ar: "ليس لديك صلاحيات",
};

export const SOMETHING_WRONG = {
  en: "something went wrong",
  ar: "حدث امر خاطئ",
};

export const TOKEN_REQUIRED = {
  en: "token is required",
  ar: "الرجاء ادخال token",
};

export const EMAIL_EXIST = {
  en: " try with another email",
  ar: "الايميل موجود من قبل",
};
export const INVALID_CREDENTIALS = {
  en: "Invalid credentials",
  ar: "خطأ الرجاء التأكد من كلمة السر أو الايميل",
};
export const DATA_ERROR = {
  en: "data error",
  ar: "خطأ في البيانات",
};
export const FILE_LIMITED = {
  en: "You can upload up to 5 files only.",
  ar: "يمكنك تحميل حتى 5 ملفات فقط.",
};
