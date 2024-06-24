import { Request, Response, NextFunction } from "express";

export const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err, "error handler");
  if (err.code === "ER_ROW_IS_REFERENCED_2") {
    res.status(409).send({ msg: "This record is already in use can't delete" });
  } else if (err.code === "ER_DUP_ENTRY") {
    res.status(409).send({ msg: err.sqlMessage });
  } else if (err.code === "ER_NO_DEFAULT_FOR_FIELD") {
    res.status(409).send({ msg: err.sqlMessage });
  } else if (err.name === "BadRequest") {
    res.status(400).send({ msg: err.message });
  } else if (err.name === "Unauthorized") {
    res.status(401).send({ msg: err.message });
  } else if (err.name === "Forbidden") {
    res.status(403).send({ msg: err.message });
  } else if (err.name === "NotFound") {
    res.status(404).send({ msg: err.message });
  } else if (err.name === "InternalServerError") {
    res.status(500).send({ msg: err.message });
  } else {
    res.status(500).send({ msg: "Something went wrong" });
  }
};
