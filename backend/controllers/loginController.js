const User = require("../models/userModel.js");
const Shop = require("../models/shopModel.js");
const jwt = require("jsonwebtoken");
const { A_SECRET, U_SECRET } = require("../src/config.js");
const bcrypt = require("bcrypt");

const createToken = (userData, userType) => {
  const secretKey = userType === "user" ? U_SECRET : A_SECRET;
  return jwt.sign({ _id: userData._id, userType }, secretKey, { expiresIn: "3d" });
};

const loginShop = async function (request, response) {
  try {
    const { userName, password } = request.body;
    const shop = await Shop.findOne({userName});

   

    if (!shop) {
      return response.status(400).json({
        status: "failed",
        message: "No user found",
      });
    }

    const checkedPassword = await bcrypt.compare(password, shop.password);

    if (!checkedPassword) {
      return response.status(400).json({
        status: "failed",
        message: "password wrong",
      });
    }

    const token = createToken(shop._id, "user");
    const shopId = shop._id

    return response.status(200).json({
      status: "success",
      message: "Login Successful",
      token,shop : shopId
    });
  } catch (e) {
    return response.status(400).json({
      message: e.message,
    });
  }
};

module.exports = { loginShop };
