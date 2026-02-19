import jwt from "jsonwebtoken";
import User from "../modules/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized = No token Provided" });

    const decode = jwt.verify(token, ENV.JWT_SECRET);
    if (!decode)
      return res.status(401).json({ message: "Unauthorized = Invalid Token" });

    const user = await User.findById(decode.userId).select("-password");
    if (!User) return res.status(404).json({ message: "User not found" });

    res.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
