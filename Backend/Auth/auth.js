import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";

configDotenv();

function authToken(req, res, next) {
  const header = req.headers.authorization;
  const token = header.split(" ")[1];
  // console.log(token);
  try {
    const verfied = jwt.verify(token, process.env.SECRET_KEY);
    if (!verfied) return res.status(401).json({ message: "user not verified" });
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json({ message: "Invalid token. Unauthorized access!" });
    }
    res
      .status(500)
      .json({ message: "could not verify user. Internal server error!!" });
  }
}

function generateToken() {
  const testValue = { name: "this is a test value" };
  return jwt.sign(testValue, process.env.SECRET_KEY, { expiresIn: "30m" });
}

export { authToken, generateToken };
