const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const _ = require("lodash");
const moment = require("moment");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  let query = {
    _id: id,
    ...(req.me.role === "student" && {
      availability: true,
    }),
    ...(req.me.role === "teacher" && {
      addedBy: req.me.id,
    }),
  };
  //console.log(query)
  let exam = await models._exam
    .findOne(query, {
      students: { $elemMatch: { student: req.me.id } },
      numberOfAllowedTimesToSolve: 1,
      duration: 1,
      isTimed: 1,
      passing_percentage: 1,
      questions: 1,
      title: 1,
      addedBy: 1,
      availability: true,
    })
    .populate([
      {
        path: "questions.question",
        select:
          "head modelAnswer choices numberOfInputs attachment parentQuestion image",
      },
      {
        path: "questions.childrenQuestions.child", // from question schema 
        select:
          "head modelAnswer choices numberOfInputs attachment parentQuestion image",
      },
      {
        path: "students.solutions",
        populate: "questions.question",// from solution path 
      },
    ]);
  if (!exam) return APIResponse.NotFound(res, "No exam with that id");
  // dashboard area
  if (req.me.role !== "student") {
    return APIResponse.Ok(res, exam);
  }

  let response = {};

  // all student's solutions
  const solutions = exam.students[0] ? exam.students[0].solutions : [];

  // check if checking solution exists
  let checkingKey = _.findKey(solutions, { status: "checking" });
  if (checkingKey !== undefined)
    return APIResponse.Forbidden(res, { // if student done solution and teacher still schecking solution 
      msg: "You cant solve this exam until completely checking by your teacher",
      flag: 2,// remah 
    });

  exam = exam.toJSON(); // to insert remaining time , totalMarks
  // check if has solving solution
  let solvingKey = _.findKey(solutions, { status: "solving" });
  if (solvingKey !== undefined) {
    // check timer :
    if (exam.isTimed === true) {
      let remainingTime = moment(solutions[solvingKey].createdAt)
        .add(exam.duration, "m")
        .diff(moment.utc(), "s");
      if (remainingTime <= 0) return APIResponse.Ok(res, { remainingTime });
      exam.remainingTime = remainingTime;
    }
    response = await examWithSolution(exam, solutions[solvingKey], true);
    return APIResponse.Ok(res, response);
  }

  // all next are done solutions
  // check if reach passing percentage
  let isPassed = false;
  let highestSolutionKey = null;
  let highestScore = -1;
  for (let i = 0; i < solutions.length; i++) {
    let solution = solutions[i];
    if ((solution.mark / exam.points) * 100 >= exam.passing_percentage) {
      isPassed = true;
    }
    if (solution.mark > highestScore) {
      highestScore = solution.mark;
      highestSolutionKey = i; // highest mark of solution in solution array 
    }
  }

  if (isPassed) {
    response = await examWithSolution(
      exam,
      solutions[highestSolutionKey],
      false //remah 
    );
    return APIResponse.Ok(res, response);
  }
  // check if reach limit times to solve
  if (solutions.length >= exam.numberOfAllowedTimesToSolve) {
    response = await examWithSolution(
      exam,
      solutions[highestSolutionKey],
      false
    );
    return APIResponse.Ok(res, response);
  }

  // forbidden (student must solve this exam)
  return APIResponse.Forbidden(res, {
    msg: "You have to Start Exam first please",
    flag: 1, // remah 
  });
});

const examWithSolution = async (exam, solution, isSolving) => {
  // array of objects , key is id , value is question
  let solutionObj = {};
  solution.questions.forEach((q) => {
    solutionObj[q.question.id] = q;  // { questionID :{question} }
  });
  for (let i = 0; i < exam.questions.length; i++) {
    let q = exam.questions[i];
    if (q.question.type === "group") {
      for (let j = 0; j < q.childrenQuestions.length; j++) {
        let sq = q.childrenQuestions[j];
        q.childrenQuestions[j] = q.childrenQuestions[j].toJSON();
        q.childrenQuestions[j].answer =
          solutionObj[sq.child.id] === undefined
            ? null
            : solutionObj[sq.child.id].answer;
        q.childrenQuestions[j].answerImage =
          solutionObj[sq.child.id] === undefined
            ? null
            : solutionObj[sq.child.id].answerImage;
        if (isSolving) {
          q.childrenQuestions[j].child.modelAnswer = undefined;
        } else {
          q.childrenQuestions[j].mark =
            solutionObj[sq.child.id] === undefined
              ? 0
              : solutionObj[sq.child.id].mark;
          q.childrenQuestions[j].flag =
            solutionObj[sq.child.id] === undefined
              ? 2
              : solutionObj[sq.child.id].mark === 0
                ? 0
                : 1;
        }
      }
    } else {
      exam.questions[i] = exam.questions[i].toJSON();
      exam.questions[i].answer =
        solutionObj[q.question.id] === undefined
          ? null
          : solutionObj[q.question.id].answer;
      exam.questions[i].answerImage =
        solutionObj[q.question.id] === undefined
          ? null
          : solutionObj[q.question.id].answerImage;
      if (isSolving) {
        exam.questions[i].question.modelAnswer = undefined;
      } else {
        exam.questions[i].mark =
          solutionObj[q.question.id] === undefined
            ? 0
            : solutionObj[q.question.id].mark;
        exam.questions[i].flag =
          solutionObj[q.question.id] === undefined
            ? 2
            : solutionObj[q.question.id].mark === 0
              ? 0
              : 1;
      }
    }
  }
  if (!isSolving) exam.totalMarks = solution.mark;
  return exam;
};
