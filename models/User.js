const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please insert name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Please insert email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please insert valid email",
    ],
    unique: true, //unique index
  },
  password: {
    type: String,
    required: [true, "Please insert password"],
    minlength: 6,
    //maxlength: 12,
  },
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
/*<---------- We using JWTs in this project--------->>>> */
UserSchema.methods.createJWT = function () {
  //return jwt.sign({ userId: this._id, name: this.name }, "jwtSecret", {expiresIn: "30d", });
  //console.log("JWT_SECRET:", process.env.JWT_SECRET); // Depuración
  //console.log("JWT_LIFETIME:", process.env.JWT_LIFETIME); // Depuración
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
