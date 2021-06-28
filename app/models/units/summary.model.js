const mongoose = require("mongoose");
const $baseSchema = require("../$baseSchema");
const UnitModel = require("./_unit.model");

const schema = new mongoose.Schema({}, { discriminatorKey: "type" });

module.exports = UnitModel.discriminator(
  "summary",
  $baseSchema("summary", schema)
);
