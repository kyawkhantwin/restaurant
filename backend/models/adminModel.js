const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
 
},{
  timestamps: true
});

adminSchema.statics.register = async function (name, email, password) {
  if (!name || !email || !password) {
    throw new Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid Email");
  }

  const emailExist = await this.findOne({ email });
  if (emailExist) {
    throw new Error("Email already exists");
  }

  const nameExist = await this.findOne({ name });
  if (nameExist) {
    throw new Error("User already exists");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const admin = await this.create({ name, email, password: hashPassword });

  return admin;
};

adminSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw new Error("All fields must be filled");
  }
  const admin = await this.findOne({ email });
  if (!admin) {
    throw new Error("Email hasn't been registered");
  }

  const comparePassword = await bcrypt.compare(password, admin.password);

  if (!comparePassword) {
    throw new Error('Wrong Password');
  }

  return admin;
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
