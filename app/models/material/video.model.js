const mongoose = require("mongoose");
const $baseSchema = require("../$baseSchema");
const MaterialModel = require("./_material.model");

const schema = new mongoose.Schema(
  {
    link: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  { discriminatorKey: "type" }
);

module.exports = MaterialModel.discriminator(
  "video",
  $baseSchema("video", schema)
);
