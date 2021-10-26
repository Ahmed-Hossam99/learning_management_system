const mongoose = require("mongoose");
const $baseSchema = require("./$baseSchema");
// const CourseModel = require("./courses/_course.model");
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
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    level: {
      type: Number,
      ref: "level",
      required: true,
    },
    teachers: [{
      type: Number,
      ref: "teacher",
    }],
    // teacher: {
    // //   type: Number,
    // //   ref: "teacher",
    // // },
    visibility: {
      type: Boolean,
      default: true,
    },
  },
);
const response = (doc) => {
  return {
    id: doc.id,
    nameAr: doc.nameAr,
    nameEn: doc.nameEn,
    level: doc.level,
    title: doc.title,
    teacher: doc.teacher,
    image: doc.image,
    visibility: doc.visibility,
    description: doc.description,
    teachers: doc.teachers,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};
module.exports = $baseModel('subject', schema, {
  responseFunc: response,
});
