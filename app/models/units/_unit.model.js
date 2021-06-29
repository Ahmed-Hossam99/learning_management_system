const mongoose = require("mongoose");
const $baseModel = require("../$baseModel");

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
    course: {
      type: Number,
      ref: "course",
      required: true,
    }
  },
  { timestamps: true, discriminatorKey: "type" }
);

const response = (doc) => {
  return {
    id: doc.id,
    date: doc.date,
    type: doc.type,
    nameAr: doc.nameAr,
    nameEn: doc.nameEn,
    subject: doc.subject,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

module.exports = $baseModel("unit", schema, {
  responseFunc: response,
});
