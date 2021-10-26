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
      required: true,
    },
    subject: {
      type: Number,
      ref: "subject",
      required: true,
    },
  },
  { timestamps: true }
);

const response = (doc) => {
  return {
    id: doc.id,
    nameAr: doc.nameAr,
    nameEn: doc.nameEn,
    unite: doc.unite,
    subject: doc.subject,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

module.exports = $baseModel("lecture", schema, {
  responseFunc: response,
});
