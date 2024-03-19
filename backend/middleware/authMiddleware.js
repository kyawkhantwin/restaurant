const jwt = require("jsonwebtoken");

const Admin = require("../models/adminModel");
const { U_SECRET, A_SECRET } = require("../src/config");
const Shop = require("../models/shopModel");

const authMiddleware = (allowedRoles) => async (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    const token = authorization.split(" ")[1];
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, U_SECRET);
    } catch (errorWithUSecret) {
      decodedToken = jwt.verify(token, A_SECRET);
    }

    const { _id, userType } = decodedToken;

    let userData;

    if (userType === "user") {
      userData = await Shop.findOne({ _id }).select("_id");
    } else if (userType === "admin") {
      userData = await Admin.findOne({ _id }).select("_id");
    } else {
      return res.status(401).json({ message: "Invalid user type" });
    }

    if (!userData) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = userData;
    req.userType = userType;

    // Check if the user has one of the allowed roles
    if (allowedRoles && !allowedRoles.includes(userType)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Login Required" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Create specific middleware instances for user and admin roles
const userMiddleware = authMiddleware(["user"]);
const adminMiddleware = authMiddleware(["admin"]);
const bothMiddleware = authMiddleware(["admin", "user"]);

module.exports = {
  authMiddleware,
  userMiddleware,
  adminMiddleware,
  bothMiddleware,
};
