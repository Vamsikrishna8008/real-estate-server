import { Router, Request, Response } from "express";
import db from "../db";
import { TABLE_NAME } from "../constants";
import AsyncErrorCatcher from "../middleware/AsyncErrorCatcher";
import { BadRequest } from "../errors";
import jwt from "jsonwebtoken";
import config from "../config";
import { validate } from "../middleware/Validator";
import { ContactValidator } from "../validation";

const router = Router();

router.post(
  "/register",
  AsyncErrorCatcher(async (req: Request, res: Response) => {
    await db.transaction(async (manager) => {
      console.log(req.body, "kkkkkkkkk");
      await manager.query(`insert into ${TABLE_NAME.USER} set ?`, [req.body]);

      res.json({ msg: "User Created successfully" });
    });
  })
);

router.post(
  "/login",
  AsyncErrorCatcher(async (req: Request, res: Response) => {
    const { username, password } = req.body;
    console.log(req.body, "kkk");
    await db.transaction(async (manager) => {
      const [user] = await manager.query(
        `select * from ${TABLE_NAME.USER} where email=? `,
        [username]
      );
      if (user.username !== username) {
        throw new BadRequest("Invalid username ");
      }
      if (user.password !== password) {
        throw new BadRequest("Invalid password");
      }
      const token = jwt.sign(
        { id: user.id, user_role: "user" },
        config.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );
      res.json({ msg: "logged in successfully", token });
    });
  })
);

router.post(
  "/contact",
  validate(ContactValidator),
  AsyncErrorCatcher(async (req: Request, res: Response) => {
    await db.transaction(async (manager) => {
      await manager.query(`insert into ${TABLE_NAME.CONTACT} set ?`, [
        req.body,
      ]);

      res.json({ msg: "Contact submitted successfully" });
    });
  })
);

router.get(
  "/contact",
  AsyncErrorCatcher(async (req: Request, res: Response) => {
    const data = await db.query(`select * from ${TABLE_NAME.CONTACT}`);
    console.log(data);
    res.json(data);
  })
);

export default router;
