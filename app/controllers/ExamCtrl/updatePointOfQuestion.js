const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const _ = require("lodash");

module.exports = $baseCtrl(async (req, res) => {
  const eid = parseInt(req.params.eid);
  const qid = parseInt(req.params.qid);
  if (isNaN(eid) || isNaN(qid)) return APIResponse.NotFound(res);
  const exam = await models._exam
    .findById(eid)
    .select("-students")
    .populate(["questions.question", "questions.childrenQuestions.child"]);
  if (!exam) return APIResponse.NotFound(res, "No Exam With That id");

  if (exam.addedBy !== req.me.id && req.me.role !== "admin")
    return APIResponse.Forbidden(res, "Dont allow to do this action");

  let key = _.findKey(exam.questions, _.matchesProperty("question.id", qid));
  if (key === undefined)
    return APIResponse.NotFound(res, "No question with that id");

  exam.questions[key].point = req.body.point;

  if (exam.questions[key].question.type === "group") {
    let children = exam.questions[key].childrenQuestions;
    let totalWeight = 0;
    children.forEach((ch) => (totalWeight += ch.child.parentQuestion.weight));
    children.forEach((ch) => {
      ch.point =
        (ch.child.parentQuestion.weight / totalWeight) * req.body.point;
    });
  }
  await exam.save();

  return APIResponse.Ok(res, exam);
});
