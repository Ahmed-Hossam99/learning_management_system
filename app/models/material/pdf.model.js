const mongoose = require("mongoose");
const $baseSchema = require("../$baseSchema");
const MaterialModel = require("./_material.model");

const schema = new mongoose.Schema(
  {
    link: {
      type: String,
      required: true,
    },
  },
  { discriminatorKey: "type" }
);

module.exports = MaterialModel.discriminator("pdf", $baseSchema("pdf", schema));
