const mongoose = require("mongoose");
const UserModel = require("./_user.model");

const schema = new mongoose.Schema(
    {
        students: [
            {
                type: Number,
                ref: "student",
            },
        ],
        address: {
            type: String,
            required: true,
        },
    },
    { discriminatorKey: "role" }
);
module.exports = UserModel.discriminator("parent", schema);
