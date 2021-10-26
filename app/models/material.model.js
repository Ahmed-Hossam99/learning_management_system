const mongoose = require("mongoose");
const $baseModel = require("./$baseModel");
const timingRules = /^[0-5]?\d:[0-5]\d$/;
const schema = new mongoose.Schema(
    {
        lecture: {
            type: Number,
            ref: "lecture",
            required: true,
        },
        videoPhoto: {
            type: String,
        },
        title: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["pdf", "video"],
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
        addedBy: {
            type: Number,
            ref: "user",
            required: true,
        },
        content: [
            {
                _id: false,
                title: {
                    type: String,
                    required: true,
                },
                timing: {
                    type: String,
                    required: true,
                    match: timingRules,
                },
            },
        ],
    },
    { timestamps: true }
);

const response = (doc) => {
    return {
        id: doc.id,
        videoPhoto: doc.videoPhoto,
        content: doc.type === "video" ? doc.content : undefined,
        addedBy: doc.addedBy,
        title: doc.title,
        type: doc.type,
        link: doc.link,
        lecture: doc.lecture,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
};

module.exports = $baseModel("material", schema, {
    responseFunc: response,
});
