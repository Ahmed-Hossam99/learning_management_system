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
    class: {
      type: Number,
      ref: "class",
      required: true,
    },
    level: {
      type: Number,
      ref: "level",
      required: true,
    },
    section: {
      type: Number,
      ref: "section",
      required: true,
    },
    educationalSystem: {
      type: Number,
      ref: 'educationalSystem',
      required: true,
    },
    teacher: {
      type: Number,
      ref: "teacher",
    },
  },
);
const response = (doc) => {
  return {
    id: doc.id,
    nameAr: doc.nameAr,
    nameEn: doc.nameEn,
    educationalSystem: doc.educationalSystem,
    level: doc.level,
    class: doc.class,
    section: doc.section,
    title: doc.title,
    teacher: doc.teacher,
    image: doc.image,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};
module.exports = $baseModel('subject', schema, {
  responseFunc: response,
});
