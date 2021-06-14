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
    icon: {
      type: String,
      default:
        "https://pngimage.net/wp-content/uploads/2018/06/subject-icon-png-7.png",
    },
  },
  { timestamps: true, discriminatorKey: "type" }
);

const response = (doc) => {
  return {
    id: doc.id,
    type: doc.type,
    nameAr: doc.nameAr,
    nameEn: doc.nameEn,
    icon: doc.icon,
    class: doc.class, // for subject
    semester: doc.semester, // for subject
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

module.exports = $baseModel("course", schema, {
  responseFunc: response,
});
