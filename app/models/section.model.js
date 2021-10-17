const mongoose = require('mongoose');
const $baseModel = require('./$baseModel');

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
    capacity: {
      type: Number,
      required: true
    },
    current_capacity: {
      type: Number,
      default: 0
    },
    class: {
      type: Number,
      ref: 'class',
      required: true,
    },
    educationalSystem: {
      type: Number,
      ref: 'educationalSystem',
      required: true,
    },
  },
  { timestamps: true },
);

const response = (doc) => {
  return {
    id: doc.id,
    nameAr: doc.nameAr,
    nameEn: doc.nameEn,
    class: doc.class,
    current_capacity: doc.current_capacity,
    educationalSystem: doc.educationalSystem,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

module.exports = $baseModel('section', schema, {
  responseFunc: response,
});
