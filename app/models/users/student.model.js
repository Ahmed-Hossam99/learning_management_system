const mongoose = require("mongoose");
const UserModel = require("./_user.model");

const schema = new mongoose.Schema(
  {
    section: {
      type: Number,
      ref: 'section',
      required: true,
    },
    class: {
      type: String,
      ref: 'class',
      required: true,
    },
    level: {
      type: String,
      ref: 'level',
      required: true,
    },
    educationalSystem: {
      type: String,
      ref: 'educationalSystem',
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
