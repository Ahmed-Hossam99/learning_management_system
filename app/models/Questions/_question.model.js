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
    unit: {
      type: Number,
      ref: "unit",
    },
    course: {
      type: Number,
      ref: "course",
    },
    head: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    pdf: {
      type: String,
    },
    addedBy: {
      type: Number,
      ref: "user",
      required: true,
    },
    parentQuestion: {
      question: {
        type: Number,
        ref: "question",
      },
      weight: {
        type: Number,
      },
    },
    isChild: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, discriminatorKey: "type" }
);

const response = (doc) => {
  return {
    id: doc.id,
    isChild: doc.isChild,
    type: doc.type,
    object: doc.object,
    objectType: doc.objectType,
    unit: doc.unit,
    subject: doc.subject,
    head: doc.head,
    image: doc.image,
    pdf: doc.pdf,
    choices: doc.choices, // choose question
    numberOfInputs: doc.numberOfInputs, // complete question
    modelAnswer: doc.modelAnswer,
    attachment: doc.attachment,
    addedBy: doc.addedBy,
    parentQuestion:
      doc.parentQuestion.question === undefined
        ? undefined
        : doc.parentQuestion,
    childrenQuestions: doc.childrenQuestions,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

module.exports = $baseModel("question", schema, {
  responseFunc: response,
});
