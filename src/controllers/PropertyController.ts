import { Router, Request, Response } from "express";
import db from "../db";
import { upload } from "../constants/lib";
import path from "path";
import fs from "fs";
import { validate } from "../middleware/Validator";
import { PropertValidator } from "../validation";

const router = Router();

router.post(
  "/",
  upload.single("image"),
  validate(PropertValidator),
  async (req: Request, res: Response) => {
    const file = req.file as any; // The uploaded file information
    try {
      if (file) req.body.image = file.filename;
      await db.transaction(async (manager) => {
        await manager.query(`insert into properties set ?`, [req.body]);
      });
      res.json({ msg: "Property created successfully" });
    } catch (error: any) {
      res.status(400).json({ msg: error.msg });
      if (file) {
        const filePath = path.join(__dirname, "..", "asserts", file.filename);
        await fs.promises.unlink(filePath);
      }
    }
  }
);

router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await db.query("select * from properties");
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [data] = await db.query(`select * from properties where id=?`, [id]);
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.patch(
  "/:id",
  upload.single("image"),
  validate(PropertValidator),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const file = req.file as any; // The uploaded file information
    try {
      if (file) req.body.image = file.filename;
      await db.transaction(async (manager) => {
        const [data] = await manager.query(
          `select * from properties where id=${id}`
        );
        const filePath = path.join(__dirname, "..", "asserts", data.image);
        await fs.promises.unlink(filePath);
        await manager.query(`update properties set ? where id=?`, [
          req.body,
          id,
        ]);
      });
      res.json({ msg: "Property updaed successfully" });
    } catch (error: any) {
      res.status(400).json({ msg: error.msg });
      if (file) {
        const filePath = path.join(__dirname, "..", "asserts", file.filename);
        await fs.promises.unlink(filePath);
      }
    }
  }
);
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.transaction(async (manager) => {
      const [data] = await manager.query(
        `select * from properties where id=?`,
        [id]
      );
      await manager.query(`delete from properties where id=?`, [id]);
      const filePath = path.join(__dirname, "..", "asserts", data.image);
      await fs.promises.unlink(filePath);
    });
    res.json({ msg: "Property deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ msg: error.msg });
    console.log(error);
  }
});

export default router;
