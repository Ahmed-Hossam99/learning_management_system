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
    unit: {
      type: Number,
      ref: "unit",
      required: true,
    },
    course: {
      type: Number,
      ref: "course",
      required: true,
    },
    numberOfExams: {
      type: Number,
      default: 0,
      required: true,
    },
    students: [
      {
        _id: false,
        student: {
          type: Number,
          ref: "student",
          required: true,
        }
      },
    ],
  },
  { timestamps: true }
);

const response = (doc) => {
  return {
    id: doc.id,
    numberOfExams: doc.numberOfExams,
    nameAr: doc.nameAr,
    nameEn: doc.nameEn,
    unit: doc.unit,
    subject: doc.subject,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

module.exports = $baseModel("lesson", schema, {
  responseFunc: response,
});
