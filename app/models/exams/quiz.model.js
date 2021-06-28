const mongoose = require("mongoose");
const examModel = require("./_exam.model");

const schema = new mongoose.Schema(
  {
    duration: {
      type: Number,
      required: true,
    },
    passing_percentage: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, discriminatorKey: "type" }
);

module.exports = examModel.discriminator("quiz", schema);
