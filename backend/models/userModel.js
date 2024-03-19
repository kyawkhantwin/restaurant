const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, require: true, unquie: true },
  email: { type: String, require: true, unquie: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", unquie: true, required: true },
  password: { type: String, require: true },

},{
  timestamps: true
});

userSchema.statics.register = async function (name, email, password) {
  if ((!name, !email, !password)) {
    throw new Error("All field must be filled");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Email invalid");
  }
  // if (!validator.isStrongPassword(password)) {
  //   throw new Error("Password is not strong enough");
  // }

  const emailExist = await this.findOne({ email });
  if (emailExist) {
    throw new Error("Email already exist");
  }
  const nameExist = await this.findOne({ name });
  if (nameExist) {
    throw new Error("User already exist");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await this.create({ name, email, password: hashPassword });

  return user;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw new Error("All field must required");
  }
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("Email hasn't been registered");
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    throw new Error("Wrong Password");
  }

  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
