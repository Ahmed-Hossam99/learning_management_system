const mongoose = require("mongoose");
const UserModel = require("./_user.model");

const schema = new mongoose.Schema(
  {
    grade: {
      type: String,
      // required: true,
    },
  },
  { discriminatorKey: "role" }
);
module.exports = UserModel.discriminator("student", schema);
