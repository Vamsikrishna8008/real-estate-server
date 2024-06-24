import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import CONFIG from "../config";
import db from "../db";
import { JwtToken } from "../constants/types";
import { TABLE_NAME } from "../constants";

// /**
//  * @description This middleware is used to authenticate the member
//  * @overview - this will check for bearer token in the authorization header
//  * and will check if the token is valid or not and will add the member details
//  * to the request object if the token is valid and will pass the request to the next middleware
//  */
export const AuthHandler = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  return next();
  if (req.path.includes("login")) {
    return next();
  }

  // if (req.path.includes("admin")) {
  //   return next();
  // }

  const authorization = req.headers.authorization || req.headers.Authorization;
  if (!authorization) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  const [_, token] = authorization.split(" ");
  if (!token) {
    return res.status(401).json({
      message: "No token found",
    });
  }

  try {
    const user = jwt.verify(token, CONFIG.JWT_SECRET_KEY) as JwtToken;
    if (!user) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
    // attaching payload here
    req.user = { id: user.id, user_role: user.user_role };
    if (user.user_role === "user") {
      const [dbUser] = await db.query(
        `SELECT * FROM users WHERE id=${user.id}`
      );
      if (!dbUser) {
        return res.status(401).json({
          message: "Invalid token",
        });
      }
      next();
    } else if (user.user_role === "admin") {
      const [dbUser] = await db.query(
        `select * from ${TABLE_NAME.ADMIN} where id=${user.id}`
      );
      if (!dbUser) {
        return res.status(401).json({
          message: "Invalid token",
        });
      }
      next();
    }
  } catch (error) {
    return res.status(401).json({
      msg: "Invalid token, please login",
    });
    // return res.redirect("/login");
  }
};
