const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");
const _ = require("lodash");

module.exports = $baseCtrl(async (req, res) => {
  const eid = parseInt(req.params.eid);
  const qid = parseInt(req.params.qid);
  console.log('here')
  if (isNaN(eid) || isNaN(qid)) return APIResponse.NotFound(res);
  // handel authorization
  let exam = await models._exam.findById(eid).select("-students");
  const question = await models._question.findById(qid);
  if (!exam || !question)
    return APIResponse.NotFound(res, "No Exam/question With That Id");
  if (exam.addedBy !== req.me.id && req.me.role !== "admin")
    return APIResponse.Forbidden(res, "Dont allow to do this action");

  let key = _.findKey(exam.questions, { question: qid });
  if (key === undefined)
    return APIResponse.NotFound(res, "No Question With That id");

  exam.questions.splice(key, 1);
  await exam.save();

  if (question.type !== "group") {
    await models.solution.updateMany(
      {
        exam: eid,
        "questions.question": qid,
      },
      { $pull: { questions: { question: qid } } }
    );
  } else {
    await models.solution.updateMany(
      {
        exam: eid,
        "questions.question": { $in: question.childrenQuestions },
      },
      {
        $pull: { questions: { question: { $in: question.childrenQuestions } } },
      }
    );
  }
  // update question
  // await models._exam.updateOne(
  //   { _id: eid },
  //   { $pull: { questions: { question: qid } } }
  // );

  return APIResponse.Ok(res, exam);
});
