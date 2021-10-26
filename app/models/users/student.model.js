const mongoose = require("mongoose");
const UserModel = require("./_user.model");

const schema = new mongoose.Schema(
  {
    section: {
      type: Number,
      ref: 'section',
      required: true,
    },
    level: {
      type: String,
      ref: 'level',
      required: true,
    },
    mustChangePassword: {
      type: Boolean,
      defult: false
    },
    address: {
      type: String,
    }

  },
  { discriminatorKey: "role" }
);
module.exports = UserModel.discriminator("student", schema);
