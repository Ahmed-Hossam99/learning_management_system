const mongoose = require("mongoose");
const UserModel = require("./_user.model");

const schema = new mongoose.Schema({
    subjects: [
        {
            type: Number,
            ref: "subject",
        },
    ],
    sections: [
        {
            type: Number,
            ref: "section",
        },
    ],
    classes: [
        {
            type: Number,
            ref: "class",
        },
    ],
}, { discriminatorKey: "role" });
module.exports = UserModel.discriminator("teacher", schema);
