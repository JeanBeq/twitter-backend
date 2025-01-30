const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = function requireAuthentication(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Unauthorized: Malformed token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).send({ type: "TOKEN_EXPIRED" });
    } else if (err) {
      console.log("JWT Error:", err);
      return res.status(401).send({ message: "Unauthorized: Invalid token" });
    }

    if (data?.id) {
      req.user = await User.findOne({
        where: {
          id: data.id,
        },
      });
    }

    if (!req.user) {
      return res.status(401).send({ message: "Unauthorized: User not found" });
    }
    next();
  });
};