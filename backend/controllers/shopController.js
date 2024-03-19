const Admin = require("../models/adminModel.js");
const Shop = require("../models/shopModel.js");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { U_SECRET, A_SECRET } = require("../src/config.js");


//done
const createToken = (userData, userType) => {
  const secretKey = userType === "user" ? U_SECRET : A_SECRET;
  return jwt.sign({ _id: userData._id, userType }, secretKey, { expiresIn: "3d" });
};

const createShop = async function (request, response) {
  try {
    const { name, phone, location, userName, password,adminId } = request.body;

    if (!name || !phone || !location || !userName || !password ) {
      return response.status(400).json({
        status: "failed",
        message: "Fill in all the fields",
      });
    }

    const checkAdmin = await Admin.findById(adminId)

    if (!checkAdmin) {
      return response.status(403).json({
        status: "failed",
        message: "No permission to create a shop",
      });
    }
    const hashedPassword =await bcrypt.hash(password,10)

    const shop = await Shop.create({...request.body , password:hashedPassword});
   

    // Return success response with the created shop
    return response.status(201).json({
      status: "success",
      message: "Created Shop",
     
    });
  } catch (e) {
    // Return error response if an exception occurs
    return response.status(500).json({
      message: e.message,
    });
  }
};

const getShops = async function (request, response) {
  try {
    const shop = await Shop.find({});
    if (shop.length === 0) {
      return response.status(200).json({
        status: "success",
        message: "No Shop found",
      });
    }
    return response.status(200).json({
      status: "success",
      message: "All Shop",
      data: { shop },
    });
  } catch (e) {
    return response.status(400).json({
      message: e.message,
    });
  }
};




//done
const updateShop = async function (request, response) {
  try {
    const { id } = request.params;
    const { name, phone, location, userName, password, email, adminId } = request.body;

    if (!name || !phone || !location || !userName || !password || !email) {
      return response.status(400).json({
        status: "failed",
        message: "Fill in all the fields",
      });
    }
    const checkEmail = await Admin.findOne({ _id: adminId, email: email });

    if (!checkEmail) {
      return response.status(403).json({
        status: "failed",
        message: "No permission to create a shop",
      });
    }

    const shop = await Shop.findByIdAndUpdate(id, request.body, { new: true });

    if (!shop) {
      return response.status(400).json({
        status: "failed",
        message: "No Shop found",
      });
    }

    return response.status(200).json({
      status: "success",
      message: "Shop updated",
      data: { shop: shop },
    });
  } catch (e) {
    console.log(e.message);
    return response.status(400).json({
      message: e.message,
    });
  }
};

const deleteShop = async function (request, response) {
  try {
    const { id } = request.params;
    const shop = await Shop.findByIdAndDelete(id);

    if (!shop) {
      return response.status(400).json({
        status: "failed",
        message: "No product found",
      });
    }
    const updateShop = await Shop.find({});
    return response.status(200).json({
      status: "success",
      message: "Shop deleted",
      data: { shop: updateShop },
    });
  } catch (e) {
    console.log(e.message);
    return response.status(400).json({
      message: e.message,
    });
  }
};

module.exports = { createShop, getShops, updateShop, deleteShop };
