const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const eid = parseInt(req.params.eid);
  if (isNaN(eid)) return APIResponse.NotFound(res);
  const exam = await models._exam.findById(eid).select("-students");
  if (!exam) return APIResponse.NotFound(res, "NO Exam with that id");

  if (exam.addedBy !== req.me.id && req.me.role !== "admin")
    return APIResponse.Forbidden(res, "Dont allow to do this action");
  const routePath = req.route.path.split("/");
  const objectType = routePath[3] === "lecture" ? "lecture" : "other";

  const oid = parseInt(req.params.oid);
  if (isNaN(oid)) return APIResponse.NotFound(res);
  const object = await models[objectType].findById(oid).populate("subject");
  if (!object) return APIResponse.NotFound(res);
  const subject = objectType === "lecture" ? object.subject._id : null;
  const user = req.me;

  const questions = req.body;

  for (let i = 0; i < questions.length; i++) {
    let question = questions[i];
    question.addedBy = user.id;
    question.object = oid;
    question.objectType = objectType;
    question.subject = subject;
    let type = question.type;
    if (!type)
      return APIResponse.BadRequest(res, "Type of question is required .");
    let newQuestion = await new models[type](question).save();
    exam.questions.push({
      question: newQuestion.id,
      point: question.point,
    });
  }

  await exam.save();
  await models._exam.populate(exam, [
    "questions.question",
    "questions.childrenQuestions.child",
  ]);
  return APIResponse.Ok(res, exam);
});
