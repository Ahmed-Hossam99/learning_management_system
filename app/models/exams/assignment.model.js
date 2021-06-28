const mongoose = require("mongoose");
const examModel = require("./_exam.model");

const schema = new mongoose.Schema(
  {
    deadline: {
      type: Date,
      required: true,
    },
    passing_percentage: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, discriminatorKey: "type" }
);

module.exports = examModel.discriminator("assignment", schema);
