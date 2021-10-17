const mongoose = require("mongoose");
const examModel = require("./_exam.model");

const schema = new mongoose.Schema(
  {
    duration: {
      type: Number,
    },
    isTimed: {
      type: Boolean,
      default: false,
      required: true,
    },
    passing_percentage: {
      type: Number,
      required: true,
    },
    object: {
      type: Number,
      refPath: "objectType",
      required: true,
    },
    objectType: {
      type: String,
      enum: ["lesson", "unit", "subject"],
      required: true,
    },
    subject: {
      type: Number,
      ref: "subject",
      required: true,
    },
  },
  { timestamps: true, discriminatorKey: "type" }
);

module.exports = examModel.discriminator("general", schema);
