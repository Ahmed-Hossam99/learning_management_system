const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const _ = require("lodash");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const solution = await models.solution
    .findOne({ _id: id, status: "checking" })
    .populate({
      path: "exam",
      populate: ["questions.question", "questions.childrenQuestions.child"],
      select: "-students",
    });

  if (!solution) return APIResponse.NotFound(res, "No solution with that id");

  if (solution.exam.addedBy !== req.me.id && req.me.role !== "admin")
    return APIResponse.Forbidden(res, "Dont allow to do this action");

  let examObj = {};
  solution.exam.questions.forEach((q) => {
    if (q.question.type === "group") {
      examObj[q.question.id] = {};
      q.childrenQuestions.forEach((chq) => {
        examObj[q.question.id][chq.child.id] = chq;
      });
    } else {
      examObj[q.question.id] = q;
    }
  });
  for (let i = 0; i < req.body.length; i++) {
    let key = _.findKey(
      solution.questions,
      _.matchesProperty("question", parseInt(req.body[i].question))
    );
    if (key === undefined) {
      return APIResponse.NotFound(res, "No question with that id");
    }
    // Check If Mark Is Greater Than Point
    // child question
    if (examObj[req.body[i].question] === undefined) {
      let subQuestion = await models._question.findById(req.body[i].question);
      let childQuestion =
        examObj[subQuestion.parentQuestion.question][req.body[i].question];
      if (childQuestion.point < req.body[i].mark)
        return APIResponse.BadRequest(
          res,
          "Mark is greater than points of this question , 1"
        );
    } else {
      // if main question
      if (examObj[req.body[i].question].point < req.body[i].mark)
        return APIResponse.BadRequest(
          res,
          "Mark is greater than points of this question, 2"
        );
    }
    solution.questions[key].mark = req.body[i].mark;
    solution.questions[key].correct = req.body[i].mark === 0 ? false : true;
  }
  let nullCorrectKey = _.findKey(
    solution.questions,
    _.matchesProperty("correct", null)
  );
  if (nullCorrectKey === undefined) solution.status = "done";
  await solution.save();

  // send notification
  if (solution.status === "done") {
  }

  return APIResponse.Ok(res, solution);
});
