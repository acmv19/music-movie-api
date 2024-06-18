const { string } = require("joi");
const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    director: {
      type: String,
      required: [true, "please provide director name"],
      maxLength: 100,
    },
    title: {
      type: String,
      required: [true, "please provide a movie name"],
      maxLength: 200,
    },
    Genre: {
      type: String,
      enum: ["drama", "action", "horror", "comedy"],
      default: "action",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", MovieSchema);
