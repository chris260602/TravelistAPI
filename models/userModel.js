const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userRole: {
    type: Number,
    required: [true, "Must Include User Role"],
    default: 0,
    min: [0, "Invalid Role"],
  },
  userName: {
    type: String,
    required: [true, "Must Include User Name"],
    minlength: 6,
  },
  userEmail: {
    type: String,
    required: [true, "Must Include User Email"],
    unique: [true, "You Need Another Email"],
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  },
  password: {
    type: String,
    required: [true, "Must Include User Password"],
    minlength: 6,
  },
  balance: {
    type: Number,
    required: [true, "Invalid Balance"],
    default: 0,
  },
  profilePicture: {
    type: String,
    required: [true, "Must Include Profile Picture"],
    default: process.env.DEFAULT_PROFILE_PICTURE,
  },
  accountStatus: {
    type: String,
    enum: ["Pending", "Active"],
    default: "Pending",
  },
  confirmationCode: {
    type: String,
    unique: [true, "Must have unique code"],
  },
  passwordResetCode: {
    type: String,
    default: "-1",
    unique: [true, "Must have unique code"],
  },
});

const users = mongoose.model("User", userSchema);
module.exports = users;
