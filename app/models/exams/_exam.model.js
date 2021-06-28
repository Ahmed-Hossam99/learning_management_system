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
        seen: {
          type: Boolean,
          default: false,
        },
      },
    ],
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
  let isSolving = false;
  let isChecking = false;
  let isPassed = false;
  let highestScore = -1;
  let isAllowed;
  let showResults = false;
  if (options && options.showResults === true) {
    const solutions = doc.students[0] ? doc.students[0].solutions : [];
    isAllowed = solutions.length < doc.numberOfAllowedTimesToSolve;
    showResults = true;
    solutions.forEach((solution) => {
      if (solution.status === "solving") isSolving = true;
      else if (solution.status === "checking") isChecking = true;
      else if ((solution.mark / doc.points) * 100 >= doc.passing_percentage)
        isPassed = true;
      highestScore =
        solution.mark > highestScore && solution.status === "done"
          ? solution.mark
          : highestScore;
    });
  }
  return {
    id: doc.id,
    // students: doc.students,
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
    isSolving: showResults ? isSolving : undefined,
    isChecking: showResults ? isChecking : undefined,
    isPassed: showResults ? isPassed : undefined,
    isAllowed: showResults ? isAllowed : undefined,
    highestScore:
      showResults === false || highestScore === -1 ? undefined : highestScore,
    questions: options && options.hideQuestions ? undefined : doc.questions,
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
