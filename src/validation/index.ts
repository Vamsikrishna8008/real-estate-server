import { body } from "express-validator";

export const PropertValidator = [body("title").notEmpty().withMessage("Title")];
export const ContactValidator = [
  body("name").notEmpty().withMessage("Name is required"),
];
