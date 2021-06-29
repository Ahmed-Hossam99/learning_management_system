const mongoose = require("mongoose");
const UserModel = require("./_user.model");

const schema = new mongoose.Schema({}, { discriminatorKey: "role" });
module.exports = UserModel.discriminator("teacher", schema);
