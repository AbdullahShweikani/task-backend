import Joi from "joi";

export const singUpSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const logInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const postSchema = Joi.object({
  content: Joi.string().required(),
});
export const postDeleteSchema = Joi.object({
  id: Joi.number().required(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().required(),
  bio: Joi.string().required(),
});
