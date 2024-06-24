import { Request, Response, NextFunction } from "express";
import { ValidationChain, validationResult } from "express-validator";
import db from "../db";

/**
 * @brief - validates the request body given an array of validation chains with appropriate error messages
 * @param validationChain - the validation chain from express-validator
 * @returns - a middleware function that validates the request body
 */
export const validate = (validationChain: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.all(
        validationChain.map((validation) => validation.run(req))
      );
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
      return res.status(400).json({
        msg: errors.array().map((err) => err.msg),
      });
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  };
};
/**
 *
 * @param name - the name of the table to check
 * @returns - a middleware function that checks the row with given id exists in the given table
 */
export const dbDelete = (name: string) => {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await db.query(`SELECT * FROM ${name} WHERE id=${id}`);
      if (result && result.length > 0) {
        req.prevObject = result;
        await db.query(`DELETE FROM ${name} WHERE id=${id}`);
        next();
        return;
      }
      return res.status(404).json({ msg: `${name} with id ${id} not found` });
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  };
};


export const checkingId = (name: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await db.query(`select id from ${name} where id = ${id};`);

      if (result && result.length > 0) {
        next();
        return;
      }
      return res.status(404).json({ msg: `${name} with id : ${id} not found` });
    } catch (error: any) {
      res.status(500).json({ msg: error.message });
    }
  };
};


