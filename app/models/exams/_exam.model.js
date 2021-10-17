const mongoose = require("mongoose");
const $baseModel = require("../$baseModel");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    addedBy: {
      type: Number,
      ref: "user",
    },
    questions: [examQuestionSchema()],
    availability: {
      type: Boolean,
      default: false,
    },
    students: [
      {
        _id: false,
        student: {
          type: Number,
          ref: "student",
          required: true,
        },
        solutions: [
          {
            type: Number,
            ref: "solution",
            required: true,
          },
        ],
      },
    ],
    numberOfAllowedTimesToSolve: {
      type: Number,
      default: 1,
      required: true,
    },
  },
  { timestamps: true, discriminatorKey: "type" }
);

schema.virtual("points").get(function () {
  if (this.questions === undefined) return 0;
  let points = 0;
  for (let i = 0; i < this.questions.length; i++) {
    points += this.questions[i].point;
  }
  return points;
});

const response = (doc, options) => {
  return {
    id: doc.id,
    subject: doc.subject,
    numberOfAllowedTimesToSolve: doc.numberOfAllowedTimesToSolve,
    availability: doc.availability,
    title: doc.title,
    type: doc.type,
    points: doc.points,
    addedBy: doc.addedBy,
    object: doc.object, // general exam
    objectType: doc.objectType, // general exam
    duration: doc.duration, // general exam
    isTimed: doc.isTimed, // general exam
    passing_percentage: doc.passing_percentage, // general exam
    questions:
      doc.questions &&
        doc.questions[0] &&
        !(doc.questions[0].question instanceof Object)
        ? undefined
        : doc.questions,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

module.exports = $baseModel("exam", schema, {
  responseFunc: response,
});

function examQuestionSchema() {
  const schema = new mongoose.Schema(
    {
      question: {
        type: Number,
        ref: "question",
        required: true,
      },
      point: {
        type: Number,
        required: true,
      },
      childrenQuestions: [childrenQuestionSchema()],
    },
    { _id: false }
  );

  function childrenQuestionSchema() {
    const schema = new mongoose.Schema(
      {
        child: {
          type: Number,
          ref: "question",
          required: true,
        },
        point: {
          type: Number,
          required: true,
        },
      },
      { _id: false }
    );

    schema.set("toJSON", {
      transform: function (doc) {
        return {
          child: doc.child,
          point: doc.point,
        };
      },
    });

    return schema;
  }

  schema.set("toJSON", {
    transform: function (doc) {
      return {
        question: doc.question,
        point: doc.point,
        childrenQuestions: doc.childrenQuestions.length
          ? doc.childrenQuestions
          : undefined,
      };
    },
  });

  return schema;
}
