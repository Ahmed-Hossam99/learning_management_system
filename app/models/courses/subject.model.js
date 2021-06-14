const mongoose = require("mongoose");
const $baseSchema = require("../$baseSchema");
const CourseModel = require("./_course.model");

const schema = new mongoose.Schema(
  {
    semester: {
      type: String,
      enum: ["first", "second"],
      required: true,
    },
    class: {
      type: Number,
      ref: "class",
      required: true,
    },
  },
  { discriminatorKey: "type" }
);

module.exports = CourseModel.discriminator(
  "subject",
  $baseSchema("subject", schema)
);
