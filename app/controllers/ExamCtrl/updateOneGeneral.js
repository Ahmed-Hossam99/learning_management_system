const $baseCtrl = require("../$baseCtrl");
const models = require("../../models");
const { APIResponse } = require("../../utils");

module.exports = $baseCtrl(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return APIResponse.NotFound(res);
  const exam = await models.generalExam.findById(id).select("-students");
  if (!exam) return APIResponse.NotFound(res, "No General exam with that id");

  if (exam.addedBy !== req.me.id && req.me.role !== "admin")
    return APIResponse.Forbidden(res, "Dont allow to do this action");

  delete req.body.object;
  delete req.body.objectType;
  delete req.body.addedBy;
  delete req.body.questions;
  delete req.body.subject;

  if (req.body.duration !== undefined) {
    req.body.isTimed = req.body.duration === null ? false : true;
  }

  await exam.set(req.body).save();

  return APIResponse.Ok(res, exam);
});
