const mongoose = require("mongoose");
const $baseSchema = require("../$baseSchema");
const MaterialModel = require("./_material.model");

const schema = new mongoose.Schema(
  {
    exam: {
      type: Number,
      ref: "exam",
      required: true,
    },
  },
  { discriminatorKey: "type" }
);

module.exports = MaterialModel.discriminator(
  "m_assignment",
  $baseSchema("m_assignment", schema)
);
