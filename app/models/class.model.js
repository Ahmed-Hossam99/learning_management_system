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
    level: {
      type: Number,
      ref: 'level',
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
    level: doc.level,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

module.exports = $baseModel('class', schema, {
  responseFunc: response,
});
