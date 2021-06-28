const mongoose = require("mongoose");
const $baseModel = require("./$baseModel");

const schema = new mongoose.Schema(
  {
    exam: {
      type: Number,
      ref: "exam",
      required: true,
    },
    student: {
      type: Number,
      ref: "student",
      required: true,
    },
    status: {
      type: String,
      enum: ["solving", "checking", "done"],
      required: true,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    questions: [
      new mongoose.Schema(
        {
          question: {
            type: Number,
            required: true,
            ref: "question",
          },
          answerImage: {
            type: String,
          },
          correct: {
            type: Boolean,
            default: null,
          },
          mark: {
            type: Number,
            default: 0,
          },
        },
        { discriminatorKey: "type", _id: false }
      ),
    ],
  },
  { timestamps: true }
);

schema.virtual("mark").get(function () {
  let totalMark = 0;
  this.questions.forEach((question) => (totalMark += question.mark));
  return totalMark;
});

schema.path("questions").discriminator(
  "choose",
  new mongoose.Schema(
    {
      answer: {
        type: Number,
      },
    },
    { _id: false }
  )
);

schema.path("questions").discriminator(
  "complete",
  new mongoose.Schema(
    {
      answer: [
        {
          type: String,
        },
      ],
    },
    { _id: false }
  )
);

schema.path("questions").discriminator(
  "paragraph",
  new mongoose.Schema(
    {
      answer: {
        type: String,
      },
    },
    { _id: false }
  )
);

schema.path("questions").discriminator(
  "truefalse",
  new mongoose.Schema(
    {
      answer: {
        type: Boolean,
      },
    },
    { _id: false }
  )
);

schema.path("questions").discriminator(
  "voice",
  new mongoose.Schema(
    {
      answer: {
        type: String,
      },
    },
    { _id: false }
  )
);

const response = (doc) => {
  return {
    id: doc.id,
    exam: doc.exam,
    student: doc.student,
    status: doc.status,
    questions: doc.questions,
    mark: doc.mark,
    submittedAt: doc.submittedAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

module.exports = $baseModel("solution", schema, {
  responseFunc: response,
});
