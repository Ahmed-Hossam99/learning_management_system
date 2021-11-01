const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const _ = require("lodash");
const moment = require("moment");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const exam = await models.generalExam
    .findOne(
      { _id: id, availability: true },
      {
        students: { $elemMatch: { student: req.me.id } },
        numberOfAllowedTimesToSolve: 1,
        duration: 1,
        isTimed: 1,
        passing_percentage: 1,
        questions: 1,
      }
    )
    .populate("students.solutions");
  if (!exam) return APIResponse.NotFound(res, "No General exam with that id");

  // all student's solutions
  const solutions = exam.students[0] ? exam.students[0].solutions : []; //remah done
  // check if checking solution exists
  let checkingKey = _.findKey(solutions, { status: "checking" }); // if user submitted soltion 
  if (checkingKey !== undefined)
    return APIResponse.Forbidden(res, "You have checking solution");

  // check if has solving solution
  let solvingKey = _.findKey(solutions, { status: "solving" });
  if (solvingKey !== undefined) {
    // check timer :
    if (exam.isTimed === true) {
      let remainingTime = moment(solutions[solvingKey].createdAt)
        .add(exam.duration, "m")// duration = time of exam 
        .diff(moment.utc(), "s");
      if (remainingTime <= 0)
        return APIResponse.Forbidden(res, "Timer Is Finished");
    }
    return APIResponse.Ok(res, solutions[solvingKey]); // return fianl solution 
  }
  // check if reach passing percentage
  let isPassed = false;
  solutions.forEach((solution) => { //if user passed of exam blocked exam
    if ((solution.mark / exam.points) * 100 >= exam.passing_percentage)
      isPassed = true;
  });  // to guarenty any user can pass one time on exam 
  if (isPassed) return APIResponse.Forbidden(res, "You Passed This Exam");
  // check if reach limit times to solve
  if (solutions.length >= exam.numberOfAllowedTimesToSolve)
    return APIResponse.Forbidden(res, "You reached limit of this exam");
  // create new one
  let solution = await new models.solution({
    exam: id,
    student: req.me.id,
    status: "solving",
  }).save();

  // add student if not exist before , or add new solution to his history
  if (solutions.length) { // if length >0 enter ths condition 
    await models._exam.updateOne(
      {
        _id: id,
        students: { $elemMatch: { student: req.me.id } },
      },
      {
        $push: {
          "students.$.solutions": solution.id, //update oject and  pussh solution 
        },
      }
    );
  } else {
    await models._exam.updateOne(
      {
        _id: id,
      },
      {
        $push: {
          students: { student: req.me.id, solutions: [solution.id] }, //new opject of student 
        },
      }
    );
  }
  return APIResponse.Ok(res, solution);
});
