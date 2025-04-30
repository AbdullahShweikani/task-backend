import { Request } from "express";
import { User } from "../models/User";
import { paginate } from "../utils/utils";

export const getUserByEmailService = async (email: string) => {
  return await User.findOne({
    email,
  });
};
export const getUserById = async (userId: string) => {
  return await User.findOne({
    _id: userId,
  });
};
export const getUsersService = async (id: string, req: Request) => {
  return await paginate({
    req,
    model: User,
    query: { _id: { $ne: id } },
    sort: { createdAt: -1 },
  });
};

export const createUserService = async ({ name, email, password }: any) => {
  const newUserChat = await User.create({
    name,
    email,
    password,
  });
  return newUserChat;
};
