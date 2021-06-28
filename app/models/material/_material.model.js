const mongoose = require("mongoose");
const $baseModel = require("../$baseModel");

const schema = new mongoose.Schema(
  {
    object: {
      type: Number,
      refPath: "objectType",
      required: true,
    },
    objectType: {
      type: String,
      enum: ["lesson"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, discriminatorKey: "type" }
);

const response = (doc) => {
  return {
    id: doc.id,
    object: doc.object,
    objectType: doc.objectType,
    title: doc.title,
    type: doc.type,
    link: doc.link, // pdf & video
    duration: doc.duration, // video
    exam: doc.exam, // quiz & assignment
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

module.exports = $baseModel("material", schema, {
  responseFunc: response,
});
