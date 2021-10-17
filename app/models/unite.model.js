const mongoose = require("mongoose");
const $baseModel = require("./$baseModel");

const schema = new mongoose.Schema(
    {
        nameAr: {
            type: String,
            required: true,
        },
        nameEn: {
            type: String,
        },
        subject: {
            type: String,
            ref: 'subject'
        },


    },
    { timestamps: true }
);

const response = (doc) => {
    return {
        id: doc.id,
        nameAr: doc.nameAr,
        nameEn: doc.nameEn,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
};

module.exports = $baseModel("unite", schema, {
    responseFunc: response,
});
